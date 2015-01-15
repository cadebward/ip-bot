var fs = require('fs');
var request = require('request');
var config = require('./config');

var CronJob = require('cron').CronJob;
new CronJob('1 * * * * *', function(){
    request.get(config.ip_url, function(error, response, ip) {
      console.log('checking for ip change');
      fs.exists(config.file_name, function(exists) {
        if (exists) {
          fs.readFile(config.file_name, 'utf8', function(error, currentIp) {
            if (ip != currentIp) {
              // ip changed
              // send post with new ip
              notify(ip);
            } else {
              console.log('ip has not changed');
            }
          });
        }
      })
    });
}, null, true, "America/Denver");

function writeIp(ip) {
  fs.writeFile(config.file_name, ip)
  console.log('writing ip to file: ' + ip);
}

function notify(ip) {
  writeIp(ip);
  var nginxServer = config.domain + ':' + config.port;
  console.log('notify server of new ip: ' + ip);
  request.post({
    headers: {'content-type' : 'application/json'},
    url: 'http://cade.info',
    json: {ip: ip}
  }, function(error, response, body){
    console.log(body);
    console.log(error);
    console.log(response.status);
  });
}