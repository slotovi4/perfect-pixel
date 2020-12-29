import { IImage } from './types';

const imageHistoryKey = 'imageHistory';

export const saveImageToStore = (image: IImage) => {

	const savedImagesList = getImagesListFromStore();
	const newStoreList = [image, ...savedImagesList];

	localStorage.setItem(imageHistoryKey, JSON.stringify(newStoreList));
};

export const getImagesListFromStore = () => {

	const store = localStorage.getItem(imageHistoryKey);
	const savedImagesList: IImage[] = store ? JSON.parse(store) : [];

	return savedImagesList;
};