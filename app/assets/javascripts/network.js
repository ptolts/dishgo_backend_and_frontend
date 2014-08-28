var isMobile = { 
Android: function() { return navigator.userAgent.match(/Android/i); }, 
BlackBerry: function() { return navigator.userAgent.match(/BlackBerry/i); }, 
iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, 
Opera: function() { return navigator.userAgent.match(/Opera Mini/i); }, 
Windows: function() { return navigator.userAgent.match(/IEMobile/i); }, 
any: function() { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };

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
        var value = valueAccessor();
        $(element).addClass("starRating");
        for (var i = 0; i < value(); i++)
           $("<i class='fa fa-star chosen'>").appendTo(element);
        for (var i = 0; i < (5-value()); i++)
           $("<i class='fa fa-star'>").appendTo(element);       
       
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
                    viewModel.rate();
                }
            });
        });            
    },
    update: function(element, valueAccessor) {
        // Give the first x stars the "chosen" class, where x <= rating
        var observable = valueAccessor()();
        $("i", element).each(function(index) {
            if(index >= observable){
                $(this).addClass("left_over");
            } else {
                $(this).removeClass("left_over");
            }
        });
    }    
};

ko.bindingHandlers.networkMaxHeight = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = valueAccessor();
        var page = bindingContext['$menu']();
        if(page){
            console.log("Menu Visible");
        }
        if($(window).width() > 768){
            setTimeout(function (element, value) {
                var maxHeight = 0;
                $(element).children("."+value).each(function(index,elem){
                    var elem = $(elem);
                    if(elem.outerHeight() > maxHeight)
                        maxHeight = elem.outerHeight();
                });
                $(element).children("."+value).css('min-height',maxHeight+'px');
            }, 0, element, value);
        }
    }    
}

ko.bindingHandlers.backgroundImage = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var src = viewModel.medium();
        $(element).css("background-image","url('" + src + "')");
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

var global_restaurant_id;

function NetworkModel() {

    var self = this;
    self.loading = ko.observable(true);
    self.network_sign_in = ko.observable(false);
    self.preview = ko.observable(true);
    lang = self.lang;
    self.selected_dish = ko.observable();
    self.user = ko.observable(new User(user_data));
    self.restaurants = ko.observableArray([]);
    self.restaurant_search_term = ko.observable("");
    self.isMobile = isMobile.any();
    self.email = ko.observable();
    self.password = ko.observable();

    if("resto_data" in window){
        self.restaurant = ko.observable(new Restaurant(resto_data));
        global_restaurant_id = self.restaurant().id;
        self.lang = ko.observable(self.restaurant().default_language() ? self.restaurant().default_language() : 'en');
        self.languages = self.restaurant().languages;  
        self.getFullLangName = function(l){ 
          return ko.observable(self.languages_full[l]) 
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
            if(menu.default_menu()){
                self.selected_menu(menu);
            }
        });

        if(!self.selected_menu() && self.menus().length > 0){
            self.selected_menu(self.menus()[0].menu());
        }                                   
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
            if(self.restaurant_search_term().length == 0){
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
    self.ajax_search = function(){
        $.ajax({
            type: "POST",
            url: "/app/network/search",
            data: {
                restaurant_search_term: self.restaurant_search_term(),
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
    }

    self.search_restaurants = ko.computed({
        read: function(){
            if(self.restaurant_search_term().length > 0){
                self.ajax_search();
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

