        var updateUser = ko.observable(false);

        function Facebook(data){
            var self = this;
            self.name = "facebook";
            self.link = "/app/users/auth/facebook"
            self.online = ko.observable(false);

            self.login = function(){
                var popupWidth=500;
                var popupHeight=500;
                var xPosition = parseInt((window.screen.availWidth - popupWidth) / 2);
                var yPosition = parseInt((window.screen.availHeight - popupHeight) / 2);
                var params = "status=no, location=yes, scrollbars=yes, resizable=yes, width="+popupWidth+", height="+popupHeight+", top="+yPosition+", left="+xPosition;
                window.popup_scope = self;               
                self.facebook_window = window.open(self.link, '_blank', params);
                self.facebook_window.focus();
            };

            self.close_popup = function(){
                if(self.facebook_window){
                    self.facebook_window.close();
                    updateUser(true);
                }
            }

        }

        function Twitter(data){
            var self = this;
            self.name = "twitter";
            self.link = "/app/users/auth/twitter";
            self.online = ko.observable(false);

            self.login = function(){
                var popupWidth=500;
                var popupHeight=500;
                var xPosition = parseInt((window.screen.availWidth - popupWidth) / 2);
                var yPosition = parseInt((window.screen.availHeight - popupHeight) / 2);
                var params = "status=no, location=yes, scrollbars=yes, resizable=yes, width="+popupWidth+", height="+popupHeight+", top="+yPosition+ ", left="+xPosition;
                window.popup_scope = self;
                console.log(params);
                self.twitter_window = window.open(self.link, '_blank', params);
                self.twitter_window.focus();
            };

            self.close_popup = function(){
                if(self.twitter_window){
                    self.twitter_window.close();
                    updateUser(true);
                }
            }
        }

        function User(data) {
            var self = this;
            data = data || {};
            self.id = ko.observable(data._id ? data._id : null);
            self.email = ko.observable(data.email);
            self.phone = ko.observable(data.phone);
            self.setup_link = ko.observable(window.location.protocol + "//" + window.location.host + "/app/profile/set_password/" + data.setup_link);
            self.sign_up_link = ko.observable(data.sign_up_link ? window.location.protocol + "//" + window.location.host + "/app/profile/set_password/" + data.sign_up_link : null);
            self.dishcoins = ko.observable(data.dishcoins ? data.dishcoins : 0);
            self.top_five_dishcoins = ko.observable(data.top_five_dishcoins ? data.top_five_dishcoins : 0);
            self.name = ko.observable(data.name ? data.name : "");
            self.promo_code = ko.observable(data.promo_code ? data.promo_code : "");
            self.api_confirmation = ko.observable(data.api_confirmation ? data.api_confirmation : false);
            self.claimed_promo_code = ko.observable(data.claimed_promo_code ? data.claimed_promo_code : null);

            self.twitter = ko.observable(new Twitter());
            self.facebook = ko.observable(new Facebook());
            self.restaurant_id = ko.observable(data.restaurant_id || null);

            if(data.facebook_user_id){
                self.facebook().online(true);
            }

            if(data.twitter_user_id){
                self.twitter().online(true);
            }

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