
/**
 * Получим ipcRenderer
 */
export const getIpcRenderer = () => {
	const isElectronRunning = window && window.process && window.process.versions['electron'];

	if (isElectronRunning) {

		const { ipcRenderer } = window.require('electron');
		return ipcRenderer;
	}

	return null;
};