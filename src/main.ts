import { app, BrowserWindow } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";

const isDev = !!MAIN_WINDOW_VITE_DEV_SERVER_URL;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

// Correctly get the icon path
const getIconPath = () => {
  return isDev
    ? path.join(process.cwd(), "public/icons/icon.ico")
    : path.join(__dirname, "icons/icon.ico");
};

let mainWindow: BrowserWindow | null;
let splashWindow: BrowserWindow | null;

const createWindow = () => {
  if (splashWindow) {
    splashWindow.close();
    splashWindow = null;
  }
  if (mainWindow) {
    mainWindow.close();
    mainWindow = null;
  }

  // Splash Screen
  splashWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
  });

  // Correct path for splash screen
  const splashPath = isDev
    ? path.join(process.cwd(), "public/splash.html")
    : path.join(__dirname, "splash.html");

  splashWindow
    .loadFile(splashPath)
    .catch((err) => console.error("Splash Error:", err));

  // Main Window (initially hidden)
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false, // Only show after splash
    title: "My Electron Forge App",
    icon: getIconPath(),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Load the app's content
  if (isDev) {
    // Load the development server URL during development
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    // Load the production HTML file
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Ensure the main window shows only after the splash is done
  mainWindow.webContents.once("did-finish-load", () => {
    setTimeout(() => {
      if (splashWindow) splashWindow.close();
      mainWindow?.show();
    }, 2000); // Delay to ensure splash is visible
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

// Event: Called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  // macOS: Recreate a window in the app when the dock icon is clicked
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Event: Quit the app when all windows are closed (except on macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
