function NetworkIndexModel() {

    var self = this;
    self.restaurant_search_term = ko.observable("");
    self.restaurants = ko.observableArray([]);

    self.top_search = ko.computed({
    	read: function(){
    		if(self.restaurant_search_term().length == 0){
    			return false;
    		} else {
    			return true;
    		}
    	},
    	deferEvaluation: true,
    });

    self.ajax_search = function(){
		$.ajax({
			type: "POST",
			url: "/app/network/search",
			data: {
				restaurant_search_term: self.restaurant_search_term(),
			},
			success: function(data, textStatus, jqXHR){
				self.restaurants(_.map(data.restaurants,function(restaurant){ return new Restaurant(restaurant) }));
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) { 

			},
			dataType: "json"
		});    	
    }

    self.search_restaurants = ko.computed({
    	read: function(){
    		if(self.restaurant_search_term().length > 0){
    			self.ajax_search();
    		}
    	}
    }).extend({rateLimit: 500});

};

editing_mode = false;    
var viewmodel = new NetworkIndexModel();

$("#menu-toggle").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("active");
});			

$(function(){	
	pager.Href.hash = '#!/';
	pager.extendWithPage(viewmodel);
	ko.applyBindings(viewmodel,$("html")[0]);      			
	pager.start();
});
           				
function showModal(page, callback) {
	$(page.element).modal('show');
};
function hideModal(page, callback) {
	$(page.element).modal('hide');
};