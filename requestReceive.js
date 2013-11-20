var page = require('webpage').create(),
system = require('system'),
url = system.args[1];
page.onResourceReceived = function (response) {
    console.log('Receive ' + JSON.stringify(response.status, undefined, 4));
};
page.open(url);
