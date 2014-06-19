/*
*= require design
*/  


    ko.bindingHandlers.profile_file_upload = {
        update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var self = this;
            var value = valueAccessor();
            $(element).fileupload({
                dropZone: $(element),
                formData: {restaurant_id: restaurant_id},
                url: image_upload_url,
                dataType: 'json',
                progressInterval: 50,
                done: function (e, data) {
                    var file = data.result.files[0];
                    value.update_info(file);                
                },
                progressall: function (e, data) {
                    var progress = parseInt(data.loaded / data.total * 100, 10);
                    value.progressValue(progress);
                },
                fail: function (e, data) {
                    value.failed(true);
                },      
            });
        }
    };


  function ImageObj(data) {
    var self = this;
    self.progressValue = ko.observable(1);
    self.filename = ko.observable("");
    self.id = ko.observable("");
    self.url = ko.observable("/loader.gif");
    self.original = ko.observable("/loader.gif");
    self.medium = ko.observable("/loader.gif");
    self.small = ko.observable("/loader.gif");
    self.completed = ko.observable(false);
    self.image_width = ko.observable(0);
    self.image_height = ko.observable(0);
    self.rejected = ko.observable(false);
    self.coordinates = [];
    self.failed = ko.observable(false);

    if(data){
        if(data.local_file || data.url){
            self.id(data._id);
            self.url = ko.observable(data.local_file || data.url);
            self.completed(true);
            self.original = ko.observable(data.original);
            self.medium = ko.observable(data.medium);
            self.image_width = ko.observable(data.width);
            self.image_height = ko.observable(data.height);            
        }
        self.rejected(data.rejected ? data.rejected : false);
        self.small = ko.observable(data.small ? data.small : "/loader.gif");
    }

    self.crop = function(){
        $.ajax({
              type: "POST",
              url: image_crop_url,
              data: {
                image_id: self.id(),
                coordinates: self.coordinates,
            },
            success: function(data, textStatus, jqXHR){
                self.update_info(data);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                console.log(textStatus);
            },
            dataType: "json"
        }); 
    }

    self.reject = function(){
        $.ajax({
              type: "POST",
              url: "/app/profile/reject_image",
              data: {
                image_id: self.id(),
            },
            success: function(data, textStatus, jqXHR){
                self.rejected(data.rejected);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                console.log(textStatus);
            },
            dataType: "json"
        }); 
    }     

    self.update_info = function(item){
        self.url(item.thumbnailUrl);
        self.small(item.small);
        self.id(item.image_id);
        self.original(item.original);
        self.image_width = ko.observable(item.width);
        self.image_height = ko.observable(item.height); 
        self.completed(true);
    }
}

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
            self.position = ko.observable(data.position ? data.position : 0);

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
            self.access_token = ko.observable(data.access_token);
            self.completed = data.completed;
            self.assigned_to = ko.observable(data.assigned_to);
            self.spin = ko.observable(false);
            self.saved = ko.observable(false);

            self.assign = function(id){
                self.spin(true);
                $.ajax({
                  type: "POST",
                  url: "/app/odesk/assign_to",
                  data: {
                    restaurant_id: id,
                    assigned_to: self.assigned_to()
                  },
                    success: function(data, textStatus, jqXHR){
                        self.spin(false);
                        self.saved(true);
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) { 
                        self.spin(false);
                    },
                    dataType: "json"
                });
            }

            self.mergeMenu = function(id){
                bootbox.dialog({
                  message: "Would you like to merge this menu? There is no going back!",
                  title: "Merge Menu",
                  buttons: {
                    no: {
                      label: "Cancel",
                      className: "btn-default pull-left col-xs-3",
                    },                    
                    success: {
                      label: "Merge",
                      className: "btn-info pull-right col-xs-3",
                      callback: function(){
                            self.spin(true);
                            $.ajax({
                              type: "POST",
                              url: "/app/odesk/merge_menu",
                              data: {
                                restaurant_id: id,
                              },
                                success: function(data, textStatus, jqXHR){
                                    self.spin(false);
                                    self.saved(true);
                                },
                                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                                    self.spin(false);
                                },
                                dataType: "json"
                            });
                      }
                    },
                  }
                });                 
            }            

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

            self.times = ["00:00", "00:30", "1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30", "5:00", "5:30", "6:00", "6:30", "7:00", "7:30", "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30","Closing"];


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

        function Email(data) {
            var self = this; 
            self.email = ko.observable(data.email);
            self.name = ko.observable(data.name);
            self.subject = ko.observable(data.subject);
        }

        Restaurant.prototype.toJSON = function() {
            var copy = ko.toJS(this); //easy way to get a clean copy
            delete copy.areWeOpened;
            delete copy.areWeOpenedText;
            delete copy.socialVisible;
            return copy; //return the copy to be serialized
        };

        function User(data) {
            var self = this;
            self.id = ko.observable(data._id ? data._id : null);
            self.email = ko.observable(data.email);
            self.phone = ko.observable(data.phone);
            self.setup_link = ko.observable(window.location.protocol + "//" + window.location.host + "/app/profile/set_password/" + data.setup_link);

            self.created = ko.computed({
                read: function(){
                    return !self.id();
                },
                deferEvaluation: true
            });

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

        function Restaurant(data) {
            console.log("New Restaurant: " + data.name);
            var self = this;
            self.languages = ko.observableArray(data.languages ? data.languages : ['en']);
            self.default_language = ko.observable(data.default_language ? data.default_language : 'en');
            self.available_languages = ko.observableArray(_.map(_.pairs(fullLanguageName),function(lang){ return new Language(lang[1],lang[0]) }));
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

            self.does_delivery = ko.observable(data.does_delivery ? data.does_delivery : false);

            self.lang = ko.observable(self.default_language());
            lang = self.lang;

            self.name = ko.observable(data.name ? data.name : "");
            self.multi_name = ko.observable(data.multi_name ? data.multi_name : default_language_hash);

            self.multi_resto_name = ko.computed({
                read: function(){
                    var l = lang();
                    var name_hash = self.multi_name();
                    if(l && name_hash[l] && name_hash[l].length > 0){
                        return name_hash[l];
                    }
                    return self.name();
                },
                deferEvaluation: true,
            });

            self.show_map = ko.observable(data.show_map ? data.show_map : false);
            self.show_hours = ko.observable(data.show_hours ? data.show_hours : false);
            self.show_menu = ko.observable(data.show_menu ? data.show_menu : false);

            self.logo = ko.observable(data.logo ? new GlobalImage(data.logo) : new GlobalImage({}));
            self.logo_settings = ko.observable(data.logo_settings ? new LogoSettings(data.logo_settings) : new LogoSettings());

            self.odesk = ko.observable(data.odesk ? new Odesk(data.odesk) : null );

            self.about_text = ko.observable(data.about_text ? data.about_text : copyDefaultHash(default_web_language_hash));

            self.pages = ko.observableArray([]);
            if(data.pages){
                self.pages(_.map(data.pages,function(page){ return new Page(page) }));
            }

            self.setupProfileImages = function(images){
                self.images(_.map(images,function(image){ return new ImageObj(image) }));
            }                   

            self.images = ko.observableArray([]);
            if(data.image){
                self.setupProfileImages(data.image);
            }     

            self.email_addresses = ko.observableArray([]);
            if(data.email_addresses){
                self.email_addresses(_.map(data.email_addresses,function(email){ return new Email(email) }));
            }
            self.addEmail = function(){
                self.email_addresses.push(new Email({}));
            }

            self.remove_email = function(email){
                self.email_addresses.remove(email);
            }

            self.new_image_holder = ko.observable(new ImageObj());
            self.new_image = ko.computed(function(){    
                if(self.new_image_holder().completed()){
                    self.images.push(self.new_image_holder());
                    self.new_image_holder(new ImageObj());
                }
                return self.new_image_holder();
            });

            self.menu_images = ko.observableArray([]);

            if(data.menu_images){
                self.menu_images(_.map(data.menu_images,function(img){ return new GlobalImage(img) }))
            }

            self.created_menu_image;

            self.computed_menu_images = ko.computed({
                read: function(){
                    if(_.every(self.menu_images(),function(e){ console.log(e);return e.completed() }) || self.menu_images().length == 0){
                        var new_image = new GlobalImage({});
                        self.created_menu_image = new_image;
                        self.menu_images.push(new_image);
                    }
                    if(self.created_menu_image.completed()){
                        var new_image = new GlobalImage({});
                        self.created_menu_image = new_image;
                        self.menu_images.push(new_image);
                    }
                    self.menu_images.remove(function(img){ return img.destroyed() });
                    return self.menu_images();
                },
                deferEvaluation: true,
            })           

            self.hours = ko.observableArray([]);

            self.hours_list = {
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
                thursday: {
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

            self.backUpList = self.hours_list;

            console.log(data.hours != {});

            if(data.hours && !jQuery.isEmptyObject(data.hours)){
                self.hours_list = data.hours;
            }

            self.available_hours = ko.observable(false);
            // if(_.find(_.pairs(hours_list), function(day){ return day[1].closed == false })){
            //     self.available_hours(true);
            // }

            // _.each(_.pairs(hours_list), function(day){
            //     if(day[1].closed == false) {
            //         self.available_hours(true);
            //     }
            //     var day = new Day(day[0],day[1]);
            //     self.hours.push(day);
            // });

            _.each(_.pairs(self.backUpList), function(day){
                var day = self.hours_list[day[0]];
                if(day.closed == false) {
                    self.available_hours(true);
                }
                var day = new Day(day.name,day);
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

            self.current_day = ko.computed({
                read: function(){
                    var d = convert_day[(new Date()).getDay()];
                    var current_day = self.hours()[d];
                    return current_day;
                },
                deferEvaluation: true
            }); 

            self.showHourSign = ko.computed({
                read: function(){
                    var current_day = self.current_day();
                    if(current_day.close_1() == "Closing"){
                        return false;
                    }
                    return true;
                },
                deferEvaluation: true
            });           

            self.areWeOpened = ko.computed(function(){
                var current_day = self.current_day();
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
                if(self.pages().length < 4){
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

            self.regenerateToken = function(callback_done){  
                $.ajax({
                  type: "POST",
                  url: "/app/odesk/regenerate_token",
                  data: {
                    restaurant_id: self.id,
                  },
                  success: function(data, textStatus, jqXHR){
                        self.odesk().access_token(data.token);     
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) { 
                        console.log("There was an error saving the section " + errorThrown);
                    },
                    dataType: "json"
                });                
            }

            self.spin = ko.observable(false);
            self.saved = ko.observable(false);
            self.listed = ko.observable(data.listed || false);
            self.listInAppText = ko.computed(function(){
                if(self.listed()){
                    return "Unlist";
                } else {
                    return "List";
                }
            });
            self.listInApp = function(){  
                self.spin(true);
                self.listed(!self.listed());
                $.ajax({
                  type: "POST",
                  url: "/app/administration/list_in_app",
                  data: {
                    restaurant_id: self.id,
                    listed: self.listed(),
                  },
                  success: function(data, textStatus, jqXHR){
                        self.spin(false);
                        self.saved(true);
                        self.odesk().access_token(data.token);     
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        self.saved(false);
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

            // self.dishes.extend({ rateLimit: 500 });
            self.pages.subscribe(function(newvalue){
                _.each(self.pages(),function(item,index){
                    // console.log(item.name());
                    item.position(index);
                });
            });              

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

