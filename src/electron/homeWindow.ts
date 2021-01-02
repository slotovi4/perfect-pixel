import {
	BrowserWindow,
	app,
	globalShortcut,
	ipcMain,
	screen,
	clipboard
} from 'electron';
import {
	IMoveWindowFromMouseData,
	IMoveWindowFromKeysData,
	TResizeWindow
} from './types';
import { createImageHistoryWindow, getImageHistoryWindow } from './imageHistoryWindow';
import { handleSquirrelEvent } from './helpers';
import * as isDev from 'electron-is-dev';

if (!handleSquirrelEvent(app)) {

	// главное окно
	let mainWindow: Electron.BrowserWindow | null = null;

	// минимальные размеры окна
	const minHeight = 54;
	const minWidth = 720;
	
	// путь к html
	const mainHtmlUrl = `file://${__dirname}/index.html?main`;

	/**
	 * Создадим главное окно
	 */
	const createWindow = async () => {

		// настройки окна
		mainWindow = new BrowserWindow({
			width: minWidth,
			height: minHeight,
			minWidth,
			minHeight,
			transparent: true,
			frame: false,
			hasShadow: false,
			maximizable: false,
			webPreferences: {
				nodeIntegration: true,
				devTools: isDev
			}
		});

		/**
		 * Меняем положение окна истории изображений относительно главного окна
		 */
		const moveImageHistoryWindow = () => {

			// получим окно истории изображений
			const imageHistoryWindow = getImageHistoryWindow();

			if (mainWindow && imageHistoryWindow) {

				// получим координаты
				const [x, y] = mainWindow.getPosition();
				const [width] = mainWindow.getSize();
				const marginLeft = 10;

				// установим новое положение окна
				imageHistoryWindow.setPosition(x + width + marginLeft, y);
			}
		};

		/**
		 * Прочитаем изображение из clipboard и отправим его
		 */
		const readAndSendImageFromClipboard = () => {

			// получим список доступных форматов
			const availableFormatsList = clipboard.availableFormats('clipboard');

			// если формат файла является изображением
			const isImage = availableFormatsList.includes('image/png') || availableFormatsList.includes('image/jpeg');

			// получим изображение
			const image = clipboard.readImage();

			// если изображение есть
			if (mainWindow && isImage && !image.isEmpty()) {

				// отправим src картинки на клиент
				mainWindow.webContents.send('on-paste-image', image.toDataURL());

				// очистим данные в буфере
				clipboard.clear();
			}
		};

		// загрузим index.html
		mainWindow.loadURL(mainHtmlUrl);

		// когда было отправлено событие onload 
		mainWindow.webContents.on('did-finish-load', () => {
			if (mainWindow) {
				if (!isDev) {
					// run auto updater
				}
			}
		});

		// когда получаем сообщение на закрытие окна
		ipcMain.on('closeApp', () => {
			app.quit();
		});

		// когда получаем сообщение на сворачивание окна
		ipcMain.on('minimizeApp', () => {
			if (mainWindow && !mainWindow.isMinimized()) {
				mainWindow.minimize();
			}
		});

		// когда получаем сообщение на установку положения окна истории изображений относительно главного окна
		ipcMain.on('setImageHistoryWindowPosition', () => {
			moveImageHistoryWindow();
		});

		//  когда получаем сообщение на установку изображения из истории изображений
		ipcMain.on('setHistoryImage', (e, image: IImage) => {
			if (mainWindow) {
	
				// отправим новое изображение на клиент imageHistory
				mainWindow.webContents.send('setHistoryImage', image);
			}
		});

		// когда получем сообщение на движение окна путем перетаскивания мышкой
		ipcMain.on('moveWindowFromMouse', (e, { mouseX, mouseY }: IMoveWindowFromMouseData) => {
			if (mainWindow) {

				// получаем координаты курсора
				const { x, y } = screen.getCursorScreenPoint();

				// установим новое положение окна
				mainWindow.setPosition(x - mouseX, y - mouseY);

				// поменяем положение окна истории изображений
				moveImageHistoryWindow();
			}
		});

		// когда получем сообщение на движение окна путем стрелок или wasd
		ipcMain.on('moveWindowFromKeys', (e, { shiftX, shiftY }: IMoveWindowFromKeysData) => {
			if (mainWindow) {

				// получаем координаты курсора
				const windowPositionList = mainWindow.getPosition();
				const xPosition = windowPositionList[0] + shiftX;
				const yPosition = windowPositionList[1] + shiftY;

				// установим новое положение окна
				mainWindow.setPosition(xPosition, yPosition);

				// поменяем положение окна истории изображений
				moveImageHistoryWindow();
			}
		});

		// когда получем сообщение на изменение размеры основного окна приложения
		ipcMain.on('resizeWindow', (event, sizeData: TResizeWindow) => {
			if (mainWindow) {

				// рассчитаем новые размеры окна относительно размеров изображения (Math.ceil для windows)
				const width = Math.ceil(sizeData ? sizeData.width : minWidth);
				const height = Math.ceil(sizeData ? sizeData.height + minHeight : minHeight);

				// установим размеры согласно размерам изображения
				mainWindow.setSize(width, height);

				// поменяем положение окна истории изображений
				moveImageHistoryWindow();
			}
		});

		// когда окно в фокусе - вешаем слушатели
		app.on('browser-window-focus', () => {

			// блок перезагрузки окна
			globalShortcut.register('CommandOrControl+R', () => {
				return;
			});

			// блок перезагрузки окна
			globalShortcut.register('F5', () => {
				return;
			});

			// при вставке элемента читаем изображение и отправляем сообщение
			globalShortcut.register('CommandOrControl+V', () => {
				readAndSendImageFromClipboard();
			});
		});

		// когда окно теряет фокус - снимаем слушатели
		app.on('browser-window-blur', () => {
			globalShortcut.unregister('CommandOrControl+R');
			globalShortcut.unregister('F5');
			globalShortcut.unregister('CommandOrControl+V');
		});

		// слушатель на получение ошибок
		process.on('uncaughtException', (error) => {
			if(mainWindow) {
				mainWindow.webContents.send('error', error);
			}
		});
	};

	app.on('ready', () => {
		createWindow();
		createImageHistoryWindow();
	});

	// закроем приложение когда все окна закрыты
	app.on('window-all-closed', () => {
		if (process.platform !== 'darwin') {
			app.quit();
		}
	});

	app.on('activate', () => {
		if (mainWindow === null) {
			createWindow();
			createImageHistoryWindow();
		}
	});
}

interface IImage {
	width: number;
	height: number;
	src: string;
	name: string;
}