import { BrowserWindow, app, ipcMain } from 'electron';
import { handleSquirrelEvent } from './helpers';
import * as isDev from 'electron-is-dev';

if (!handleSquirrelEvent(app)) {
    let mainWindow: Electron.BrowserWindow | null = null;

    const createWindow = async () => {
        mainWindow = new BrowserWindow({
            width: 800,
            height: 800
        });

        mainWindow.setMinimizable(false);
        mainWindow.setMaximizable(false);
        mainWindow.loadURL(`file://${__dirname}/index.html`);
        mainWindow.webContents.openDevTools();

        mainWindow.on('closed', () => { mainWindow = null; });

        // Send messages
        mainWindow.webContents.send('cl', '123466');

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