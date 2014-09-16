/*
*= require top_five.js
*= require_self
*/

function TopFiveModel(){
	var self = this;
	NetworkModel.apply(self);
	self.top_fives = ko.observableArray(top_fives ? _.map(top_fives,function(top){ return new TopFive(top) }) : []);

}

editing_mode = false;   
var viewmodel = new TopFiveModel();

$(function(){	
	ko.applyBindings(viewmodel,$("html")[0]);      			
});
           				
