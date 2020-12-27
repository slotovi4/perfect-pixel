import {
	IMoveWindowFromMouseData,
	IMoveWindowFromKeysData,
	TResizeWindow,
	EMoveWindowKeys
} from '../../electron/types';
import { getIpcRenderer } from '../../electron/helpers';

const ipcRenderer = getIpcRenderer();
let moveWindowFromMouseData: IMoveWindowFromMouseData = { mouseX: 0, mouseY: 0 };

/**
 * При опускании мыши вешаем слушатели на передвижение окна по курсору мыши
 * @param mouseEvent - MouseEvent 
 */
export const onMouseDown = ({ target, clientX, clientY }: MouseEvent) => {
	if (ipcRenderer) {

		// сохраним положение курсора
		moveWindowFromMouseData = { mouseY: clientY, mouseX: clientX };

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
		document.addEventListener('mousemove', onMoveWindowFromMouse);
	}
};

/**
 * При опускании клавиши вешаем слушатель на стрелки или wasd 
 * @param keyboardEvent - KeyboardEvent 
 */
export const onKeyDown = ({ code, shiftKey }: KeyboardEvent) => {

	// получим список всех клавиш с помощью которых будем двигать окно
	const windowKeysList: string[] = Object.values(EMoveWindowKeys);

	// если клавиша на движение
	if (windowKeysList.includes(code)) {

		// двигаем окно вверх
		if (code === EMoveWindowKeys.W || code === EMoveWindowKeys.Up) {
			onMoveWindowFromKeys({ shiftX: 0, shiftY: shiftKey ? -10 : -1 });
		}

		// двигаем окно вниз
		if (code === EMoveWindowKeys.S || code === EMoveWindowKeys.Down) {
			onMoveWindowFromKeys({ shiftX: 0, shiftY: shiftKey ? 10 : 1 });
		}

		// двигаем окно влево
		if (code === EMoveWindowKeys.A || code === EMoveWindowKeys.Left) {
			onMoveWindowFromKeys({ shiftX: shiftKey ? -10 : -1, shiftY: 0 });
		}

		// двигаем окно вправо
		if (code === EMoveWindowKeys.D || code === EMoveWindowKeys.Right) {
			onMoveWindowFromKeys({ shiftX: shiftKey ? 10 : 1, shiftY: 0 });
		}
	}
};

/**
 * Вешает слушатель на вставку изображения
 * @param callback - функция принимающая src вставленной картинки
 */
export const listenPasteImage = (callback: (imageSrc: string) => void) => {
	if (ipcRenderer) {

		// вешаем слушатель на вставку изображения через clipboard от main
		ipcRenderer.on('on-paste-image', (event, imageSrc: string) => {
			callback(imageSrc);
		});
	}
};

/**
 * Меняет размеры основного окна приложения
 * @param sizeData TResizeWindow
 */
export const resizeWindow = (sizeData: TResizeWindow) => {
	if (ipcRenderer) {

		ipcRenderer.send('resizeWindow', sizeData);
	}
};

/**
 * События при клике на кнопку "закрыть приложение"
 */
export const onCloseApp = () => {
	if (ipcRenderer) {

		// отправляем сообщение к main на закрытие приложения
		ipcRenderer.sendSync('closeApp');
	}
};

/**
 * События при клике на кнопку "свернуть приложение"
 */
export const onMinimizeApp = () => {
	if (ipcRenderer) {

		// отправляем сообщение к main на сворачивание приложения
		ipcRenderer.send('minimizeApp');
	}
};


/**
 * Возвращает значение - есть ли ipcRenderer
 */
export const isHaveIpcRenderer = () => {
	return Boolean(ipcRenderer);
};

/**
 * Остановим передвижение окна очистив слушатели
 */
const stopMovingWindow = () => {
	if (ipcRenderer) {

		// очистим слушатели
		document.removeEventListener('mouseup', stopMovingWindow);
		document.removeEventListener('mousemove', onMoveWindowFromMouse);
	}
};

/**
 * Отправим сообщение к main на передвижение окна с помощью мыши
 */
const onMoveWindowFromMouse = () => {
	if (ipcRenderer) {

		// отправим сообщение к main
		ipcRenderer.send('moveWindowFromMouse', moveWindowFromMouseData);
	}
};

/**
 * Отправим сообщение к main на передвижение окна с помощью стрелок или клавиш wasd
 * @param moveWindowFromKeysData - данные по сдвигу окна по оси x/y
 */
const onMoveWindowFromKeys = (moveWindowFromKeysData: IMoveWindowFromKeysData) => {
	if (ipcRenderer) {

		// отправим сообщение к main
		ipcRenderer.send('moveWindowFromKeys', moveWindowFromKeysData);
	}
};