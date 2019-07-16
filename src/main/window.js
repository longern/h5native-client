import { BrowserWindow } from 'electron'
import _ from 'lodash'
import fs from 'fs'
import os from 'os'
import path from 'path'
import request from 'request'
import settings from 'electron-settings'
import url from 'url'

let mainWindows = []
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createCenterWindow () {
  /**
   * Initial window options
   */
  const mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    _.pull(mainWindows, mainWindow)
  })

  mainWindows.push(mainWindow)
}

function createAppWindow (argv, workingDirectory) {
  const appURL = _.last(argv).replace(/^h5na/, 'https')

  const parsedAppUrl = new url.URL(appURL)

  if (_.includes(['localhost', '127.0.0.1'], parsedAppUrl.hostname) || settings.get('disableHTTPS', false)) {
    parsedAppUrl.protocol = 'http'
  }

  const mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    frame: false,
    show: !parsedAppUrl.searchParams.get('hide'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: path.join(__static, 'preload.js')
    }
  })

  mainWindow.loadURL(parsedAppUrl.href)

  mainWindow.on('closed', () => {
    _.pull(mainWindows, mainWindow)
  })

  mainWindow.webContents.on('page-favicon-updated', async (event, favicons) => {
    request(favicons[0])
      .on('response', (resp) => {
        const iconPath = path.join(fs.mkdtempSync(`${os.tmpdir()}${path.sep}`), 'favicon.ico')
        const iconStream = fs.createWriteStream(iconPath)
        resp.pipe(iconStream)

        iconStream.on('close', () => {
          try {
            mainWindow.setIcon(iconPath)
          } catch (e) { /* Ignore */ }
        })
      })
      .on('error', () => {})
  })

  mainWindows.push(mainWindow)
}

function createWindow (argv, workingDirectory) {
  /**
   * Initial window options
   */
  if (_.startsWith(_.last(argv), 'h5na')) {
    createAppWindow(argv, workingDirectory)
  } else {
    createCenterWindow(argv, workingDirectory)
  }
}

export {
  createWindow
}
