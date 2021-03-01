/**
 * Fetches the GraphQL API Schema from the uobtheatre-api repository, and installs it into the fake API
 *
 * Examples:
 * yarn api:download-schema [ Downloads the API Schema based on the present schema lockfile ]
 * yarn api:download-schema update [ Downloads the latest API Schema from the main branch, and locks to that commit ]
 * yarn api:download-schema update <commit> [ Downloads the API Schema for a specific commit, and locks to that commit ]
 */
return (async () => {
  const got = require('got');
  const fs = require('fs');
  let url = 'https://raw.githubusercontent.com/BristolSTA/uobtheatre-api/';
  let lockFile = './schema.lock';

  if (process.argv[2] == 'update') {
    let lock = process.argv[3] ? process.argv[3] : null;
    if (!lock) {
      const response = await got(
        'https://api.github.com/repos/BristolSTA/uobtheatre-api/commits/main'
      ).json();
      lock = response.sha;
    }
    url += lock;

    // Update lock file
    fs.writeFile(lockFile, lock, () => {});
    console.log(`Lock updated, now tracking commit ${lock}`);
  } else {
    if (!fs.existsSync(lockFile)) {
      console.log(
        '\x1b[41m%s\x1b[0m',
        'No Schema Lock File Exists. Run with "update"'
      );
      return;
    }

    // Load from lock
    let data = fs.readFileSync(lockFile, 'utf8');
    url += data;
    console.log(`Using schema from commit ${data}`);
  }

  const response = await got(url + '/schema.graphql');
  fs.writeFile('src/fakeApi/schema.graphql', response.body, () => {});

  console.log('\x1b[32m%s\x1b[0m', 'Real API Schema Downloaded');
})();
