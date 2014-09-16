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

}

editing_mode = false;   
var viewmodel = new TopFiveModel();

$(function(){	
	ko.applyBindings(viewmodel,$("html")[0]);      			
});
           				
