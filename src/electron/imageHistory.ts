import {
	BrowserWindow,
	app,
	globalShortcut,
	ipcMain,
	screen,
} from 'electron';
import { IMoveWindowFromMouseData } from './types';
import * as isDev from 'electron-is-dev';

// главное окно
let imageHistoryWindow: Electron.BrowserWindow | null = null;

/**
 * Создадим главное окно
 */
export const createImageHistoryWindow = async () => {

	// настройки окна
	imageHistoryWindow = new BrowserWindow({
		width: 300,
		height: 200,
		frame: false,
		hasShadow: false,
		maximizable: false,
		show: false,
		webPreferences: {
			nodeIntegration: true,
			devTools: isDev
		}
	});

	// загрузим index.html
	imageHistoryWindow.loadURL(`file://${__dirname}/index.html?imageHistory`);

	// если dev
	if (isDev) {

		// откроем dev tools
		imageHistoryWindow.webContents.openDevTools({ mode: 'undocked' });
	}

	// при закрытии окна уничтожим window
	imageHistoryWindow.on('closed', () => { imageHistoryWindow = null; });

	// когда получаем сообщение на закрытие окна
	ipcMain.on('hideImageHistory', () => {
		if (imageHistoryWindow) {
			imageHistoryWindow.hide();
		}
	});

	// когда получаем сообщение на открытие окна
	ipcMain.on('showImageHistory', () => {
		if (imageHistoryWindow) {
			imageHistoryWindow.show();
		}
	});

	// когда получаем сообщение на сворачивание окна
	ipcMain.on('minimizeApp', () => {
		if (imageHistoryWindow && !imageHistoryWindow.isMinimized()) {
			imageHistoryWindow.minimize();
		}
	});

	// когда получем сообщение на движение окна путем перетаскивания мышкой
	ipcMain.on('moveWindowFromMouse', (e, { mouseX, mouseY }: IMoveWindowFromMouseData) => {
		if (imageHistoryWindow) {

			// получаем координаты курсора
			const { x, y } = screen.getCursorScreenPoint();

			// установим новое положение окна
			imageHistoryWindow.setPosition(x - mouseX, y - mouseY);
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
	});

	// когда окно теряет фокус - снимаем слушатели
	app.on('browser-window-blur', () => {
		globalShortcut.unregister('CommandOrControl+R');
		globalShortcut.unregister('F5');
		globalShortcut.unregister('CommandOrControl+V');
	});

	// слушатель на получение ошибок
	process.on('uncaughtException', (error) => imageHistoryWindow && imageHistoryWindow.webContents.send('cl', error));
};