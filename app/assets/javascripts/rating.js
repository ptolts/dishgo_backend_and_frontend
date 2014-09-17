function Rating(data) {
    data = data || {};
    var self = this;
    self.id = ko.observable(data.id ? data.id : null);
    self.review = ko.observable(data.review ? data.review : "");
    self.rating = ko.observable(data.rating ? data.rating : 0);
    self.rate = function(dish_id){
        $.ajax({
            type: "POST",
            url: "/app/api/v1/dish/set_rating",
            data: {
                dish_id: dish_id,
                rating: self.rating(),
                review: self.review(),
                top_five_id: top_five_id,
            },
            success: function(data, textStatus, jqXHR){
                self.id(data.id);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {                                           
            },
            dataType: "json"
        });
    } 
}