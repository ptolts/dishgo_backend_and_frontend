function Rating(data) {
    data = data || {};
    var self = this;
    self.id = data.id ? data.id : null;
    self.review = ko.observable(data.review ? data.review : "");
    self.rating = ko.observable(data.rating ? data.rating : 0);
    self.rate = function(){
        $.ajax({
            type: "POST",
            url: "/app/api/v1/dish/set_rating",
            data: {
                data: ko.toJSON(self),
            },
            success: function(data, textStatus, jqXHR){                        
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {                                           
            },
            dataType: "json"
        });
    } 
}