import { getIpcRenderer } from '../../helpers';
import { IMoveWindowData } from '../../types';

const ipcRenderer = getIpcRenderer();
let moveWindowData: IMoveWindowData = { mouseX: 0, mouseY: 0 };

/**
 * При опускании мыши вешаем слушатели на передвижение окна
 * @param event - MouseEvent 
 */
export const onMouseDown = ({ target, clientX, clientY }: MouseEvent) => {
	if (ipcRenderer) {

		// сохраним положение курсора
		moveWindowData = { mouseY: clientY, mouseX: clientX };

		// если клик по не перетаскиваемым элементам
		if (target instanceof HTMLElement && (
			target.tagName === 'BUTTON' ||
			target.tagName === 'LABEL' ||
			target.tagName === 'INPUT'
		)) {
			return;
		}

		// вешаем слушатели
		document.addEventListener('mouseup', stopMovingWindow);
		document.addEventListener('mousemove', moveWindow);
	}
};

/**
 * Остановим передвижение окна очистив слушатели
 */
const stopMovingWindow = () => {
	if (ipcRenderer) {

		// очистим слушатели
		document.removeEventListener('mouseup', stopMovingWindow);
		document.removeEventListener('mousemove', moveWindow);
	}
};

/**
 * Отправим сообщение к main на передвижение окна
 */
const moveWindow = () => {
	if (ipcRenderer) {

		// отправим сообщение к mail
		ipcRenderer.send('windowMoving', moveWindowData);
	}
};