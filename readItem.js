// Modules
const { BrowserWindow } = require('electron');

// BrowserWindow
let bgItemWin

// New read item method
module.exports = (url, callback) => {

    // Create new offscreen BrowserWindow
    bgItemWin = new BrowserWindow({
        width: 1000,
        height: 1000,
        show: false,
        webPreferences: {
            offscreen: true
        }
    });

    // load read item
    bgItemWin.loadURL(url);

    // wait for page to finish loading
    bgItemWin.webContents.on('did-finish-load', () => {
        // Get screenshot (thumbnail)
        bgItemWin.webContents.capturePage((image) => {
            // Get image as dataURI
            let screenshot = image.toDataURL();

            // Get page title
            let title = bgItemWin.getTitle();

            // return new item via callback
            callback({title, screenshot, url});

            // clean up
            bgItemWin.close();
            bgItemWin = null;
        })

    })
}