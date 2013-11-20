var Browser = require("zombie");
var assert = require("assert");

// Load the page from localhost
describe('guestcard', function(){
	browser = new Browser();
	browser.visit("http://helium.forrent.com/guestcard/1000188850.php/").then(function(){
	        assert.ok(browser.success);
	        assert.equal(browser.text("title"), "Check Availability for TEST PROP 2 Apartments in Newtok, Alaska - Apartment Rental Guest Card - ForRent.com");
	});
});