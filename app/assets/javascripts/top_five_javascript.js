/*
*= require top_five.js
*= require_self
*/

ko.bindingHandlers.loginClick = {
    'init': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var originalFunction = valueAccessor();
        $(element).click(function() {
            if (bindingContext["$loggedin"]()){
                originalFunction();
            }
        });
    }
}

ko.bindingHandlers.mobileVisible = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var id = valueAccessor();       
        var root = bindingContext["$root"];
        if(!root.isMobile){
            return;
        }
        if(root.current_page() != id){
            $(element).hide();
        } else {
            $(element).show();
        }
    }
};

ko.bindingHandlers.countdown = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
        if(viewModel.is_this_a_contest == false){
            return;
        }
        // set the date we're counting down to
        var target_date = value().getTime();
         
        // variables for time units
        var days, hours, minutes, seconds;
         
        // get tag element
        var countdown = element;
         
        // update the tag with id "countdown" every 1 second
        var intervalId = setInterval(function () {
         
            // find the amount of "seconds" between now and target
            var current_date = new Date().getTime();
            var seconds_left = (target_date - current_date) / 1000;

            if(seconds_left < 0){
                clearInterval(intervalId);
                viewModel.finished(true);
            }
         
            // do some time calculations
            days = parseInt(seconds_left / 86400);
            seconds_left = seconds_left % 86400;
             
            hours = parseInt(seconds_left / 3600);
            seconds_left = seconds_left % 3600;
             
            minutes = parseInt(seconds_left / 60);
            seconds = parseInt(seconds_left % 60);
             
            // format countdown string + set tag value
            countdown.innerHTML = days + "d, " + hours + "h, "
            + minutes + "m, " + seconds + "s";  
         
        }, 1000);
    }
};

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
	self.instructions = ko.observable(false);
	self.top_five_restaurant_search_term = ko.observable();
	self.current_top_five = ko.observable(new TopFive(top_five));
    self.finished = self.current_top_five().finished;
    self.threeRated = self.current_top_five().threeRated;

    self.is_this_a_contest = self.current_top_five().is_this_a_contest;

    self.updateUserMonitor.dispose();
    self.updateUserMonitor = ko.computed({
        read: function(){
            if(updateUser()){
                $.ajax({
                    type: "POST",
                    data: {
                        top_five_id: self.current_top_five().id(),
                    },
                    url: "/app/top_five/fetch_user",
                    success: function(data, textStatus, jqXHR){
                        self.user(new User(data));
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) { 

                    },
                    dataType: "json"
                });
            }
        }
    });

    self.shareTopFiveFB = function(){
        FB.ui({
          method: 'share',
          href: 'https://dishgo.ca/top_five/' + top_five_id + "/" + self.user().id(),
        }, function(response){});     
    }

    self.isMobile = isMobile.any();
    self.dish_list = ko.computed({
        read: function(){
            return self.current_top_five().dishes();
        }, 
        deferEvaluation: true
    });   
    self.page = ko.observable(0);
    self.current_numerical_page = ko.observable(0);
    self.current_page = ko.computed({
        read: function(){
            var current_page = ((self.page() % (self.current_top_five().dishes().length + 1)) + (self.current_top_five().dishes().length + 1)) % (self.current_top_five().dishes().length + 1);
            if(current_page == 0){
                self.current_numerical_page(999);
                return 'header';
            }
            self.current_numerical_page(current_page - 1);
            var idizzle = self.dish_list()[current_page - 1].id();
            return idizzle;
        },
        deferEvaluation: true,
    });
}

editing_mode = false;   
var viewmodel = new TopFiveModel();

$(function(){	
	ko.applyBindings(viewmodel,$("html")[0]);      			
});
           				
