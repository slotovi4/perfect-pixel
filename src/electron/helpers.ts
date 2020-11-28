import { App, AutoUpdater, MessageBoxOptions } from 'electron';
import * as ChildProcess from 'child_process';
import * as path from 'path';

const handleSquirrelEvent = (app: App) => {
    if (process.argv.length === 1) {
        return false;
    }

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = (command: string, args: string[]) => {
        let spawnedProcess;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
        } catch (error) {
            console.log(error);
        }

        return spawnedProcess;
    };

    const spawnUpdate = (args: string[]) => {
        return spawn(updateDotExe, args);
    };

    // eslint-disable-next-line prefer-destructuring
    const squirrelEvent = process.argv[1];
    
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(app.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            app.quit();
            return true;
        default:
            return false;
    }
};

const initAutoUpdaterLog = (autoUpdater: AutoUpdater, sendStatusToWindow: (options: MessageBoxOptions) => void) => {
    autoUpdater.on('checking-for-update', () => sendStatusToWindow({ message: 'Checking for update...' }));
    autoUpdater.on('update-available', () => sendStatusToWindow({ message: 'Update available.' }));
    autoUpdater.on('update-not-available', () => sendStatusToWindow({ message: 'Update not available.' }));
    autoUpdater.on('error', (err) => sendStatusToWindow({ message: 'Error in auto-updater. ' + err }));
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
        const dialogOpts = {
            type: 'info',
            buttons: ['Restart', 'Later'],
            title: 'Application Update',
            message: process.platform === 'win32' ? releaseNotes : releaseName,
            detail: 'A new version has been downloaded. Restart the application to apply the updates.'
        };

        sendStatusToWindow(dialogOpts);
    });
};

export { handleSquirrelEvent, initAutoUpdaterLog };