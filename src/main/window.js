import { BrowserWindow } from 'electron'
import _ from 'lodash'
import path from 'path'
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
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function createAppWindow (argv, workingDirectory) {
  const appURL = _.last(argv).replace(/^h5na/, 'https')

  const parsedAppUrl = new url.URL(appURL)

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

  mainWindow.loadURL(appURL)

  mainWindow.on('closed', () => {
    mainWindow = null
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
