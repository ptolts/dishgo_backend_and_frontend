    

        Day.prototype.toJSON = function() {
            var copy = ko.toJS(this); //easy way to get a clean copy
            delete copy.times;
            delete copy.buttonText;
            return copy; //return the copy to be serialized
        };  

        function Page(data){
            data ? null : data = {}
            var self = this;
            self.id = data.id;
            self.html = ko.observable(data.html ? data.html : copyDefaultHash(default_web_language_hash));
            self.name = ko.observable(data.name ? data.name : copyDefaultHash(default_page_language_hash));

            self.remove = function(resto){
                bootbox.dialog({
                  message: "Remove page?",
                  title: "Remove Page",
                  buttons: {
                    success: {
                      label: "No",
                      className: "btn-default pull-left col-xs-3",
                      callback: function() {

                      }
                    },
                    danger: {
                      label: "Yes",
                      className: "btn-danger col-xs-3 pull-right",
                      callback: function() {
                        resto.pages.remove(self);
                      }
                    },
                  }
                });                  
            }
        }

        function Odesk(data){
            data ? null : data = {}
            var self = this;
            self.access_token = data.access_token;
        }              

        function LogoSettings(data){
            data ? null : data = {}
            var self = this;
            self.logo_as_image = ko.observable(data.logo_as_image ? data.logo_as_image : false);
            self.image_height = ko.observable(data.image_height != null  ? data.image_height : 50);
            self.border_color = ko.observable(data.border_color ? data.border_color : "000000");
            self.border_radius = ko.observable(data.border_radius != null  ? data.border_radius : 3);
            self.border_size = ko.observable(data.border_size != null ? data.border_size : 2);

            self.showLogo = ko.computed({
                read: function(){
                    if(!self.logo_as_image()){
                        return false;
                    } else {
                        if($(window).width() < 600){
                            return false;
                        } else {
                            return true;
                        }
                    }
                },
                deferEvaluation: true,
            })
        }

        function Day(name,data){
            var self = this;
            self.name = name;
            self.closed = ko.observable(true);
            self.open_1 = ko.observable(data.open_1);
            self.close_1 = ko.observable(data.close_1);
            self.open_2 = ko.observable(data.open_2);
            self.close_2 = ko.observable(data.close_2);

            self.lName = ko.computed({
                read: function() {
                    if(viewmodel.lang){
                        return days_tr[self.name][viewmodel.lang()];
                    } else {
                        return "";
                    }
                },
                deferEvaluation: true                
            });

            self.times = ["00:00", "00:30", "1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30", "5:00", "5:30", "6:00", "6:30", "7:00", "7:30", "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"];


            if(data.closed == false){
                self.closed(data.closed);
            }

            self.toggleClosed = function(){
                self.closed(!self.closed());
            }
            
            self.labelText = ko.computed({
                read: function() {
                    if(viewmodel.lang){
                        if(!self.closed()){
                            return opened_tr["open"][viewmodel.lang()];
                        } else {
                            return opened_tr["closed"][viewmodel.lang()];
                        }
                    } else {
                        return self.buttonText();
                    }                 
                },
                deferEvaluation: true                 
            });

            self.buttonText = ko.computed(function(){
                if(!self.closed()){
                    return "Open";
                } else {
                    return "Closed";
                }
            });            

            self.validateOpen_1 = ko.observable(true);
            self.open_1.subscribe(function(newvalue){
                if(newvalue == null){
                    self.validateOpen_1(true);
                } else {
                    self.validateOpen_1(false);
                }
            });

            self.validateClose_1 = ko.observable(true);
            self.close_1.subscribe(function(newvalue){
                if(newvalue == null){
                    self.validateClose_1(true);
                } else {
                    self.validateClose_1(false);
                }
            }); 

            self.open_1.valueHasMutated();           
            self.close_1.valueHasMutated();           

        }

        Restaurant.prototype.toJSON = function() {
            var copy = ko.toJS(this); //easy way to get a clean copy
            delete copy.areWeOpened;
            delete copy.areWeOpenedText;
            delete copy.socialVisible;
            return copy; //return the copy to be serialized
        };          

        function Restaurant(data) {
            console.log("New Restaurant: " + data.name);
            var self = this;
            self.languages = ko.observableArray(data.languages ? data.languages : ['en']);
            self.available_languages = ko.observableArray(_.map(_.pairs(fullLanguageName),function(lang){ return new Language(lang[1],lang[0]) }));
            self.name = ko.observable(data.name ? data.name : "");
            self.lat = ko.observable(data.lat ? data.lat : "");
            self.lon = ko.observable(data.lon ? data.lon : "");
            self.website = ko.observable(data.website ? data.website : "");
            self.email = ko.observable(data.email ? data.email : "");
            self.subdomain = ko.observable(data.subdomain ? data.subdomain : "");
            self.host = ko.observable(data.host ? data.host : "");
            self.facebook = ko.observable(data.facebook ? data.facebook : "");
            self.foursquare = ko.observable(data.foursquare ? data.foursquare : "");
            self.instagram = ko.observable(data.instagram ? data.instagram : "");
            self.twitter = ko.observable(data.twitter ? data.twitter : "");
            self.phone = ko.observable(data.phone ? data.phone : "");
            self.address_line_1 = ko.observable(data.address_line_1 ? data.address_line_1 : "");
            self.address_line_2 = ko.observable(data.address_line_2 ? data.address_line_2 : "");
            self.city = ko.observable(data.city ? data.city : "");
            self.province = ko.observable(data.province ? data.province : "");
            self.postal_code = ko.observable(data.postal_code ? data.postal_code : "");
            self.design = ko.observable(data.design === undefined ? null : new Design(data.design));
            self.id = data._id;
            self.font_id = data.font_id ? data.font_id : "";
            self.user_id = data.user_id ? data.user_id : "";

            self.logo = ko.observable(data.logo ? new GlobalImage(data.logo) : new GlobalImage({}));
            self.logo_settings = ko.observable(data.logo_settings ? new LogoSettings(data.logo_settings) : new LogoSettings());

            self.odesk = ko.observable(data.odesk ? new Odesk(data.odesk) : null );

            self.about_text = ko.observable(data.about_text ? data.about_text : copyDefaultHash(default_web_language_hash));

            self.pages = ko.observableArray([]);

            if(data.pages){
                self.pages(_.map(data.pages,function(page){ return new Page(page) }));
            }

            self.menu_images = ko.observableArray([]);

            if(data.menu_images){
                self.menu_images(_.map(data.menu_images,function(img){ return new GlobalImage(img) }))
            }

            self.computed_menu_images = ko.computed({
                read: function(){
                    if(self.menu_images().length == 0 || _.every(self.menu_images(),function(e){ console.log(e);return e.completed() })){
                        self.menu_images.push(new GlobalImage({}));
                    }
                    self.menu_images.remove(function(img){ return img.destroyed() });
                    return self.menu_images();
                },
                deferEvaluation: true,
            })           

            self.hours = ko.observableArray([]);

            var hours_list = {
                monday: {
                    open_1: null,
                    close_1: null,
                    open_2: null,
                    close_2: null,
                },
                tuesday: {
                    open_1: null,
                    close_1: null,
                    open_2: null,
                    close_2: null,
                },
                wednesday: {
                    open_1: null,
                    close_1: null,
                    open_2: null,
                    close_2: null,
                },   
                thusrday: {
                    open_1: null,
                    close_1: null,
                    open_2: null,
                    close_2: null,
                },   
                friday: {
                    open_1: null,
                    close_1: null,
                    open_2: null,
                    close_2: null,
                },   
                saturday: {
                    open_1: null,
                    close_1: null,
                    open_2: null,
                    close_2: null,
                },    
                sunday: {
                    open_1: null,
                    close_1: null,
                    open_2: null,
                    close_2: null,
                },                                               
            }

            if(data.hours){
                hours_list = data.hours;
            }

            self.available_hours = ko.observable(false);
            // if(_.find(_.pairs(hours_list), function(day){ return day[1].closed == false })){
            //     self.available_hours(true);
            // }

            _.each(_.pairs(hours_list), function(day){
                if(day[1].closed == false) {
                    self.available_hours(true);
                }
                var day = new Day(day[0],day[1]);
                self.hours.push(day);
            });

            var convert_day = {
                0:6,
                1:0,
                2:1,
                3:2,
                4:3,
                5:4,
                6:5,
            }

            self.areWeOpened = ko.computed(function(){
                var d = convert_day[(new Date()).getDay()];
                var current_day = self.hours()[d];
                if(current_day.closed() || current_day.open_1() === undefined){
                    return false;
                }
                var start = current_day.open_1();
                if(start == null){
                    return false;
                }                
                start = start.split(":");
                start = new Date(2012,6,1,start[0],start[1]).getTime();
                console.log(start);                
                var now = new Date(2012,6,1,new Date().getHours(),new Date().getMinutes()).getTime();
                var end = current_day.close_1();
                if(end == null){
                    return false;
                }
                end = end.split(":");
                end = new Date(2012,6,1,end[0],end[1]).getTime();
                console.log(end);

                if(start > end){
                    var midnight = new Date(2012,6,1,"23","59").getTime();
                    var one_second_after_midnight = new Date(2012,6,1,"00","01").getTime();
                    if((now > start && now < midnight) || (now > one_second_after_midnight && now < end)) {
                        return true;
                        console.log("opened");
                    }
                    else {
                        return false;
                        console.log("closed");
                    }                     
                } else {
                    if( (start < now ) && (now < end )) {
                        return true;
                        console.log("opened");
                    }
                    else {
                        return false;
                        console.log("closed");
                    }                      
                }
              
            });  

            self.areWeOpenedText = ko.computed(function(){ return self.areWeOpened() ? 'open' : 'closed'});        

            self.socialVisible = function(type){
                return ko.computed(function(){
                    if(self[type]() != null && self[type]() != ""){
                        return true;
                    } else {
                        return false;
                    }
                })                
            }  

            self.createNewPageText = ko.computed(function(){
                if(self.pages().length < 3){
                    return "Create New Page";
                } else {
                    return "Max Pages Reached";
                }
            });        

            self.save = function(callback_done){
                self.subdomain.valueHasMutated();
                if(!self.validateSubdomain()){
                    bootbox.dialog({
                      message: "The subdomain you've chosen is either invalid or unavailable.",
                      title: "Invalid Subdomain",
                      buttons: {
                        success: {
                          label: "Ok",
                          className: "btn-primary pull-right col-xs-3",
                        },
                      }
                    }); 
                    return;                    
                }
                if(!self.validateAddress()){
                    bootbox.dialog({
                      message: "Please enter your restaurant address so that your users can find you.",
                      title: "Blank Address",
                      buttons: {
                        success: {
                          label: "Ok",
                          className: "btn-primary pull-right col-xs-3",
                        },
                      }
                    }); 
                    return;                    
                }
                if(!self.validatePhone()){
                    bootbox.dialog({
                      message: "You havent entered a phone number. Please do so that your customers can get in touch with you.",
                      title: "Blank Phone",
                      buttons: {
                        success: {
                          label: "Ok",
                          className: "btn-primary pull-right col-xs-3",
                        },
                      }
                    }); 
                    return;                    
                }                                

                var validate_hours = _.every(self.hours(),function(e){ 
                    if(e.closed()){
                        return true;
                    }
                    return (!e.closed() && !e.validateOpen_1() && !e.validateClose_1());
                });

                if(!validate_hours){
                    bootbox.dialog({
                      message: "The hours you entered are incorrect or missing. Look for the one highlighted red.",
                      title: "Invalid Hours",
                      buttons: {
                        success: {
                          label: "Ok",
                          className: "btn-primary pull-right col-xs-3",
                        },
                      }
                    }); 
                    return;                    
                }    

                $.ajax({
                  type: "POST",
                  url: "/app/administration/update_restaurant",
                  data: {
                    restaurant_id: self.id,
                    params:ko.toJSON(self),
                  },
                  success: function(data, textStatus, jqXHR){
                        bootbox.dialog({
                          message: "Your information was saved",
                          title: "Saved!",
                          buttons: {
                            success: {
                                label: "Ok",
                                className: "btn-primary pull-right col-xs-3",
                                callback: function(){
                                    self.dirty(false);
                                    if(typeof(callback_done) == 'function'){
                                        callback_done();
                                    }
                                }                              
                            },                            
                          },
                        });      
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) { 
                        console.log("There was an error saving the section " + errorThrown);
                    },
                    dataType: "json"
                });                
            }

            self.subdomain.extend({ rateLimit: 700 });
            self.validateSubdomain = ko.observable(true);
            if(self.subdomain() == ""){
                self.validateSubdomain(false);
            }

            self.validateAddress = ko.computed(function(){
                if(self.address_line_1().length == 0){
                    return false;
                } else {
                    return true;
                }
            })

            self.validatePhone = ko.computed(function(){
                if(self.phone().length == 0){
                    return false;
                } else {
                    return true;
                }
            })            

            self.subdomain.subscribe(function(newvalue){
                if(newvalue == ""){
                    self.validateSubdomain(false);
                }
                $.ajax({
                  type: "POST",
                  url: "/app/administration/validate_subdomain",
                  data: {
                    restaurant_id: self.id,
                    subdomain: newvalue,
                  },
                  success: function(data, textStatus, jqXHR){
                        if(data.valid){
                            self.validateSubdomain(true);
                        } else {
                            self.validateSubdomain(false);
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) { 
                        console.log("There was an error saving the section " + errorThrown);
                        self.validateSubdomain(false);
                    },
                    dataType: "json"
                });
            });

            self.quick_save = function(callback_done){  
                $.ajax({
                  type: "POST",
                  url: "/app/administration/update_restaurant",
                  data: {
                    restaurant_id: self.id,
                    params:ko.toJSON(self),
                  },
                  success: function(data, textStatus, jqXHR){
                        bootbox.dialog({
                          message: "Saved!",
                          title: "Saved!",
                          buttons: {
                            success: {
                                label: "Ok",
                                className: "btn-primary pull-right col-xs-3",
                                callback: function(){
                                    if(typeof(callback_done) == 'function'){
                                        callback_done();
                                    }
                                }                              
                            },                            
                          },
                        });      
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) { 
                        console.log("There was an error saving the section " + errorThrown);
                    },
                    dataType: "json"
                });                
            }

            self.dirty = ko.observable(false);
            self.dirtyTrack = ko.computed(function(){
                self.name();
                self.subdomain();
                self.address_line_1();
                self.phone();
                self.city();
                self.postal_code();
                self.province();
                self.email();
                self.dirty(true);
            });
            self.dirty(false);

            self.newPage = function(){
                var new_page = new Page();
                self.pages.push(new_page);
                return new_page;
            }

        }

        ko.bindingHandlers.fixSubdomain = {
            update: function (element, valueAccessor, allBindingsAccessor, viewModel)
            {
                var value = ko.utils.unwrapObservable(valueAccessor());
                if(value === undefined){
                    value == "";
                }
                viewModel.subdomain(value.replace(/[^0-9a-zA-Z]/g, ''));
            }
        };         


        ko.bindingHandlers.slider = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel)
            {
                var value = valueAccessor();
                var min = value[1];
                var max = value[2];
                value = value[0];

                $( element ).slider({
                  slide: function( event, ui ) {
                    value(ui.value);
                  },
                  max: max,
                  min: min,
                  step: 1,
                  value: value(),
                });
            }
        };

        ko.bindingHandlers.colorpicker = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel)
            {
                var value = valueAccessor();
                $(element).colpick({
                    colorScheme:'dark',
                    layout:'hex',
                    color:value(),
                    onSubmit:function(hsb,hex,rgb,el) {
                        $(el).css('background-color', '#'+hex);
                        value(hex);
                        $(el).colpickHide();
                    },
                    onChange:function(hsb,hex,rgb,el,bySetColor) {
                        $(el).css('background-color', '#'+hex);
                        value(hex);
                    }                    
                });
                $(element).css("background-color","#"+value());
            }
        };                               

