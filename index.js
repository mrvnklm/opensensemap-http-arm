const fs = require('fs');
const process = require('process');
const request = require('request');

const config = JSON.parse(fs.readFileSync('config.json'));

const interval = config.interval || 60
const debug = config.debug || false

console.log(`sensebox-http started - interval: ${interval} seconds, debug: ${debug}`);

setInterval(function() {
  run()
}, interval * 1000)

function run() {
  config.devices.forEach(dev => {
    if (debug) console.log(`Device: ${dev.url}`)
    request(dev.url, (err, res, body) => {
      if (err) {
        console.error(err);
        console.error('Please check your config.json with (https://jsonlint.com)! Quitting...');
        process.exit(1);
      }
      dev.sensors.forEach(sens => {
        var value = body
        if (!('json' in dev && !dev.json)) {
          value = sens.path.split('.').reduce((p, c) => p[c], JSON.parse(body))
        }
        if (debug) console.log(`Sensor: ${sens.path} - Value: ${value})`)
        if (value) {
          request({
            url: `https://api.opensensemap.org/boxes/${config.senseboxId}/${sens.id}`,
            method: "POST",
            json: {
              value: value
            }
          }, (err, res, body) => {
            if (err) console.log(`Error (${sens.path}): ${err}`)
            if (debug) console.log(`Response (${sens.path}): ${body}`)
          })
        } else {
          console.error(`Error: No Value found for ${sens.path}`)
        }
      })
    })
  })
}

process.on('SIGINT', function() {
  process.exit();
});
