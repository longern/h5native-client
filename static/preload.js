(function() {
  const requireWhitelist = [
    'custom-electron-titlebar'
  ]

  const requireBlacklist = [
    'electron-settings'
  ]

  const { remote } = require('electron')
  const settings = require('electron-settings')
  const parseArgs = remote.getCurrentWindow().parseArgs || {}

  // Fix missing of setImmediate
  const setImmediateBackup = setImmediate
  process.once('loaded', function() {
    global.setImmediate = setImmediateBackup;
  });

  const authorizedSites = settings.get('authorizedSites', [])

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

  window.require = function(path) {
    if (requireWhitelist.indexOf(path) !== -1) {
      return require(path)
    }
    if (requireBlacklist.indexOf(path) !== -1) {
      return null
    }

    if (authorizedSites.indexOf(window.location.href) === -1) {
      const choice = remote.dialog.showMessageBox(remote.getCurrentWindow(), {
        type: 'question',
        buttons: ['Accept', 'Reject'],
        title: 'HTML5 Native Apps',
        message: window.location.href + ' applies to access your computer',
        defaultId: 0,
        cancelId: 1
      })

      const leave = (choice === 1)
      if (leave) {
        return null
      }

      authorizedSites.push(window.location.href)
      settings.set('authorizedSites', authorizedSites)
    }

    try {
      if (path === 'h5na') {
        path = './h5na'
      }
      return require(path)
    } catch (e) {
      console.log(e)
      return null
    }
  }

  window.buildFromTemplate = remote.Menu.buildFromTemplate

  if (parseArgs.browser) {
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
