/* eslint-disable no-console */
/**
 * Fetches the GraphQL API Test Fixtures from the uobtheatre-api repository, and installs it into the fake API
 *
 * Examples:
 * yarn api:download-fixtures [ Downloads the API Test Fixtures based on the present fixtures lockfile ]
 * yarn api:download-fixtures update [ Downloads the latest API Test Fixtures from the main branch, and locks to that commit ]
 * yarn api:download-fixtures update <commit> [ Downloads the API Test Fixtures for a specific commit, and locks to that commit ]
 */
return (async () => {
  const got = require('got')
  const fs = require('fs')
  let url = 'https://raw.githubusercontent.com/BristolSTA/uobtheatre-api/'
  const lockFile = './fixtures.lock'

  if (process.argv[2] === 'update') {
    let lock = process.argv[3] ? process.argv[3] : null
    if (!lock) {
      const response = await got(
        'https://api.github.com/repos/BristolSTA/uobtheatre-api/commits/main'
      ).json()
      lock = response.sha
    }
    url += lock

    // Update lock file
    fs.writeFile(lockFile, lock, () => {})
    console.log(`Lock updated, now tracking commit ${lock}`)
  } else {
    if (!fs.existsSync(lockFile)) {
      console.log(
        '\x1B[41m%s\x1B[0m',
        'No FixtureSet Lock File Exists. Run with "update"'
      )
      return
    }

    // Load from lock
    const data = fs.readFileSync(lockFile, 'utf8')
    url += data
    console.log(`Using fixtureSet from commit ${data}`)
  }

  const response = await got(url + '/db.json')
  fs.writeFile('fakeApi/db.json', response.body, () => {})

  console.log('\x1B[32m%s\x1B[0m', 'Real API Test FixtureSet Downloaded')
})()
