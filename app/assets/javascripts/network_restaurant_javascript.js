editing_mode = false;    
var viewmodel = new NetworkModel();

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