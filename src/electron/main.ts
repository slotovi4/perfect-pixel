import { BrowserWindow, app, globalShortcut, ipcMain, screen, clipboard } from 'electron';
import { IMoveWindowData } from '../types';
import { handleSquirrelEvent } from './helpers';
import * as isDev from 'electron-is-dev';

if (!handleSquirrelEvent(app)) {
	let mainWindow: Electron.BrowserWindow | null = null;

	const createWindow = async () => {
		mainWindow = new BrowserWindow({
			width: 895,
			height: 400,
			transparent: true,
			frame: false,
			hasShadow: false,
			webPreferences: {
				nodeIntegration: true,
				devTools: isDev
			}
		});

		mainWindow.setMinimizable(false);
		mainWindow.setMaximizable(false);
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
		ipcMain.on('close-window', () => {
			app.quit();
		});

		// когда получем сообщение на движение окна
		ipcMain.on('windowMoving', (e, { mouseX, mouseY }: IMoveWindowData) => {
			if (mainWindow) {

				// получаем координаты курсора
				const { x, y } = screen.getCursorScreenPoint();

				// установим новое положение окна
				mainWindow.setPosition(x - mouseX, y - mouseY);
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
				if (mainWindow) {
					mainWindow.webContents.send('on-paste-image', clipboard.readImage().toDataURL());
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