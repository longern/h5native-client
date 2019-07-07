'use strict'

import { app, Menu } from 'electron'
import { createWindow } from './window'

// Enable autoplay
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')

// Single instance
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
  process.exit()
}

app.on('second-instance', (event, argv, workingDirectory) => {
  createWindow(argv, workingDirectory)
})

if (process.env.NODE_ENV !== 'development') {
  /**
   * Set `__static` path to static files in production
   * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
   */
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')

  // Register h5na URL scheme
  app.setAsDefaultProtocolClient('h5na')
}

app.on('open-url', function (event, url) {
  process.argv.push(url)
  event.preventDefault()
})

app.on('ready', function () {
  createWindow(process.argv)

  // Clear application menu
  Menu.setApplicationMenu(null)
})

app.on('certificate-error', (event, webContents, url, error, certificate, next) => {
  if (/https:\/\/localhost/g.test(url)) {
    event.preventDefault()
    next(true)
  } else {
    next(false)
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
