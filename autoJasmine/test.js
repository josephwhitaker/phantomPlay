var system = require('system');
var page = require('webpage').create();
var links, url;

if (system.args.length !== 2) {
    console.log('Usage: test.js URL');
    phantom.exit(1);
}

function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3001, //< Default Max Timeout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 100); //< repeat check every 100ms
};
page.open(system.args[1], function(status) {
    links = page.evaluate(function() {
        return [].map.call(document.querySelectorAll('a.testLink'), function(link) {
            return link.getAttribute('href');
        });
    });

    for(var index=1;index<2;index++){
        console.log("page = "+links[index]);
        var page2 = require('webpage').create();
        page2.open(links[index], function(status){
            if (status !== "success") {
                console.log("Unable to access network");
                phantom.exit();
            } else {
                waitFor(function(){
                    return page.evaluate(function(){
                        return document.body.querySelector('.symbolSummary .pending') === null;
                    });
                }, function(){
                    var exitCode = page2.evaluate(function(){
                        console.log('');
                        console.log(document.body.querySelector('.description').innerText);
                        var list = document.body.querySelectorAll('.results > #details > .specDetail.failed');
                        if (list && list.length > 0) {
                            console.log('');
                            console.log(list.length + ' test(s) FAILED:');
                            for (i = 0; i < list.length; ++i) {
                                var el = list[i],
                                    desc = el.querySelector('.description'),
                                    msg = el.querySelector('.resultMessage.fail');
                                console.log('');
                                console.log(desc.innerText);
                                console.log(msg.innerText);
                                console.log('');
                            }
                            return 1;
                        } else {
                            console.log(document.body.querySelector('.alert > .passingAlert.bar').innerText);
                            return 0;
                        }
                    });
                    phantom.exit(exitCode);
                });
            }
        })
    }
});