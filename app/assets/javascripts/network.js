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
        if(bindingContext['$menu']){
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
        var half = "<i class=\"fa fa-star-half-o\"></i>"
        var rating = value;
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
        ko.utils.setHtml(element, result);        
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

ko.bindingHandlers.currentMenu = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        bindingContext['$menu'] = ko.observable(bindingContext['$root'].selected_menu() == bindingContext['$data']);
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        bindingContext['$menu'](bindingContext['$root'].selected_menu() == bindingContext['$data']);
    }
};

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

    if("resto_data" in window){
        self.restaurant = ko.observable(new Restaurant(resto_data));
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
                return "Log Out";
            } else {
                return "Log In";
            }
        }
    });

    self.ajax_search = function(){
        $.ajax({
            type: "POST",
            url: "/app/network/search",
            data: {
                restaurant_search_term: self.restaurant_search_term(),
            },
            success: function(data, textStatus, jqXHR){
                self.restaurants(_.map(data.restaurants,function(restaurant){ return new Restaurant(restaurant) }));
                console.log("Total count: " + data.count + " Received count: " + self.restaurants().length);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 

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

