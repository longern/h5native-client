import { BrowserWindow } from 'electron'
import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import request from 'request'
import settings from 'electron-settings'
import url from 'url'

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createCenterWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
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
    mainWindow = null
  })
}

function createAppWindow (argv, workingDirectory) {
  const appURL = _.last(argv).replace(/^h5na/, 'https')

  const parsedAppUrl = new url.URL(appURL)

  if (_.includes(['localhost', '127.0.0.1'], parsedAppUrl.hostname) || settings.get('disableHTTPS', false)) {
    parsedAppUrl.protocol = 'http'
  }

  mainWindow = new BrowserWindow({
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
    mainWindow = null
  })

  mainWindow.webContents.on('page-favicon-updated', async (event, favicons) => {
    try {
      const iconStream = fs.createWriteStream('favicon.ico')
      request(favicons[0]).pipe(iconStream)

      iconStream.on('close', () => {
        mainWindow.setIcon('favicon.ico')
      })
    } catch (e) {
      console.log(e)
    }
  })
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
