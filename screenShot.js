var page = require('webpage').create();
page.open('http://www.cnn.com/', function () {
    page.render('cnn.png');
    phantom.exit();
});