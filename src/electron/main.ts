import { BrowserWindow, app, ipcMain, globalShortcut } from 'electron';
import { handleSquirrelEvent } from './helpers';
import * as isDev from 'electron-is-dev';

if (!handleSquirrelEvent(app)) {
	let mainWindow: Electron.BrowserWindow | null = null;

	const createWindow = async () => {
		mainWindow = new BrowserWindow({
			width: 800,
			height: 400,
			transparent: true,
			frame: false,
			webPreferences: {
				// devTools: false
			}
		});

		mainWindow.setMinimizable(false);
		mainWindow.setMaximizable(false);
		mainWindow.loadURL(`file://${__dirname}/index.html`);
		// mainWindow.webContents.openDevTools();
		mainWindow.webContents.openDevTools({ mode: 'undocked' });

		app.commandLine.appendSwitch('enable-transparent-visuals');

		mainWindow.on('closed', () => { mainWindow = null; });

		// Send messages
		mainWindow.webContents.send('cl', '123466');

		app.on('browser-window-focus', () => {
			globalShortcut.register('CommandOrControl+R', () => {
				console.log('CommandOrControl+R is pressed: Shortcut Disabled');
			});
			globalShortcut.register('F5', () => {
				console.log('F5 is pressed: Shortcut Disabled');
			});
		});

		app.on('browser-window-blur', () => {
			globalShortcut.unregister('CommandOrControl+R');
			globalShortcut.unregister('F5');
		});

		// Listen messages
		ipcMain.on('message', () => console.log(1));

		mainWindow.webContents.on('did-finish-load', () => {
			if (mainWindow) {
				if (!isDev) {
					// run auto updater
				}
			}
		});

		process.on('uncaughtException', (error) => mainWindow && mainWindow.webContents.send('cl', error));
	};

	app.on('ready', createWindow);

	// Quit when all windows are closed.
	app.on('window-all-closed', () => {
		if (process.platform !== 'darwin') {
			app.quit();
		}
	});

	app.on('activate', () => {
		if (mainWindow === null) {
			createWindow();
		}
	});
}