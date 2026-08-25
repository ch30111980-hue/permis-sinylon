const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 1024,
    minHeight: 700,
    title: 'SINYLON - STELLANTIS | Gestionnaire de Permis de Travail (W.P.E.E.X)',
    backgroundColor: '#0b0f19',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Menu bar minimal
  mainWindow.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handler: Print A4 Document
ipcMain.handle('print-document', async (event, options) => {
  if (!mainWindow) return { success: false, error: 'No active window' };
  try {
    mainWindow.webContents.print({
      silent: false,
      printBackground: true,
      pageSize: 'A4',
      margins: { marginType: 'none' }
    }, (success, failureReason) => {
      if (!success) console.log('Print failed or cancelled:', failureReason);
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// IPC Handler: Export to PDF
ipcMain.handle('export-pdf', async (event, { filename = 'Permis_SINYLON.pdf' } = {}) => {
  if (!mainWindow) return { success: false, error: 'No active window' };
  try {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Enregistrer le Permis en PDF',
      defaultPath: path.join(app.getPath('documents'), filename),
      filters: [{ name: 'PDF Documents', extensions: ['pdf'] }]
    });

    if (canceled || !filePath) return { success: false, canceled: true };

    const pdfData = await mainWindow.webContents.printToPDF({
      pageSize: 'A4',
      printBackground: true,
      landscape: false,
      margins: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }
    });

    await fs.promises.writeFile(filePath, pdfData);
    return { success: true, filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// IPC Handler: Save QR Image PNG
ipcMain.handle('save-qr-image', async (event, { base64Data, filename = 'QR_SINYLON.png' }) => {
  try {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Enregistrer l\'image du QR Code',
      defaultPath: path.join(app.getPath('pictures'), filename),
      filters: [{ name: 'Images PNG', extensions: ['png'] }]
    });

    if (canceled || !filePath) return { success: false, canceled: true };

    const base64Image = base64Data.replace(/^data:image\/png;base64,/, '');
    await fs.promises.writeFile(filePath, base64Image, 'base64');
    return { success: true, filePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
});
