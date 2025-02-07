import { ipcMain } from "electron";

export const initializeIpcHandlers = () => {
  // Close the app gracefully
  ipcMain.on("close-app", () => {
    console.log("Closing the application...");
  });
};
