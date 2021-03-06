var isMobile = { 
Android: function() { return navigator.userAgent.match(/Android/i); }, 
BlackBerry: function() { return navigator.userAgent.match(/BlackBerry/i); }, 
iOS: function() { return navigator.userAgent.match(/iPhone|iPod/i); }, 
Opera: function() { return navigator.userAgent.match(/Opera Mini/i); }, 
Windows: function() { return navigator.userAgent.match(/IEMobile/i); }, 
any: function() { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };

ko.bindingHandlers.upload_cover_photo = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = valueAccessor()();
        $(element).fileupload({
            dropZone: $(element),
            formData: {
                restaurant_id: restaurant_id,
            },           
            url: "/app/administration/upload_cover_photo",
            dataType: 'json',
            progressInterval: 50,
            add: function(e,data){
                image = value.addCoverPhoto();
                data.image = image;
                data.submit();
            },
            submit: function(e, data){

            },
            send: function (e, data) {
                data.image.started(true);
            },
            done: function (e, data) {
                var file = data.result.files[0];                 
                data.image.update_info(file);                                               
            },
            progress: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                data.image.progressValue(progress);
            },
            fail: function (e, data) {
                data.image.failed(true);
            },                       
        });    
    }
};

ko.bindingHandlers.cover_photo = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
        if(value() && value().original()){
            $(element).addClass("cover-photo");
            $(element).css('background-image', 'url(' + value().original() + ')');
        } else {
            $(element).removeClass("cover-photo");
            $(element).css('background-image', 'none');

        }
    }
};

ko.bindingHandlers.slideVisible = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
        var jElement = $(element);
        if(value && !jElement.is(":visible")){
            jElement.toggle( "slide" );
        }

        if(!value && jElement.is(":visible")){
            jElement.toggle( "slide" );
        }
    }
};

ko.bindingHandlers.mobileSearchTop = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor();
        if(value){
            $(element).addClass("mobileTopSearchBar");
        } else {
            $(element).removeClass("mobileTopSearchBar");
        }
    }
};

ko.bindingHandlers.menuVisibleImage = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var underlyingObservable = valueAccessor();
        if(bindingContext['$menu']()){
            element.setAttribute('src', underlyingObservable());
        } else {
            element.setAttribute('src', "");
        }
    }
};

ko.bindingHandlers.starRating = {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value = valueAccessor()();
        var full = "<i class=\"fa fa-star\"></i>";
        var left_full = "<i class=\"fa fa-star left_over fa-flip-horizontal\"></i>";
        var left_half = "<i class=\"fa fa-star-half-o left_over fa-flip-horizontal\"></i>";
        var half = "<i class=\"fa fa-star-half-o\"></i>"        
        var rating = value;
        var left_over = 5 - value;
        var result = "";
        while(rating > 0){
            if(rating >= 1){
                rating--;
                result = result + full;
                continue;
            }
            if(rating >= 0.5){
                rating = rating - 0.5;
                result = result + half;
                continue;
            }
        }
        while(left_over > 0){
            if(left_over >= 1){
                left_over--;
                result = result + left_full;
                continue;
            }
            if(left_over >= 0.5){
                left_over = left_over - 0.5;
                result = result + left_half;
                continue;
            }
        }        
        ko.utils.setHtml(element, result);        
    }
};

ko.bindingHandlers.stopBubbleUpload = {
  init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    ko.utils.registerEventHandler(element, "click", function(event) {
        event.cancelBubble = true;
        if(!bindingContext["$loggedin"]()){
            if (event.stopPropagation) {
                event.stopPropagation(); 
            }
            if(event.preventDefault){
                event.preventDefault();
            }          
            return;
        }           
    });
  }
};

ko.bindingHandlers.network_file_upload = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = valueAccessor();      
        $(element).fileupload({
            dropZone: $(element),
            formData: {
                restaurant_id: global_restaurant_id,
                dish_id: viewModel.id(),
            },           
            url: "/app/api/v1/restaurant_admin/upload_image_file",
            dataType: 'json',
            progressInterval: 50,
            add: function(e,data){
                if(!bindingContext["$loggedin"]()){
                    return;
                }                  
                image = viewModel.addImage();
                data.image = image;
                data.submit();
            },
            submit: function(e, data){
                console.log(data);
            },
            send: function (e, data) {
                data.image.started(true);
            },
            done: function (e, data) {
                var file = data.result;                 
                data.image.update_info(file);                                               
            },
            progress: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                data.image.progressValue(progress);
            },
            fail: function (e, data) {
                data.image.failed(true);
            },                       
        });    
    }
};

ko.bindingHandlers.fullWidthToTop = {
    update: function (element, valueAccessor) {
        var value = valueAccessor()();
        if(value){
            setTimeout(function(){
                $('html,body').animate({scrollTop: $(element).offset().top - 10}, 800);
            }, 500);
        } 
    }
};

ko.bindingHandlers.writableStarRating = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = valueAccessor()().rating;
        $(element).addClass("starRating");

        for (var i = 0; i < 5; i++)
           $("<i class='fa fa-star left_over'>").appendTo(element);       
       
        // Handle mouse events on the stars
        $("i", element).each(function(index) {
            $(this).hover(
                function() { 
                    $(this).prevAll().add(this).addClass("hoverChosen");
                    $(this).nextAll().addClass("hoverLeftOver");
                }, 
                function() { 
                    $(this).prevAll().add(this).removeClass("hoverChosen");
                    $(this).nextAll().removeClass("hoverLeftOver");
                }                
            ).click(function() { 
                if(bindingContext["$loggedin"]()){
                    value(index+1);
                    valueAccessor()().rate(bindingContext["$data"].id());
                }
            });
        });            
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // Give the first x stars the "chosen" class, where x <= rating
        var observable = valueAccessor()();
        var fullWidth = allBindingsAccessor().fw;
        var rating = observable.rating();

        if(fullWidth() && !observable.id() && bindingContext["$root"].user().id()){
            observable.fetch_rating(bindingContext["$data"].id());
            return;
        }

        if(observable.id()){
            $("i", element).each(function(index) {
                if(index >= rating){
                    $(this).addClass("left_over");
                } else {
                    $(this).removeClass("left_over");
                }
            });
        }
    }    
};

ko.bindingHandlers.networkMaxHeight = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = valueAccessor();
        var page = bindingContext['$menu']();
        if($(window).width() > 768){
            setTimeout(function (element, value, viewModel) {
                var maxHeight = 0;
                $(element).children("."+value).each(function(index,elem){
                    var elem = $(elem);
                    if(elem.outerHeight() > maxHeight)
                        maxHeight = elem.outerHeight();
                });
                $(element).children("."+value).css('min-height',maxHeight+'px');
            }, 0, element, value, viewModel);
        }
        setTimeout(function (element, value, viewModel) {
            if("direct_dish_id" in window && "direct_section_id" in window && viewModel.id() == direct_section_id){
                if(direct_dish_id.fullWidth){
                    direct_dish_id.fullWidth(true);
                }
                // direct_dish_id = null;
            }
        }, 0, element, value, viewModel);
    }    
}

ko.bindingHandlers.backgroundImage = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        if(viewModel.constructor.name == "Dish"){
            var src = viewModel.top_image;
        } else {
            var src = viewModel.medium();
        }
        if(src){
            $(element).css("background-image","url('" + src + "')");            
        }
    }    
}

ko.bindingHandlers.currentMenu = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        bindingContext['$menu'] = ko.observable(bindingContext['$root'].selected_menu() == bindingContext['$data']);
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        bindingContext['$menu'](bindingContext['$root'].selected_menu() == bindingContext['$data']);
    }
};

ko.bindingHandlers.loggedInChecker = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        bindingContext['$loggedin'] = function(){ 
            if(valueAccessor()()){
                return true;
            } else {
                viewmodel.network_sign_in(true);
                return false;
            }
        }
    },
};
ko.virtualElements.allowedBindings.loggedInChecker = true;


var global_restaurant_id;
var lang;
var social_share = ko.observable(false);

function NetworkModel() {

    var self = this;
    self.loading = ko.observable(true);
    self.network_sign_in = ko.observable(false);
    self.register = ko.observable(true);
    self.social_share = social_share;
    self.preview = ko.observable(true);
    self.selected_dish = ko.observable();
    self.user = ko.observable(new User(user_data));
    self.restaurants = ko.observableArray([]);
    self.dishes = ko.observableArray([]);
    self.restaurant_search_term = ko.observable("");
    self.restaurant_categories = ko.observableArray([]);
    self.isMobile = isMobile.any();
    self.email = ko.observable();
    self.password = ko.observable();
    self.search_type = ko.observable("restaurant");
    self.coverPhotoHover = ko.observable(false);

    self.too_short = ko.computed({
        read: function(){
            if(self.password() == null){
                return false;
            } else if(self.password().length < 8){
                return true;
            }
            return false;
        },
        deferEvaluation: true,
    });

    self.searchPlaceholder = ko.computed({
        read: function(){
            if(self.search_type() == "dish"){
                return "Search Dish Name";
            } else {
                return "Search Restaurant Name";
            }
        },
        deferEvaluation: true,
    });

    self.shareNetworkFB = function(){
        FB.ui({
          method: 'share',
          href: 'https://dishgo.ca/app/network/',
        }, function(response){});     
    }    

    if("resto_data" in window){
        self.restaurant = ko.observable(new Restaurant(resto_data));
        global_restaurant_id = self.restaurant().id;
        self.languages = self.restaurant().languages; 

        self.getFullLangName = function(l){ 
          return ko.observable(self.languages_full[l]) 
        }

        self.shareFB = function(){
            FB.ui({
              method: 'share',
              href: 'https://dishgo.ca/app/network/restaurant/' + global_restaurant_id,
            }, function(response){});     
        }

        self.show_lang = ko.computed(function(){
            if(self.languages().length > 1){
                return true;
            } else {
                return false;
            }
        }); 

        self.languages_full = {
          'en'  : 'English',
          'fr'  : 'Français',
        }
        self.menus = ko.observableArray([]);
        self.menus($.map(menu_data, function(item) { 
                                                return new Menu(item, self) 
                                            }
        ));

        self.selected_menu = ko.observable();

        _.each(self.menus(),function(menu){
            if(direct_menu_id && menu.id() == direct_menu_id){
                self.selected_menu(menu);
                return;
            }
            if(self.selected_menu()){
                return;
            }            
            if(menu.default_menu()){
                self.selected_menu(menu);
            }
        });

        if(!self.selected_menu() && self.menus().length > 0){
            self.selected_menu(self.menus()[0].menu());
        }
        self.lang = lang;                                  
    } 

    if(!$.cookie("language")){
        $.cookie('language', 'en', { expires: 365, path: '/' });
        var def_lang = 'en';
    } else {
        var def_lang = $.cookie("language");
    }

    if(typeof lang == 'function'){
        lang(def_lang);
    } else {
        self.lang = ko.observable(def_lang);
        lang = self.lang; 
    }   

    // Switch Languages
    self.language = ko.computed(function(){
        if(self.lang() == 'en'){
            return "Français";
        } else {
            return "English";
        }
    });

    // Switch Languages
    self.mobile_language = ko.computed(function(){
        if(self.lang() == 'en'){
            return "FR";
        } else {
            return "EN";
        }
    });    

    self.flip_language = function(){
        if(self.lang() == "en"){
            self.lang("fr");
        } else {
            self.lang("en");
        }
        $.cookie('language', self.lang(), { expires: 365, path: '/' });        
    }    

    self.showDetails = ko.observable(false);
    self.toggleDetails =  function(){
        self.showDetails(!self.showDetails());
    }        

    self.set_dish = function(dish) {
        self.selected_dish(dish);
    };  

    self.social_networks = ko.computed({
        read: function(){
            return [self.user().facebook(),self.user().twitter()];
        },
        deferEvaluation: true
    });

    self.updateUserMonitor = ko.computed({
        read: function(){
            if(updateUser()){
                $.ajax({
                    type: "POST",
                    url: "/app/network/fetch_user",
                    success: function(data, textStatus, jqXHR){
                        self.user(new User(data));
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) { 

                    },
                    dataType: "json"
                });
            }
        }
    });
  
    self.top_search = ko.computed({
        read: function(){
            if(self.restaurant_search_term().length == 0 && self.restaurant_categories().length == 0){
                return false;
            } else {
                return true;
            }
        },
        deferEvaluation: true,
    });

    self.login_text = ko.computed({
        read: function(){
            if(self.user().id()){
                return "Profile";
            } else {
                return "Log In";
            }
        }
    });

    self.signInSpin = ko.observable(false);
    self.signInWithUserPass = function(){
        self.signInSpin(true);
        $.ajax({
            type: "POST",
            url: "/app/network/fetch_user",
            data: {
                email: self.email(),
                password: self.password(),
            },
            success: function(data, textStatus, jqXHR){
                updateUser(true);
                self.password("");
                self.email("");
                self.signInSpin(false);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("Bad Email or Password.");
                self.password("");
                self.email("");
                self.signInSpin(false);
            },
            dataType: "json"
        });
    };

    self.registerWithUserPass = function(){
        self.signInSpin(true);
        $.ajax({
            type: "POST",
            url: "/app/user_reg/create",
            data: {
                email: self.email(),
                password: self.password(),
            },
            success: function(data, textStatus, jqXHR){
                if(data.error){
                    alert("Bad Email or Password.");
                    self.password("");
                    self.signInSpin(false);
                    return;                    
                }
                updateUser(true);
                self.password("");
                self.email("");
                self.signInSpin(false);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("Bad Email or Password.");
                self.password("");
                self.signInSpin(false);
            },
            dataType: "json"
        });
    };    

    self.loggedIn = ko.computed({
        read: function(){
            return !!self.user().id();
        }
    });

    self.loggedInWithRestaurant = ko.computed({
        read: function(){
            return self.loggedIn() && !!self.user().restaurant_id();
        }
    });    

    self.searchArray = ko.observableArray([]);
    self.searching = ko.computed(function(){ return self.searchArray().length > 0 }).extend({ rateLimit: { method: "notifyWhenChangesStop", timeout: 100 } });

    self.restaurant_search_request = function(){
        $.ajax({
            type: "POST",
            url: "/app/network/search",
            data: {
                restaurant_search_term: self.restaurant_search_term(),
                categories: self.restaurant_categories(),
            },
            beforeSend: function(){
                self.searchArray.push(this);
            },
            success: function(data, textStatus, jqXHR){
                self.searchArray.remove(this);
                self.restaurants(_.map(data.restaurants,function(restaurant){ return new Restaurant(restaurant) }));
                console.log("Total count: " + data.count + " Received count: " + self.restaurants().length);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                self.searchArray.remove(this);
            },
            dataType: "json"
        });         
    };

    self.dish_search_request = function(){
        $.ajax({
            type: "POST",
            url: "/app/network/dish_search",
            data: {
                dish_search_term: self.restaurant_search_term(),
            },
            beforeSend: function(){
                self.searchArray.push(this);
            },
            success: function(data, textStatus, jqXHR){
                self.searchArray.remove(this);
                self.dishes(_.map(data.dishes,function(dish){ return new Dish(dish) }));
                console.log("Total count: " + data.count + " Received count: " + self.dishes().length);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                self.searchArray.remove(this);
            },
            dataType: "json"
        });         
    };    

    self.search_restaurants = ko.computed({
        read: function(){
            if(self.restaurant_search_term().length > 0){
                if(self.search_type() == "restaurant"){
                    self.dishes([]);
                    self.restaurant_search_request();
                } else {
                    self.restaurants([]);
                    self.dish_search_request();
                }
            }
        }
    }).extend({rateLimit: 500});

    self.search_restaurants_by_category = ko.computed({
        read: function(){
            if(self.restaurant_categories().length > 0){
                self.dishes([]);
                self.restaurant_search_request();
            }
        }
    }).extend({rateLimit: 500});    

    var keep_scrolling_updates = true;
    self.atTop = ko.observable(false);
    if($(window).width() > 600){
        keep_scrolling_updates = false;
    }

    //This is for anything that should be applied to small screens.
    if(keep_scrolling_updates){    
        $(document).on("scrollstop",function(){
            console.log("scrollstop " + $("body").scrollTop());
            if($("body").scrollTop() <= 30){
                self.atTop(false);
            } else {
                self.atTop(true);
            }           
         });
        if($("body").scrollTop() <= 30){
            self.atTop(false);
        } else {
            self.atTop(true);
        }  
        // $(function(){          
        //     FastClick.attach(document.body);
        // });
    }


    var body = document.body,
        timer;

    window.addEventListener('scroll', function() {
      clearTimeout(timer);
      if(!body.classList.contains('disable-hover')) {
        body.classList.add('disable-hover')
      }
      
      timer = setTimeout(function(){
        body.classList.remove('disable-hover')
      },500);
    }, false);    

    self.computeImage = function(image){
        //console.log(image);
        if(self.design.imgs[image]){
            return "url(" + self.design.imgs[image]() + ")";
        } else {
            return "";
        }
    };        

};

