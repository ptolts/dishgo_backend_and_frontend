$(function(){ 
    window.onerror = function (errorMsg, url, lineNumber) {
        console.log('[error] ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
    }
    ko.global_log_file = [];
    var console = window.console
    if (!console) return
    function intercept(method){
        var original = console[method]
        console[method] = function(){
            // do sneaky stuff
            ko.global_log_file.push("[" + method + "] " + _.map(arguments,function(e){return JSON.stringify(e)}).join("\n\r"));
            if (original.apply){
                // Do this for normal browsers
                original.apply(console, arguments)
            }else{
                // Do this for IE
                var message = Array.prototype.slice.apply(arguments).join(' ')
                original(message)
            }
        }
    }
    var methods = ['log', 'warn', 'error']
    for (var i = 0; i < methods.length; i++)
        intercept(methods[i])
});