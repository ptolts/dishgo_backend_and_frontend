function NetworkIndexModel() {

    var self = this;
    self.restaurant_search_term = ko.observable("");

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