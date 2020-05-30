const { app, BrowserWindow } = require('electron')
const url = require("url");
const path = require("path");

let win;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        'minHeight': 800,
        'minWidth': 1200,
        backgroundColor: '#ffffff',
        webPreferences: {
            nodeIntegration: true
        }

    })

    win.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/TunRW-Angular/index.html`),
            protocol: "file:",
            slashes: true
        })
    );



    //// uncomment below to open the DevTools.
    win.webContents.openDevTools()

    // Event when the window is closed.
    win.on('closed', function () {
        win = null
    })

    win.webContents.on('did-fail-load', () => {
        console.log('did-fail-load');
        win.loadURL(url.format({
            pathname: path.join(__dirname, `/dist/TunRW-Angular/index.html`),
            protocol: 'file:',
            slashes: true
        }));
        // REDIRECT TO FIRST WEBPAGE AGAIN
    });

}

// Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {

    // On macOS specific close process
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // macOS specific close process
    if (win === null) {
        createWindow()
    }
})