var system = require('system');
if (system.args.length === 1) {
    console.log('Try to pass some args when invoking this script!');
} else {
	var page = require('webpage').create();  
	page.onLoadFinished = function(status) {
		var html = page.evaluate(function () {
	        return document;
	    });
	    console.log(html.all[0].outerHTML);
	    phantom.exit(); 
	};	
	page.setContent(system.args[1],system.args[2]);
}
