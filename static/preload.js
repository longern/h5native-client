(function() {
  const h5native = require('./h5native')
  const { remote } = require('electron')
  const settings = require('electron-settings')
  const parseArgs = remote.getCurrentWindow().parseArgs || {}

  // Fix missing of setImmediate
  const setImmediateBackup = setImmediate
  process.once('loaded', function() {
    global.setImmediate = setImmediateBackup;
  });

  window.installPackage = name => new Promise(function(resolve, reject) {
    const process = require('process')
    const cwd = process.cwd()
    process.chdir(process.resourcesPath + '/app')

    const npm = window.require('npm')
    npm.load({
      save: true
    }, function(loadError) {
      npm.commands.install(name, function(err, data) {
        process.chdir(cwd)
        resolve(data)
      })
    })
  })

  window.registerFileExtension = function(ext) {
    let fileExtensionTable = settings.get('fileExtensionTable', {})
    fileExtensionTable[ext] = window.location.href
    settings.set('fileExtensionTable', fileExtensionTable)
  }

  window.require = h5native.require

  window.buildFromTemplate = remote.Menu.buildFromTemplate

  if (settings.get('developerMode')) {
    document.addEventListener('keydown', function(ev) {
      switch (ev.which) {
        case 116:
          location.reload()
          break
        case 122:
          remote.getCurrentWindow().setFullScreen(!remote.getCurrentWindow().isFullScreen())
          break
        case 123:
          remote.getCurrentWebContents().toggleDevTools()
          break
      }
    })
  }

  if (parseArgs.titlebar) {
    document.addEventListener('DOMContentLoaded', function() {
      const customTitlebar = require('custom-electron-titlebar')
      new customTitlebar.Titlebar({})
    })
  }
})()
