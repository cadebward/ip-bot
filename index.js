var fs = require('fs');
var request = require('request');

var URL = 'http://bot.whatismyipaddress.com/';
var FILE_NAME = 'public_ip.txt'

var CronJob = require('cron').CronJob;
new CronJob('1 * * * * *', function(){
    request.get(URL, function(error, response, body) {
      // body is ip
      writeIp(body);
    });
}, null, true, "America/Denver");

function writeIp(ip) {
  fs.writeFile('./' + FILE_NAME, ip)
}