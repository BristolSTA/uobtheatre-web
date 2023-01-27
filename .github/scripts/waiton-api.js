#!/usr/bin/env node
(async function () {
    function sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    var http = require('http')

    const url = process.argv[2]
    const timeout = process.argv[3] || 60
    const sampleTime = 1000

    var continuePolling = true
    const startTime = new Date()

    while (continuePolling) {
        var req = http.request(url, { method: 'HEAD' }, function (r) {
            continuePolling = false;
            console.log("Positive connection made to API :)")
            process.exit(0)
        }).on('error', err => {
            console.log('Error: ', err.message);
        });
        req.end();

        if ((new Date() - startTime) >= timeout * 1000) {
            console.log("Aborting due to timeout")
            process.exit(1)
        }

        await sleep(sampleTime)
    }

})()