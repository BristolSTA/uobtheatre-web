const http = require('https');
const fs = require('fs');

const file = fs.createWriteStream('src/fakeApi/schema.gql');
http.get(
  'https://raw.githubusercontent.com/BristolSTA/uobtheatre-api/main/schema.graphql',
  function (response) {
    response.pipe(file);
  }
);
console.log('\x1b[32m%s\x1b[0m', 'Real API Schema Downloaded');
