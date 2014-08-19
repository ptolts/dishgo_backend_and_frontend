

var isMobile = { 
Android: function() { return navigator.userAgent.match(/Android/i); }, 
BlackBerry: function() { return navigator.userAgent.match(/BlackBerry/i); }, 
iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, 
Opera: function() { return navigator.userAgent.match(/Opera Mini/i); }, 
Windows: function() { return navigator.userAgent.match(/IEMobile/i); }, 
any: function() { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };

function Provider(network){
    var self = this;
    self.name = network;
    self.displayName = network.replace(/^[a-z]/,function(m){
        return m.toUpperCase();
    });
    self.profile_pic = ko.observable();
    self.profile_name = ko.observable();
    self.login = function(){
        hello.login(network,{},function(auth){
            hello( auth.network ).api( '/me' ).success(function(r){
                self.profile_pic(r.thumbnail);
                self.profile_name(r.name);
            });
            self.online(true);
        });
    };
    self.logout = function(){
        self.online(false);
        hello.logout(network);
    };
    self.online = ko.observable(false);
}

function NetworkIndexModel() {

    var self = this;
    self.isMobile = isMobile.any();
    self.restaurant_search_term = ko.observable("");
    self.restaurants = ko.observableArray([]);
    self.network_sign_in = ko.observable(false);
    self.social_networks = ko.observableArray([]);
    self.active_social_networks = ko.computed(function(){
        return _.filter(self.social_networks(),function(soc){ return soc.online() });
    });

    ko.utils.arrayForEach( Object.keys(CLIENT_IDS_ALL), function(network){
        self.social_networks.push(new Provider(network));
    });   

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
                console.log("Total count: " + data.count + " Received count: " + self.restaurants().length);
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