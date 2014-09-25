function Rating(data) {
    data = data || {};
    var self = this;
    self.id = ko.observable(data.id ? data.id : null);
    self.review = ko.observable(data.review ? data.review : "");
    self.rating = ko.observable(data.rating ? data.rating : 0);
    self.rate = function(dish_id){
        var t_id = null;
        if("top_five_id" in window){
            t_id = top_five_id;
        }
        $.ajax({
            type: "POST",
            url: "/app/api/v1/dish/set_rating",
            data: {
                dish_id: dish_id,
                rating: self.rating(),
                review: self.review(),
                top_five_id: t_id,
            },
            success: function(data, textStatus, jqXHR){
                self.id(data.id);
                if("updateUser" in window){
                    updateUser(true);
                    updateUser.valueHasMutated();
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {                                           
            },
            dataType: "json"
        });
    } 

    self.fetching_already = false;
    self.fetch_rating = function(dish_id){
        if(self.fetching_already){
            return;
        }
        self.fetching_already = true;
        $.ajax({
            type: "POST",
            url: "/app/api/v1/dish/get_rating",
            data: {
                dish_id: dish_id,
            },
            success: function(data, textStatus, jqXHR){
                self.rating(data.rating);
                self.id(data.id);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {                                           
            },
            dataType: "json"
        });
    }     
}