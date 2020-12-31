import { getIpcRenderer } from '../../electron/helpers';
import { IImage } from 'store';

const ipcRenderer = getIpcRenderer();

/**
 * События при клике на кнопку "закрыть окно истории изображений"
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

type TAddImageCallback = (image: IImage) => void;