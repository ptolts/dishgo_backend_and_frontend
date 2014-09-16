/*
*= require top_five.js
*= require_self
*/

function TopFiveModel(){
	var self = this;
	NetworkModel.apply(self);
	self.dishes = ko.observableArray([]);
	self.dish_search_term = ko.observable("");
	self.top_five_restaurant_search_term = ko.observable();
	self.current_top_five = ko.observable(new TopFive(top_five));

	self.allow_more_dishes = ko.computed(function(){
		if(self.current_top_five().allow_more_dishes){
			return self.current_top_five().allow_more_dishes();
		} else {
			return false;
		}
	});

    self.searchArray = ko.observableArray([]);
    self.searching = ko.computed(function(){ return self.searchArray().length > 0 }).extend({ rateLimit: { method: "notifyWhenChangesStop", timeout: 100 } });	

    self.dish_search_request = function(){
        $.ajax({
            type: "POST",
            url: "/app/network/dish_search",
            data: {
                dish_search_term: self.dish_search_term(),
                restaurant_search_term: self.top_five_restaurant_search_term(),
            },
            beforeSend: function(){
                self.searchArray.push(this);
            },
            success: function(data, textStatus, jqXHR){
                self.searchArray.remove(this);
                self.dishes(_.map(data.dishes,function(dish){ return new Dish(dish) }));
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                self.searchArray.remove(this);
            },
            dataType: "json"
        });         
    };

    self.search_restaurants = ko.computed({
        read: function(){
            if(self.dish_search_term().length > 0){
                self.dishes([]);
                self.dish_search_request();
            }
        }
    }).extend({rateLimit: 500});    

}

editing_mode = false;   
var viewmodel = new TopFiveModel();

$(function(){	
	ko.applyBindings(viewmodel,$("html")[0]);      			
});
           				
