/*
*= require top_five.js
*= require_self
*/

ko.bindingHandlers.writableStarRatingTopFive = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = valueAccessor();
        $(element).addClass("starRating");
        for (var i = 0; i < value(); i++)
           $("<i class='fa fa-star chosen'>").appendTo(element);
        for (var i = 0; i < (5-value()); i++)
           $("<i class='fa fa-star'>").appendTo(element);       
       
        // Handle mouse events on the stars
        $("i", element).each(function(index) {
            $(this).hover(
                function() { 
                    $(this).prevAll().add(this).addClass("hoverChosen");
                    $(this).nextAll().addClass("hoverLeftOver");
                }, 
                function() { 
                    $(this).prevAll().add(this).removeClass("hoverChosen");
                    $(this).nextAll().removeClass("hoverLeftOver");
                }                
            ).click(function() { 
                if(bindingContext["$loggedin"]()){
                    value(index+1);
                }
            });
        });            
    },
    update: function(element, valueAccessor) {
        // Give the first x stars the "chosen" class, where x <= rating
        var observable = valueAccessor()();
        $("i", element).each(function(index) {
            if(index >= observable){
                $(this).addClass("left_over");
            } else {
                $(this).removeClass("left_over");
            }
        });
    }    
};

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
           				
