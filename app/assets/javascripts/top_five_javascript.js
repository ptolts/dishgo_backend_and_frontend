/*
*= require top_five.js
*= require_self
*/

ko.bindingHandlers.slideVisible = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
        var jElement = $(element);
        if(value && !jElement.is(":visible")){
            jElement.toggle( "slide" );
        }

        if(!value && jElement.is(":visible")){
            jElement.toggle( "slide" );
        }
    }
};

ko.bindingHandlers.with_dish = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    	var id = valueAccessor();
    	var dish_array = bindingContext["$parent"].current_top_five().dishes();
		var model = _.find(dish_array, function(item) {
		    return item.id() == id; 
		});

        var childBindingContext = bindingContext.createChildContext(model);
        ko.applyBindingsToDescendants(childBindingContext, element);
 
        // Also tell KO *not* to bind the descendants itself, otherwise they will be bound twice
        return { controlsDescendantBindings: true };		

    }
};

function TopFiveModel(){
	var self = this;
	NetworkModel.apply(self);
	self.dishes = ko.observableArray([]);
	self.dish_search_term = ko.observable("");
	self.top_five_restaurant_search_term = ko.observable();
	self.current_top_five = ko.observable(new TopFive(top_five));  

}

editing_mode = false;   
var viewmodel = new TopFiveModel();

$(function(){	
	ko.applyBindings(viewmodel,$("html")[0]);      			
});
           				
