import { getIpcRenderer } from '../../electron/helpers';
import { IImage } from 'store';

const ipcRenderer = getIpcRenderer();

/**
 * Отправим сообщение на закрытие окна истории изображений
 */
export const hideImageHistory = () => {
	if (ipcRenderer) {

		// отправляем сообщение к main на закрытие окна
		ipcRenderer.send('hideImageHistory');
	}
};

/**
 * Вызывает callback при добавлении нового изображения с главного окна
 * @param callBack - функция принимающая новое изображение
 */
export const addImageListener = (callBack: TAddImageCallback) => {
	if (ipcRenderer) {
		ipcRenderer.on('addImage', (event, image: IImage) => {
			callBack(image);
		});
	}
};

/**
 * Отправим сообщение в homeWindow на установку изображения из истории изображений
 * @param historyImage - изображение из истории
 */
export const setHistoryImage = (historyImage: IImage) => {
	if (ipcRenderer) {
		ipcRenderer.send('setHistoryImage', historyImage);
	}
};

/**
 * Слушатель ошибок
 */
export const errorListener = () => {
	if (ipcRenderer) {
		ipcRenderer.on('error', (event, error: Error) => {
			console.log(error.name);
			console.log(error.message);
			throw new Error(error.name);
		});
	}
};

type TAddImageCallback = (image: IImage) => void;