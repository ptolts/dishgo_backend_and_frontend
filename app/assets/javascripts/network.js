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

    if(!ko["menuVisible"]){
        ko.menuVisible = ko.observable(false);
    }

    if(!ko["reloadMap"]){
        ko.reloadMap = ko.observable(false);
    }    

    var self = this;
    self.loading = ko.observable(true);
    self.newDomCounter = 0;
    self.network_sign_in = ko.observable(false);
    self.preview = ko.observable(true);
    self.restaurant = ko.observable(new Restaurant(resto_data));
    self.languages = self.restaurant().languages; 
    self.lang = ko.observable(self.restaurant().default_language() ? self.restaurant().default_language() : 'en');
    lang = self.lang;
    self.selected_dish = ko.observable();

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

    self.main_title_visible = ko.computed(function(){
        if($(window).width() < 900) {
            return true;
        } else {
            return !ko["menuVisible"]();
        }
    })

    self.set_dish = function(dish) {
        self.selected_dish(dish);
    };  

    self.getFullLangName = function(l){ 
      return ko.observable(self.languages_full[l]) 
    }      

    self.display_menu = ko.observable(false);
    self.display_menu_toggle = function(){
        self.display_menu(!self.display_menu());
    } 

    self.goto_and_kill_menu = function(location){
        pager.navigate("#!/" + location);
        self.display_menu(false);        
    }     

    self.contact_tr = ko.observable({
        'en':'Contact',
        'fr':'Contact'
    });

    self.menu_tr = ko.observable({
        'en':'Menu',
        'fr':'la Carte'
    }); 

    self.about_tr = ko.observable({
        'en':'About',
        'fr':'Sur'
    });

    self.gallery_tr = ko.observable({
        'en':'Gallery',
        'fr':'Galerie'
    });    

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
         
    self.showDetails = ko.observable(false);
    self.toggleDetails =  function(){
        self.showDetails(!self.showDetails());
    }   

    // self.sections($.map(menu_data.menu, function(item) { return new Section(item,self) }));
    // self.menu(self.sections());

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

    self.computeImage = function(image){
        //console.log(image);
        if(self.design.imgs[image]){
            return "url(" + self.design.imgs[image]() + ")";
        } else {
            return "";
        }
    };        

};

//
// Client IDS
// Defines the CLIENT_ID (AppID's) of the OAuth2 providers
// relative to the domain host where this code is presented.

// Register your domain with Facebook at  and add here
// var FACEBOOK_CLIENT_ID = '886480311381787';
var FACEBOOK_CLIENT_ID = '886479778048507';


var GOOGLE_CLIENT_ID = '656984324806-sr0q9vq78tlna4hvhlmcgp2bs2ut8uj8.apps.googleusercontent.com';


var DROPBOX_CLIENT_ID = '1lkagy1bz7h2uhl';

var LINKEDIN_CLIENT_ID = 'bixrjszkfk0j';

var YAHOO_CLIENT_ID = 'dj0yJmk9TTNoTWV6eE5ObW5NJmQ9WVdrOWVtSmhVbk5pTm1VbWNHbzlNVFUxT0RNeU16UTJNZy0tJnM9Y29uc3VtZXJzZWNyZXQmeD0yZQ--';


var TWITTER_CLIENT_ID = 'OIaEFYGvvfvoqcoakQ5OyePzJ';


var SOUNDCLOUD_CLIENT_ID = '8a4a19f86cdab097fa71a15ab26a01d6';


var FOURSQUARE_CLIENT_ID = '3HEXMBQVH2SV0VXUKXOGQRPWH1PUTEIZN4KBDY5L54ZDXCDP';


var GITHUB_CLIENT_ID = 'ca7e06a718b2e8eef737';


var INSTAGRAM_CLIENT_ID = 'bfbbf362ac3148aeb1150e5b8256bbe9';


var BOX_CLIENT_ID = 'rdyb5se2fcuioryle3qdw2wcrps959x4';


var FLICKR_CLIENT_ID = '46dfea40b0f9d3765bc598966b5955d3';

// To make it a little easier
var CLIENT_IDS_ALL = {
    // google : GOOGLE_CLIENT_ID,
    facebook : FACEBOOK_CLIENT_ID,
    // dropbox : DROPBOX_CLIENT_ID,
    twitter : TWITTER_CLIENT_ID,
    // yahoo : YAHOO_CLIENT_ID,
    instagram : INSTAGRAM_CLIENT_ID,
    // linkedin : LINKEDIN_CLIENT_ID,
    // soundcloud : SOUNDCLOUD_CLIENT_ID,
    // foursquare : FOURSQUARE_CLIENT_ID,
    // github : GITHUB_CLIENT_ID,
    // flickr: FLICKR_CLIENT_ID
};