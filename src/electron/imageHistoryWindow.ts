import { BrowserWindow, ipcMain } from 'electron';
import * as isDev from 'electron-is-dev';

// окно истории изображений
let imageHistoryWindow: Electron.BrowserWindow | null = null;

/**
 * Создадим окно истории изображений
 */
export const createImageHistoryWindow = async () => {

	// настройки окна
	imageHistoryWindow = new BrowserWindow({
		width: 300,
		height: 200,
		frame: false,
		hasShadow: false,
		maximizable: false,
		transparent: true,
		show: false,
		webPreferences: {
			nodeIntegration: true,
			devTools: isDev
		}
	});

	// загрузим index.html
	imageHistoryWindow.loadURL(`file://${__dirname}/index.html?imageHistory`);

	// когда теряем фокус с окна - скроем окно
	imageHistoryWindow.on('blur', () => {
		if (imageHistoryWindow) {
			imageHistoryWindow.hide();
		}
	});

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

	// когда получаем сообщение на добавления изображения в историю
	ipcMain.on('addImageToImageHistoryWindow', (e, image: IImage) => {
		if (imageHistoryWindow) {

			// отправим новое изображение на клиент imageHistory
			imageHistoryWindow.webContents.send('addImage', image);
		}
	});

	// слушатель на получение ошибок
	process.on('uncaughtException', (error) => {
		if(imageHistoryWindow) {
			imageHistoryWindow.webContents.send('error', error);
		}
	});
};

/**
 * Возвращает окно истории изображений
 */
export const getImageHistoryWindow = () => {
	return imageHistoryWindow;
};

interface IImage {
	width: number;
	height: number;
	src: string;
	name: string;
}