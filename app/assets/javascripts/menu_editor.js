/*
*= require jquery.Jcrop.min.js
*= require mb.bgndGallery.js
*= require mb.bgndGallery.effects.js
*= require jquery.hashchange.min.js
*= require knockout-sortable.js
*= require loglevel.js
*= require masonry.min.js
*= require section.js
*= require dish.js
*= require option.js
*= require individual_option.js
*= require size_prices.js
*= require restaurant
*= require lightbox.js
*/

var internet_connection_error = ko.observable(false);
function retryAjax(ret){
    if(ret.retry_count == undefined){
        ret.retry_count = 0;
    }
    if(ret.retry_count > 2){
        internet_connection_error(true);
        if(viewmodel){
            if(viewmodel.saving()){
                viewmodel.saving([]);
            }
        }
        return;
    } else {
        ret.retry_count++;
        setTimeout(function(){ $.ajax(ret); }, 3000);                              
    }
}

ko.bindingHandlers.saving = {
    update: function (element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor()();
        var save = "<a>Saving <i class='fa fa-spinner fa-spin'></i></a>";
        var saved = "<a>Saved <i class='fa fa-check-square'></i></a>";
        if(value){
            $(element).html(save);
            $(element).fadeIn(500);
        } else {
            $(element).html(saved);
            $(element).fadeOut(2000);
        }
    }    
}

ko.bindingHandlers.lightBox = {
    update: function (element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor();
        setTimeout(function (element, value) {
            buildLightbox();
        }, 0, element, value);
    }    
}

ko.bindingHandlers.maxHeight = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = valueAccessor();
        var page = pager.getParentPage(bindingContext);
        if(page){
            console.log("page is visible: " + page.isVisible());
        }
        if($(window).width() > 768){
            setTimeout(function (element, value) {
                var maxHeight = 0;
                $(element).children("."+value).each(function(index,elem){
                    var elem = $(elem);
                    if(elem.outerHeight() > maxHeight)
                        maxHeight = elem.outerHeight();
                });
                console.log(maxHeight);
                $(element).children("."+value).css('min-height',maxHeight+'px');
            }, 0, element, value);
        }
    }    
}

ko.bindingHandlers.fbMaxHeight = {
    update: function (element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor();
        setTimeout(function (element, value) {
            var maxHeight = 0;
            $(element).children("."+value).each(function(index,elem){
                var elem = $(elem);
                if(elem.outerHeight() > maxHeight)
                    maxHeight = elem.outerHeight();
            });
            console.log(maxHeight);
            $(element).children("."+value).css('min-height',maxHeight+'px');
        }, 0, element, value);
    }    
}

ko.bindingHandlers.forEachWithLength = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, context)
    {         
        return ko.bindingHandlers.foreach.init(element, valueAccessor, allBindingsAccessor, viewModel, context);
    },
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, context) 
    {         
        var array = ko.utils.unwrapObservable(valueAccessor());
        var extendedContext = context.extend({"$length" : array.length });
        ko.bindingHandlers.foreach.update(element, valueAccessor, allBindingsAccessor, viewModel, extendedContext);   
    }
};
ko.virtualElements.allowedBindings.forEachWithLength = true;

ko.bindingHandlers.fitText = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var self = this;
        // var value = valueAccessor();
        //console.log("DEBUG: fitText firing on: " + element);
        // $(element).fitText(1.2,{ minFontSize: '20px', maxFontSize: '60px' }).resize()
        var resize = function(){
            $(element).parent().textfill({ maxFontPixels: 36});
        }

        $(window).on('resize orientationchange', resize);        

        // if(value){
        //     resize();
        // }

        resize();
    }
};

ko.bindingHandlers.lTruncatedText = {
    update: function (element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor();
        var result = ko.observable(value()[lang()]);     
        var length = 140;
        var truncatedText = ko.observable(result().length > length ? result().substring(0, length) + "..." : result());
        // updating text binding handler to show truncatedText
        ko.bindingHandlers.text.update(element, function () {
            return truncatedText; 
        });
    }
};

ko.bindingHandlers.helperTip = {
    init: function(element, valueAccessor, allBindings) {
        var data = valueAccessor();
        if(!$('#' + data.template)[0]){
            return;
        }
        var new_element = document.createElement("div");
        //append a new ul to our element
        document.body.appendChild(new_element);

        //could use jQuery or DOM APIs to build the "template"
        new_element.innerHTML = $('#' + data.template).text();

        new_element = $(new_element).find("div")[0];

        data.when.helperFitter = ko.computed(function(){
            if(data.when()){
                if(data.position == 'bottom'){
                    var bodyRect = document.body.getBoundingClientRect();
                    var elemRect = element.getBoundingClientRect();
                    var offset   = elemRect.bottom + 10;
                    var right_offset   = elemRect.right - ($(element).width()/2);;
                    $(new_element).css("top",offset+'px');
                    $(new_element).css("left",right_offset+'px');
                } else {
                    var bodyRect = document.body.getBoundingClientRect();
                    var elemRect = element.getBoundingClientRect();
                    var offset   = elemRect.top - bodyRect.top + ($(element).height()/2);
                    var right_offset   = elemRect.right + 10;
                    offset = offset - ($(new_element).height()/2);
                    $(new_element).css("top",offset+'px');
                    $(new_element).css("left",right_offset+'px');
                }
            }        
        });

        //apply foreach binding to the newly created ul with the data that we passed to the binding
        ko.applyBindingsToNode(new_element, { visible: data.when });

        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            // This will be called when the element is removed by Knockout or
            // if some other part of your code calls ko.removeNode(element)
            $(new_element).remove();
        });        

        //tell Knockout that we have already handled binding the children of this element
        return { controlsDescendantBindings: true };
    },
}

var opts = {
  lines: 13, // The number of lines to draw
  length: 20, // The length of each line
  width: 10, // The line thickness
  radius: 30, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#000', // #rgb or #rrggbb or array of colors
  speed: 1, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 200000, // The z-index (defaults to 2000000000)
  top: 'auto', // Top position relative to parent in px
  left: 'auto' // Left position relative to parent in px
};



ko.bindingHandlers.file_upload = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var self = this;
        viewModel.imageModel;
        $(element).fileupload({
            dropZone: $(element),
            formData: {restaurant_id: restaurant_id},
            url: image_upload_url,
            dataType: 'json',
            progressInterval: 50,
            send: function (e, data) {
                $.each(data.files, function (index, file) {
                    viewModel.imageModel = viewModel.addImage();
                    //console.log(viewModel.imageModel);
                    viewModel.imageModel.filename(file.name);
                });                
            },
            done: function (e, data) {
                var file = data.result.files[0];
                viewModel.imageModel.update_info(file);                
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                viewModel.imageModel.progressValue(progress);
            },
            fail: function (e, data) {
                viewModel.imageModel.failed(true);
            },      
        });
    }
};

ko.bindingHandlers.file_upload_icon = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var self = this;
        viewModel.imageModel;
        $(element).fileupload({
            dropZone: $(element),
            formData: {restaurant_id: restaurant_id},
            url: icon_upload_url,
            dataType: 'json',
            progressInterval: 50,
            send: function (e, data) {
                $.each(data.files, function (index, file) {
                    viewModel.imageModel = viewModel.addImage();
                    //console.log(viewModel.imageModel);
                    viewModel.imageModel.filename(file.name);
                });                
            },
            done: function (e, data) {
                var file = data.result.files[0];
                viewModel.imageModel.update_info(file);                               
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                viewModel.imageModel.progressValue(progress);
            },
            fail: function (e, data) {
                viewModel.imageModel.failed(true);
            },                       
        });
    }
};



ko.bindingHandlers.modalResize = {
    update: function (element, valueAccessor) {
        var value = valueAccessor()();
        if(value){
            element = $(element);
            // var other_element = element.find(".custom_modal_body");
            var last_element = element.find(".dish_modal_body");
            // other_element.css("bottom","initial");
            var max_height = last_element.height();
            if(max_height < 75){
                max_height = 75;
            }
            if(max_height > 100){
                console.log("Big")
            }
            element.css("min-height",max_height + "px");
            // other_element.css("bottom","0px");
        }
    }
};

ko.bindingHandlers.menuImage = {
    update: function (element, valueAccessor) {
        // console.log("menuImaged");
        if(ko['menuVisible'] === undefined){
            ko['menuVisible'] = ko.observable(false);
        }
        var underlyingObservable = valueAccessor();
        if(ko.menuVisible()){
            element.setAttribute('src', underlyingObservable());
        } else {
            element.setAttribute('src', "");
        }
    }
}; 

ko.bindingHandlers.modalImage = {
    update: function (element, valueAccessor, allBindings, bindingContext) {
        var visible = valueAccessor();
        if(bindingContext.modalVisible()){
            element.setAttribute('src', valueAccessor()());
        } else {
            element.setAttribute('src', "");
        }
    }
}; 

// var optionsList = ko.observableArray([]);

if(odesk_id === undefined){
    var odesk_id = null;
}

var editing_mode = true;
var lang;
function MenuViewModel() {
    var self = this;
    self.newDomCounter = 0;
    self.preview = ko.observable(false);
    self.restaurant = ko.observable(new Restaurant(resto_data));    
    self.languages = self.restaurant().languages;
    self.lang = ko.observable(self.restaurant().default_language() ? self.restaurant().default_language() : 'en');
    lang = self.lang;
    var skip_warning = false;
    
    self.menus = ko.observableArray([]);
    // Make sure there is at least one menu. If not, create one.
    if(resto_data.menus && resto_data.menus.length > 0){
        self.menus($.map(resto_data.menus, function(item) { return new Menu(item, self) }));
    } else {
        var m = new Menu({name:{'en':'Menu','fr':'La Carte'},default_menu:true,menu:[]},self);
        self.menus.push(m);
    }
    self.current_menu = ko.observable(self.menus()[0]);

    self.current_menu_edit = ko.observable();

    self.current_menu.subscribe(function(next_menu) {
        if(self.current_menu()){
            self.current_menu().current_dish(null);
        }
        if (self.current_menu()){
            self.current_menu().current_section(null);
        }
        self.current_menu_edit(next_menu);
        $("body").animate({scrollTop:0}, '100', 'swing');
    });

    self.menu_default = function(new_default){
        _.each(self.menus(),function(menu){
            if(menu.default_menu != new_default){
                menu.default_menu(false);
            }
        });            
    };

    self.show_lang = ko.computed(function(){
        if(self.languages().length > 1){
            return true;
        } else {
            return false;
        }
    });
  
    self.togglePreview = function(){
        self.preview(!self.preview());
    }

    self.previewText = ko.computed(function(){
        if(self.preview()){
            return "Web Preview"
        } else {
            return "iPhone Preview"
        }
    });

    self.add_menu = function(){
        var new_menu = new Menu({name:{'en':'New Menu','fr':'Nouvelle Carte'},default_menu:false,menu:[]},self);
        self.menus.push(new_menu);
        self.current_menu(new_menu);
    }

    self.saving = ko.observableArray([]);
    self.saving_monitor = ko.computed({
        read: function(){
            if(self.saving().length == 0){
                return false;
            } else {
                return true;
            }
        }
    });

    $(window).on('beforeunload', function () {
        if(self.saving_monitor()){
            return "Please wait for the menu to save!\nYou can see when it is done by the indicator next to the publish button.";            
        }
    });     

    self.publishMenu = function() {
        if(self.saving_monitor()){
            alert("Please wait until the menu has been saved. You'll see the saving indicator next to the publish button.");
            return;
        }
        bootbox.dialog({
            message: "Are you sure you want to publish your changes to the menu? The changes will be immediately visible to the world.",
            title: "Publish Menu",
            buttons: {
                success: {
                    label: "Cancel",
                    className: "btn-default pull-left col-xs-5",
                    callback: function() {

                    }
                },
                danger: {
                    label: "Publish",
                    className: "btn-success col-xs-5 pull-right",
                    callback: function() {

                        var spinner = new Spinner(opts).spin(document.getElementById('center')); 
                        $('#loading').fadeIn();

                        $.ajax({
                            type: "POST",
                            url: "/app/administration/publish_menu",
                            data: {
                                restaurant_id: restaurant_id,
                            },
                            success: function(data, textStatus, jqXHR){
                                spinner.stop();
                                $('#loading').fadeOut();
                                bootbox.alert("Menu publishing in progress. Your new menu will soon be visible!");
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                                spinner.stop();
                                $('#loading').fadeOut();
                                bootbox.alert("There was an error publishing the menu.\n" + errorThrown);
                            },
                            dataType: "json"
                        }); 
                    }
                },
            }
        });          
    }     

};

ko.bindingHandlers.fadeVisible = {
    init: function(element, valueAccessor) {
        // Initially set the element to be instantly visible/hidden depending on the value
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
    },
    update: function(element, valueAccessor) {
        // Whenever the value subsequently changes, slowly fade the element in or out
        var value = valueAccessor();
        ko.unwrap(value) ? $(element).fadeIn() : $(element).fadeOut();
    }
};

ko.bindingHandlers.masonry = {
    update: function(element, valueAccessor) {
        var value = valueAccessor();
        var id = value[1].replace(/[^a-z]/g,'');
        value = value[0]();
        if(value && $(element).width() > 768){
            // var w = Number($(element).width());
            // console.log(w);
            $(element).find(".image_section").addClass(id);
            id = "." + id;
            $(element).masonry({
              columnWidth: id,
              itemSelector: id,
            });
        }
    },
};

ko.bindingHandlers.lStaticText = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var text = valueAccessor();
        if(typeof(text) == "function"){
            text = text();
        }
        var interceptor = ko.computed({
            read: function () {
                if(!translations[text]){
                    console.log("WARNING: Missing translation for '"+text+"'");
                    return text;
                }
                return translations[text][lang()];
            },
            deferEvaluation: true                 
        });
        ko.applyBindingsToNode(element, { text: interceptor});
    }
};

function PublicMenuModel() {

    if(!ko["menuVisible"]){
        ko.menuVisible = ko.observable(false);
    }

    if(!ko["reloadMap"]){
        ko.reloadMap = ko.observable(false);
    }    

    var self = this;
    self.loading = ko.observable(true);
    self.newDomCounter = 0;
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

    self.design = new Design(design_data);

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

    self.menu = ko.computed(function(){
        var m;
        _.each(self.menus(),function(menu){
            if(menu.default_menu()){
                m = menu.menu();
            }
        });
        if(m){
            return m;
        }
        if(self.menus().length > 0){
            return self.menus()[0].menu();
        }
    });

    self.computeImage = function(image){
        //console.log(image);
        if(self.design.imgs[image]){
            return "url(" + self.design.imgs[image]() + ")";
        } else {
            return "";
        }
    };        

};

ko.bindingHandlers.jcrop = {
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext){
        var self = this;
        var value = valueAccessor();
        var valueUnwrapped = ko.unwrap(value);

        //console.log(value);
        //console.log(valueUnwrapped);

        var update_cords = function update_crop(coords) {
            viewModel.coordinates = [coords.x,coords.y,coords.w,coords.h];
           //console.log(viewModel.coordinates);
        }

        $(element).attr("src",valueUnwrapped.src());

        $(element).css({
            width: valueUnwrapped.width(),
            height: valueUnwrapped.height(),
        })

        JcropAPI = $(element).data('Jcrop');

        if(JcropAPI != undefined) {
            JcropAPI.destroy();
        }

        $(element).Jcrop({ 
                boxWidth:   450,
                bgColor:    'black',
                bgOpacity:  .4,
                setSelect:  [ 100, 100, 50, 50 ], 
                onChange: update_cords,
                onSelect: update_cords,
            }
        );

    }
};

ko.bindingHandlers.lValue = {
    init: function (element, valueAccessor, allBindingsAccessor) {
    //console.log("DEBUG: lValue firing on: " + element);
    var underlyingObservable = valueAccessor();
    var interceptor = ko.computed({
        read: function () {
            return underlyingObservable()[lang()];
        },

        write: function (newValue) {
            var current = underlyingObservable();
            current[lang()] = newValue;
            underlyingObservable(current);
        },
    });

    var default_value;

    var placeholder = ko.computed(function(){
        if(default_value == null){
            default_value = $(element).attr("placeholder");
        }
        if(lang() != 'en'){
            return fullLanguageName[lang()] + " translation for '" + underlyingObservable()['en'] + "'";
        }
        return default_value;
    });    

    ko.applyBindingsToNode(element, { value: interceptor, valueUpdate: 'afterkeydown'});
    ko.applyBindingsToNode(element, { attr: {placeholder:placeholder} });
  }
};

ko.bindingHandlers.price = {
    init: function (element, valueAccessor, allBindingsAccessor) {
    //console.log("DEBUG: lValue firing on: " + element);
    var underlyingObservable = valueAccessor();
    var interceptor = ko.computed({
        read: function () {
            return underlyingObservable();
        },
        write: function (newvalue) {
            var current = underlyingObservable();
            current = newvalue.replace(/[^0-9\.]/g,'');
            current = current.replace(/([0-9]*\.[0-9]*).*/,function(match,$1){ return $1 });
            // current = parseFloat(current).toFixed(2);
            underlyingObservable(current);
            underlyingObservable.notifySubscribers();
        },
    }).extend({ notify: 'always' });
    ko.applyBindingsToNode(element, { value: interceptor, valueUpdate: 'afterkeydown'});
  }
};

ko.bindingHandlers.lText = {
    update: function (element, valueAccessor) {
        //console.log("DEBUG: lText firing on: " + element);        
        var value = valueAccessor();
        var result = ko.observable(value()[lang()]);
        ko.bindingHandlers.text.update(element, result);
        
        // $(element).fadeOut(250, function() {
        //     ko.bindingHandlers.text.update(element, result);
        //     $(element).fadeIn(250);
        // });        
    }
}; 

ko.bindingHandlers.lVisible = {
    update: function (element, valueAccessor) {      
        var value = valueAccessor();
        value = value()[lang()];
        var isCurrentlyVisible = !(element.style.display == "none");
        if (value && !isCurrentlyVisible)
            element.style.display = "";
        else if ((!value) && isCurrentlyVisible)
            element.style.display = "none";
    }
}; 

ko.bindingHandlers.lHtml = {
    update: function (element, valueAccessor) {
        //console.log("DEBUG: lHtml firing on: " + element);
        var value = valueAccessor();
        var result = value()[lang()]
        if(result){
            result = result.replace(/noscript/g,'script');
        } else {
            result = "";
        }
        result = ko.observable(result);
        ko.utils.setHtml(element, result);     
    }
};   

ko.virtualElements.allowedBindings.lText = true; 

function DemoViewModel() {
    // Data
    var self = this;
    self.dish = new Dish(dish_demo_json,self);
    self.showModal = function(image) {
        //console.log("#"+image.id());
        $("#"+image.id()).modal("show");
    };     
}

Option.prototype.toJSON = function() {
    var copy = ko.toJS(this,["dish","multiple_prices","sizes_object_names","lName","computed_price","maxSelectionsMet","min_selection_list","max_selection_list"]); //easy way to get a clean copy
    return copy; //return the copy to be serialized
};

IndividualOption.prototype.toJSON = function() {
    var copy = ko.toJS(this,['dish','option','type','size_prices_to_remove',"clickable","computed_price"]); //easy way to get a clean copy
    return copy; //return the copy to be serialized
};

var test_results;
var test2_results;
var len = 50;

function test1(len){
    len = len || 1500;
    var start = new Date().getTime();
    for(var i=0;i<len;i++){
        test_results = ko.toJSON(viewmodel.menu);
    }
    var end = new Date().getTime();
    var time = end - start;
    time = time/len;
    console.log('Test1 Execution time: ' + time);    
}

function test2(len){
    len = len || 1500;  
    var start = new Date().getTime();
    for(var i=0;i<len;i++){
        test2_results = JSON.stringify(viewmodel.menu());
    }
    var end = new Date().getTime();
    var time = end - start;
    time = time/len;
    console.log('Test2 Execution time: ' + time + "\nTest Passed: " + (test_results == test2_results)); 
}

function test(lens){
    len = lens || len;
    console.log("Starting test.");
    test1(len);
    test2(len);
}
