function BidnessModel(){
	var self = this;
    NetworkModel.apply(self);    
    self.restaurant_name = ko.observable("");
    self.email = ko.observable("");
    self.name = ko.observable("");
    self.phone = ko.observable("");
    self.sent = ko.observable(false);

    self.submit = function(){
        $.ajax({
            type: "POST",
            url: "/app/dishgo/business/submit",
            data: {
                restaurant_name: self.restaurant_name(),
                email: self.email(),
                name: self.name(),
                phone: self.phone(),
            },
            success: function(data, textStatus, jqXHR){
                alert("Thanks, we will contact you soon.");
                self.sent(true);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                alert("We couldn't deliver your message at this time.");
            },
            dataType: "json"
        });
    }

    self.submitAdvertising = function(){
        $.ajax({
            type: "POST",
            url: "/app/dishgo/business/submit_advertising",
            data: {
                restaurant_name: self.restaurant_name(),
                email: self.email(),
                name: self.name(),
                phone: self.phone(),
            },
            success: function(data, textStatus, jqXHR){
                alert("Thanks, we will contact you soon.");
                self.sent(true);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                alert("We couldn't deliver your message at this time.");
            },
            dataType: "json"
        });
    }    
}

editing_mode = false;   
var viewmodel = new BidnessModel();

$(function(){	
	ko.applyBindings(viewmodel,$("html")[0]);      			
});
           				
