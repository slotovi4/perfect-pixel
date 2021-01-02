import { IImage } from './types';

// ключ localStorage для истории изображений
const imageHistoryKey = 'imageHistory';

/**
 * Сохранить изображение в store загруженных изображений
 * @param image - Параметры изображения
 */
export const saveImageToStore = (image: IImage) => {

	// получим текущий store загруженных изображений
	const savedImagesList = getImagesListFromStore();

	// создадим новый массив изображений с загруженным изображением
	const newStoreList = [image, ...savedImagesList];

	// обновим store изображений
	localStorage.setItem(imageHistoryKey, JSON.stringify(newStoreList));
};

/**
 * Получим store загруженных изображений
 */
export const getImagesListFromStore = () => {

	// получим текущий store загруженных изображений
	const store = localStorage.getItem(imageHistoryKey);
	const savedImagesList: IImage[] = store ? JSON.parse(store) : [];

	return savedImagesList;
};

/**
 * Очистим store загруженных изображений
 */
export const clearImagesListFromStore = () => {
	localStorage.removeItem(imageHistoryKey);
};