        function User(data) {
            var self = this;
            self.id = ko.observable(data._id ? data._id : null);
            self.email = ko.observable(data.email);
            self.phone = ko.observable(data.phone);
            self.setup_link = ko.observable(window.location.protocol + "//" + window.location.host + "/app/profile/set_password/" + data.setup_link);
            self.sign_up_link = ko.observable(data.sign_up_link ? window.location.protocol + "//" + window.location.host + "/app/profile/set_password/" + data.sign_up_link : null);
            self.dishcoins = ko.observable(data.dishcoins ? data.dishcoins : 0);

            self.created = ko.computed({
                read: function(){
                    return !self.id();
                },
                deferEvaluation: true
            });

            self.resto_data = ko.observable();

            self.dishcoin_list = ko.computed({
                read: function(){
                    var l = [];
                    for(i=1;i<=self.dishcoins();i++){
                        l.push(i);
                    }
                    return l;
                },
                deferEvaluation: true,
            })

            self.spin = ko.observable(false);
            self.createUser = function(resto){
                self.spin(true);
                $.ajax({
                    type: "POST",
                    url: "/app/administration/create_user_for_restaurant",
                    data: {
                        params:ko.toJSON(self),
                        restaurant_id: resto.id,
                    },
                    success: function(data, textStatus, jqXHR){
                        self.spin(false);
                        self.id(data._id);
                        resto.user_id = data._id;
                        self.setup_link(window.location.protocol + "//" + window.location.host + "/app/profile/set_password/" + data.setup_link);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) { 
                        self.spin(false);
                        console.log("There was an error saving the section " + errorThrown);
                    },
                    dataType: "json"
                });                
            } 

            self.createSignUpUser = function(){
                self.spin(true);
                $.ajax({
                    type: "POST",
                    url: "/app/letsdishgo/create_user_and_restaurant",
                    data: {
                        params:ko.toJSON(self),
                    },
                    success: function(data, textStatus, jqXHR){
                        self.spin(false);
                        if(data.result == "User Exists!"){
                            alert("That email address already exists in our database. Check your email for the link to sign in, or contact us for support at info@dishgo.io.\nWe apologize for the inconvenience.");
                            return;
                        }                        
                        var restaurant = data.restaurant;
                        data = data.user;
                        self.id(data._id);
                        self.resto_data(restaurant);
                        self.sign_up_link(window.location.protocol + "//" + window.location.host + "/app/profile/set_password/" + data.sign_up_link);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) { 
                        self.spin(false);
                        alert("Something went wrong. Maybe a bad email address?");
                        console.log("There was an error saving the section " + errorThrown);
                    },
                    dataType: "json"
                });                
            }                          

            self.save = function(){
                $.ajax({
                  type: "POST",
                  url: "/app/administration/update_current_user",
                  data: {
                    params:ko.toJSON(self),
                  },
                  success: function(data, textStatus, jqXHR){
                        console.log("Saved!")      
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) { 
                        console.log("There was an error saving the section " + errorThrown);
                    },
                    dataType: "json"
                });                
            }             
        } 