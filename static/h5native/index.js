async function install(packages) {
  if (typeof packages === 'string') {
    packages = [packages]
  }

  const npm = require('npm')
  const util = require('util')
  await util.promisify(npm.load)({ save: true })

  const data = await util.promisify(npm.commands.install)(packages)
  return data
}

function $require(path) {
  const { remote } = require('electron')
  const settings = require('electron-settings')

  const requireWhitelist = [
    'custom-electron-titlebar'
  ]

  const requireBlacklist = [
    'electron-settings'
  ]

  const authorizedSites = settings.get('authorizedSites', [])

  if (requireWhitelist.indexOf(path) !== -1) {
    return require(path)
  }
  if (requireBlacklist.indexOf(path) !== -1) {
    return null
  }

  if (authorizedSites.indexOf(window.location.href) === -1 && !settings.get('trustAllApps', false)) {
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
    if (path === 'h5native') {
      path = './h5native'
    }
    return require(path)
  } catch (e) {
    console.log(e)
    return null
  }
}

module.exports = {
  install,
  require: $require
}
