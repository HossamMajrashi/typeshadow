const { app, BrowserWindow, Tray, Menu } = require("electron");
const path = require("path");

let mainWindow;
let tray;
let runInBackground = false; // Default: app quits on close

/**
 * Create the main application window
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 600,
    minHeight: 500,
    show: false, // Wait until ready
    backgroundColor: '#ffffff', // Prevent white flash
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, "Icons", "256x256.png"),
  });

  mainWindow.loadFile("index.html");

  // Show window when content is ready - prevents layout flash
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // Handle window close button
  mainWindow.on("close", (event) => {
    if (runInBackground && !app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
    // If runInBackground is false, window closes normally
  });

  // Handle minimize button
  mainWindow.on("minimize", (event) => {
    if (runInBackground) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // Clean up on window closed
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  createTray();
}

/**
 * Create system tray icon with context menu
 */
function createTray() {
  const trayIcon = path.join(__dirname, "Icons", "32x32.png");
  tray = new Tray(trayIcon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show TypeShadow",
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    {
      type: "separator"
    },
    {
      label: "Run in Background",
      type: "checkbox",
      checked: runInBackground,
      click: (menuItem) => {
        runInBackground = menuItem.checked;
      },
    },
    {
      type: "separator"
    },
    {
      label: "Quit",
      click: () => {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip("TypeShadow - Typing Trainer");
  tray.setContextMenu(contextMenu);

  // Double-click tray icon to show window
  tray.on("double-click", () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

/**
 * App initialization
 */
app.whenReady().then(() => {
  app.setAppUserModelId("com.typeshadow.app");
  createWindow();

  // macOS: Re-create window when dock icon is clicked
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

/**
 * Handle all windows closed
 */
app.on("window-all-closed", () => {
  // On macOS, apps typically stay active until Command+Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});
