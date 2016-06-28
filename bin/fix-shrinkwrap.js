// Removes optional dependencies in package.json from npm-shrinkwrap.json,
// allowing the OS X-specific "fsevents" module to be used while the project
// gets deployed to linux systems for testing/deployment
//
// Use  after "npm shrinkwrap"

// See https://github.com/npm/npm/issues/2679
// See https://github.com/bocoup/service-catalog/blob/fe3fab7fc67d7b0e595db59e90377b5a8dbe7338/tools/fix-shrinkwrap.js

// TODO: This should be removed once the cross platform issue with shrinkwrap is resolved

const fs = require('fs')
const path = require('path')
const pkg = require('../package')
const shrinkwrap = require('../npm-shrinkwrap')

const optionals = Object.keys(pkg.optionalDependencies || [])
optionals.forEach((name) => {
  console.log(`Ensuring optional dependency "${name}" is removed`)
  delete shrinkwrap.dependencies[name]
})

fs.writeFileSync(
  path.resolve(__dirname, '..', 'npm-shrinkwrap.json'),
  JSON.stringify(shrinkwrap, null, 2)
)
console.log('Rewrote npm-shrinkwrap.json')
