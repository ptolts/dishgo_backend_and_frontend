/*
*= require jquery
*= require knockout-3.1.0.debug.js
*= require underscore
*= require bootstrap.min.js
*= require prize.js
*= require strftime.js
*= require section.js
*= require dish.js
*= require option.js
*= require individual_option.js
*= require size_prices.js
*= require restaurant
*= require_self
*/

ko.bindingHandlers.lText = {
    update: function (element, valueAccessor) {       
        var value = valueAccessor();
        var result = ko.observable(value()[lang()]);
        ko.bindingHandlers.text.update(element, result);     
    }
}; 