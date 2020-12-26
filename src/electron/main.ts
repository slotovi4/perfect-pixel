import {
	BrowserWindow,
	app,
	globalShortcut,
	ipcMain,
	screen,
	clipboard,
} from 'electron';
import { 
	IMoveWindowFromMouseData, 
	IMoveWindowFromKeysData, 
	TResizeWindow 
} from './types';
import { handleSquirrelEvent } from './helpers';
import * as isDev from 'electron-is-dev';

if (!handleSquirrelEvent(app)) {

	// главное окно
	let mainWindow: Electron.BrowserWindow | null = null;

	const minHeight = 54;
	const minWidth = 700;

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
			minimizable: false,
			maximizable: false,
			webPreferences: {
				nodeIntegration: true,
				devTools: isDev
			}
		});

		// загрузим index.html
		mainWindow.loadURL(`file://${__dirname}/index.html`);

		// если dev
		if (isDev) {

			// откроем dev tools
			mainWindow.webContents.openDevTools({ mode: 'undocked' });
		}

		// при закрытии окна уничтожим window
		mainWindow.on('closed', () => { mainWindow = null; });

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

		// когда получем сообщение на движение окна путем перетаскивания мышкой
		ipcMain.on('moveWindowFromMouse', (e, { mouseX, mouseY }: IMoveWindowFromMouseData) => {
			if (mainWindow) {

				// получаем координаты курсора
				const { x, y } = screen.getCursorScreenPoint();

				// установим новое положение окна
				mainWindow.setPosition(x - mouseX, y - mouseY);
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
			}
		});

		// когда получем сообщение на изменение размеры основного окна приложения
		ipcMain.on('resizeWindow', (event, sizeData: TResizeWindow) => {
			if (mainWindow) {

				// если данные есть
				if(sizeData) {

					// установим размеры согласно размерам изображения
					mainWindow.setSize(sizeData.width, sizeData.height + minHeight);
				} else {

					// установим начальные размеры окна
					mainWindow.setSize(minWidth, minHeight);
				}
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

				// получим список доступных форматов
				const availableFormatsList = clipboard.availableFormats('clipboard');

				// если формат файла является изобрадением
				const isImage = availableFormatsList.includes('image/png') || availableFormatsList.includes('image/jpeg');

				// получим изображение
				const image = clipboard.readImage();

				// если изображение есть
				if (mainWindow && isImage && !image.isEmpty()) {

					// отправим src картинки 
					mainWindow.webContents.send('on-paste-image', image.toDataURL());

					// очистим данные в буфере
					clipboard.clear();
				}
			});
		});

		// когда окно теряет фокус - снимаем слушатели
		app.on('browser-window-blur', () => {
			globalShortcut.unregister('CommandOrControl+R');
			globalShortcut.unregister('F5');
			globalShortcut.unregister('CommandOrControl+V');
		});

		// слушатель на получение ошибок
		process.on('uncaughtException', (error) => mainWindow && mainWindow.webContents.send('cl', error));
	};

	app.on('ready', createWindow);

	// закроем приложение когда все окна закрыты
	app.on('window-all-closed', () => {
		if (process.platform !== 'darwin') {
			app.quit();
		}
	});

	app.on('activate', () => {
		if (mainWindow === null) {
			createWindow();
		}
	});
}