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

module.exports = {
  install
}
