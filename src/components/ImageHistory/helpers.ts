import { getIpcRenderer } from '../../electron/helpers';

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