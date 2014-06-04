/*
*= require jquery.Jcrop.min.js
*= require mb.bgndGallery.js
*= require mb.bgndGallery.effects.js
*= require jquery.hashchange.min.js
*= require knockout-sortable.js
*= require loglevel.js
*= require masonry.min.js
*= require restaurant
*/

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
        var result = ko.observable(value()[viewmodel.lang()]);     
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

Section.prototype.toJSON = function() {
    var copy = ko.toJS(this); //easy way to get a clean copy
    delete copy.topmodel;
    return copy; //return the copy to be serialized
};  

function Section(data,topmodel) {

    var self = this;
    self.topmodel = topmodel;
    self.id = ko.observable();
    self.position = ko.observable(data.position ? data.position : 0);

    if(data._id){
        self.id(data._id);
    } else {
        if(editing_mode){
            $.ajax({
              type: "POST",
              url: "/app/menucrud/create_section",
              data: {
                restaurant_id: restaurant_id,
                odesk_id: odesk_id,
              },
              success: function(data, textStatus, jqXHR){
                    console.log("Section Saved.");
                    self.id(data.id);          
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    console.log("There was an error saving the section " + errorThrown);
                },
                dataType: "json"
            });
        }
    }
    self.name = ko.observable(data.name);
    // self.subsections = ko.observableArray($.map(data.subsection, function(item) { return new Subsection(item) }));

    self.dishes = ko.observableArray([]);
    if(data.dishes){
        self.dishes = ko.observableArray($.map(data.dishes, function(item) { return new Dish(item,self) }));     
    }

    // self.dishes.extend({ rateLimit: 500 });
    self.dishes.subscribe(function(newvalue){
        _.each(self.dishes(),function(item,index){
            // console.log(item.name());
            item.position(index);
        });
    });    

    self.printJson = function(){
        console.log(ko.toJSON(self));
    }    

    if(data.dom_id){
        self.dom_id = data.dom_id;
    } else {
        self.dom_id = "";
    } 

    self.computed_name = ko.computed(function(){
        var reso = currentLangName(self.name);
        if(reso['reso'] == ""){
            if(reso['en'] == ""){
                return "New Section";                
            } else {
                return reso['en'];
            }
        } else {
            return reso['reso'];
        }
    });

    self.title_image = ko.computed(function() {
        // if(self.images().length > 0){
        //     return self.images()[0].url
        // } else {
            return "/app/public/icon@2x.png"
        // }
    }, self);        

    self.editing_name = ko.observable(false);
    // Behaviors
    self.edit_name = function() { 
        //console.log("Section Editing! " + self.editing_name());
        self.editing_name(true);
        //console.log("Section Editing! " + self.editing_name());     
    }; 

    self.remove = function(item) {
        bootbox.dialog({
          message: localizeMessage(item.name(),"remove_dish"),
          title: "Remove Dish",
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
                topmodel.current_dish(null);
                self.dishes.remove(item);
              }
            },
          }
        });        
    }

    // Operations
    self.newDishName = ko.observable();
    self.addDish = function() {
        // console.log("Adding Dish");
        var new_dish = new Dish({name:copyDefaultHash(default_language_hash), description:copyDefaultHash(default_language_hash)},self);
        self.dishes.unshift(new_dish);
        self.topmodel.current_section(null);
        self.topmodel.current_dish(new_dish);
    }   

}

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

Dish.prototype.toJSON = function() {
    var copy = ko.toJS(this); //easy way to get a clean copy
    delete copy.topmodel; //remove an extra property
    return copy; //return the copy to be serialized
};

var showOptionsList = ko.observable(false);
var showSizesList = ko.observable(false);
var dishList = ko.observableArray([]);

function Dish(data, topmodel) {
    var self = this;
    self.name = ko.observable(data.name);  
    self.description = ko.observable(data.description);
    self.price = ko.observable(data.price);
    self.topmodel = topmodel;
    self.position = ko.observable(data.position ? data.position : 0);
    self.images = ko.observableArray([]);
    self.sizeSelectedOptionValue = ko.observable();
    self.modalVisible = ko.observable(false);

    self.printJson = function(){
        console.log(ko.toJSON(self));
    }

    self.computed_name = ko.computed(function(){
        var reso = currentLangName(self.name);
        if(reso['reso'] == ""){
            if(reso['en'] == ""){
                return "New Dish";                
            } else {
                return reso['en'];
            }
        } else {
            return reso['reso'];
        }
    });

    self.id = ko.observable();

    if(data._id){
        self.id(data._id);
    } else {
        if(editing_mode){
            $.ajax({
              type: "POST",
              url: "/app/menucrud/create_dish",
              data: {
                restaurant_id: restaurant_id,
                odesk_id: odesk_id,
              },
              success: function(data, textStatus, jqXHR){
                    console.log("Dish Saved.");
                    self.id(data.id);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    console.log("There was an error saving the section " + errorThrown);
                },
                dataType: "json"
            });
        }
    }

    if(data.has_multiple_sizes && data.sizes){
        self.sizes = ko.observable(true);
        //console.log("data size:");
        //console.log(data.sizes);
        self.sizes_object = ko.observable(new Option(data.sizes,self));
    } else {
        self.sizes = ko.observable(false);
        //console.log("no data sizes");
        if(data.sizes){
            self.sizes_object = ko.observable(new Option(data.sizes,self));
        } else {
            self.sizes_object = ko.observable(new Option({type:"size",name:copyDefaultHash(default_sizes_hash),individual_options:[{name:copyDefaultHash(default_sizes_hash_small),price:'0.0'},{name:copyDefaultHash(default_sizes_hash_large),price:'0.0'}]},self));            
        }
    }

    self.sizeSelectedOptionValue = ko.observable(self.sizes_object().individual_options()[0]);  

    self.options = ko.observableArray([]);
    if(data.options){
        self.options = ko.observableArray($.map(data.options, function(item) { return new Option(item,self) }));        
    }

    if(data.image) {
        self.images = ko.observableArray($.map(data.image, function(item) { return new Image(item) }));                
    }

    self.quantity = ko.observable(1);

    self.computed_price = ko.computed(function() {
        var cost;
        if(self.sizes()){
            cost = parseFloat(self.sizeSelectedOptionValue().price());
        } else {
            cost = parseFloat(self.price());
        }
        _.each(self.options(),function(e){
            var plus_price = parseFloat(e.computed_price());
            // console.log("dish object -> " + plus_price + "\n" + cost + "\n---");
            cost = cost + plus_price;
            // console.log("new price: " + cost);
        });
        cost = cost * self.quantity();
        if(isNaN(cost)){
            return (0).toFixed(2);
        }
        return parseFloat(cost).toFixed(2);
    }, self);

    self.title_image = ko.computed(function() {
        if(self.images().length > 0){
            return self.images()[0].url();
        } else {
            return "/app/public/icon@2x.png";
        }
    }, self);  

    self.large_title_image = ko.computed(function() {
        if(self.images().length > 0){
            return self.images()[0].original();
        } else {
            return false;
        }
    }, self);  

    self.lazyLoadImage = ko.computed(function(){
        if(self.images().length > 0){
            return self.images()[0].original();
        } else {
            return "";
        }
    });

    self.lazyLoadMediumImage = ko.computed(function(){
        if(self.images().length > 0){
            return self.images()[0].medium();
        } else {
            return "";
        }
    });    

    self.addQuantity = function(){
        if(self.quantity() == 12){
            return;
        } else {
            self.quantity(self.quantity() + 1);
        }            
    }    

    self.subQuantity = function(){
        if(self.quantity() == 1){
            return;
        } else {
            self.quantity(self.quantity() - 1);
        }            
    }      

    self.editing = ko.observable(false);
    // Behaviors
    self.edit = function() { 
        console.log("Editing "+self.name()+"!");
        self.editing(true) 
    };

    self.editing_name = ko.observable(false);
    // Behaviors
    self.edit_name = function() { 
        console.log("Editing_name!");
        self.editing_name(true) 
    };

    // Which option template to use.
    self.templateToUse = function(item) {
        if(item.type == "size"){
            return 'size';
        } else {
            return 'default';
        }
    }

    self.addOption = function() { 
        console.log("Adding option!");
        self.options.push(new Option({name:copyDefaultHash(default_language_hash), type:"generic",placeholder:"Type the option group title here.",individual_options:[{placeholder:"Type the first option title here.",price:'0.0',name:copyDefaultHash(default_language_hash)},{placeholder:"Type the second option title here.",price:'0.0', name: copyDefaultHash(default_language_hash)}]},self));
    };

    self.copyOption = function(){
        showOptionsList(true);
    }

    self.copySize = function(){
        showSizesList(true);
    }    

    self.addImage = function(item) { 
        var new_image = new Image(item);
        self.images.unshift(new_image);
        return new_image;
    };  

    self.removeImage = function(item) { 
        bootbox.dialog({
          message: localizeMessage(null,"remove_image"),
          title: "Remove Image",
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
                self.images.remove(item);
              }
            },
          }
        });        
    };      

    // Which option template to use.
    self.remove = function(item) {
        bootbox.dialog({
          message: "Are you sure you want to remove the option titled \"" + item.name() + "\"?",
          title: "Remove Option",
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
                self.options.remove(item);
              }
            },
          }
        });
    }

    self.triggerImageSelect = function(index){
        $('#image_upload' + index).click();
    }

    self.computedWidth = ko.computed(function(){
        var modal_width = 0;
        if(self.large_title_image()){
            modal_width += 40;
        }
        if(self.sizes() || self.description()[lang()]){
            modal_width += 40;
        }
        if(modal_width > 0){
            return modal_width + "%";
        } else {
            return "400px";
        }
    });

    self.computedHeight = ko.computed(function(){
        // var modal_width = 0;
        if(self.large_title_image()){
            // modal_width += 40;
            return '80%';
        }
        return '40%';
        // if(self.sizes() || self.description()[lang()]){
        //     modal_width += 40;
        // }
        // if(modal_width > 0){
        //     return "80%";
        // }
    });   

    self.modalImageWidth = ko.computed(function(){
        if(!self.sizes() && !self.description()[lang()]){
            return "dish_full";
        } else {
            return "dish_half";
        }
    }); 

    self.modalDescriptionWidth = ko.computed(function(){
        if(!self.large_title_image()){
            return "dish_full";
        } else {
            return "dish_half";
        }
    });

    self.noContent = ko.computed(function(){
        if(!self.sizes() && !self.description()[lang()] && !self.large_title_image()){
            return true;
        }
        return false;
    }); 

    self.lName = ko.computed({
        read: function(){
            return self.name()[lang()];
        },
        deferEvaluation: true,
    });                     

    dishList.push(self);

}

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

Option.prototype.toJSON = function() {
    var copy = ko.toJS(this); //easy way to get a clean copy
    delete copy.dish; //remove an extra property
    delete copy.multiple_prices; 
    delete copy.sizes_object_names; 
    return copy; //return the copy to be serialized
};

// var optionsList = ko.observableArray([]);

function Option(data,dish) {
    var self = this;
    self.name = ko.observable(data.name);
    self.dish = dish;
    self.advanced = ko.observable(false);  
    self.extra_cost = ko.observable(false); 
    self.placeholder = ko.observable("Type the option title here.");

    if(data.placeholder){
        self.placeholder(data.placeholder);
    }

    self.id = ko.observable();

    self.getId = function(){
        $.ajax({
          type: "POST",
          url: "/app/menucrud/create_option",
          data: {
            restaurant_id: restaurant_id,
            odesk_id: odesk_id,
          },
          success: function(data, textStatus, jqXHR){
                console.log("Option Saved.");
                self.id(data.id);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                console.log("There was an error saving the option " + errorThrown);
            },
            dataType: "json"
        });        
    }

    var id_tmp = data._id || data.id
    if(id_tmp){
        self.id(id_tmp);
        self.advanced(data.advanced);
        if(data.extra_cost){
            self.extra_cost(data.extra_cost);
        }
    } else {
        if(editing_mode){
            self.getId();
        }
    }

    self.type = data.type; 
    self.max_selections = ko.observable(data.max_selections ? data.max_selections : 0);
    self.min_selections = ko.observable(data.min_selections ? data.min_selections : 0);  
    self.multiple_prices = self.dish.sizes;

    if(data.type != "size"){
        // This is the list of size options if this happens to be the size option version of this model.
        self.sizes_object_names = ko.computed({
                                            read: function(){
                                                return dish.sizes_object().individual_options();
                                            },
                                            deferEvaluation: true,
                                        });   
    }

    self.individual_options = ko.observableArray([]);
    if(data.individual_options){
        self.individual_options = ko.observableArray($.map(data.individual_options, function(item) { return new IndividualOption(item,self)})); 
    }

    self.max_selection_list = ko.computed(function(){
        var list = [];
        _.each(self.individual_options(),function(item, index){ list.push(index + 1) });
        return list;
    });

    self.min_selection_list = ko.computed(function(){
        var list = [];
        _.each(self.individual_options(),function(item, index){ list.push(index) });
        return list;
    });    

    self.selectedOptionValue = ko.observableArray([]);
  
    self.maxSelectionsMet = ko.computed(function(){
        if(self.selectedOptionValue().length >= self.max_selections()){
            return true;
        } else {
            return false;
        }
    });

    self.computed_price = ko.computed(function(){
        var cost = 0;
        if(self.extra_cost()) {
            _.each(self.selectedOptionValue(),function(e){
                // console.log(e);
                cost += parseFloat(e.computed_price());
            });
        }
        return cost;
    });



    self.option_title = ko.computed(function(){
        return "Add an option to " + self.dish.name() + ".";
    });    

    self.editing_name = ko.observable(false);
    self.edit_name = function() { 
        self.editing_name(true);    
    };  

    // Which option template to use.
    self.addSize = function() {
        self.individual_options.push(new IndividualOption({name:copyDefaultHash(default_language_hash),placeholder:"Type new size title here.",price:'0.0'},self));        
    }

    // Which option template to use.
    self.addOption = function() {
        self.individual_options.push(new IndividualOption({name:copyDefaultHash(default_language_hash),placeholder:"Type new option title here.",price:'0.0'},self));
    }   

    // Which option template to use.
    self.remove = function(item) {
        bootbox.dialog({
          message: "Are you sure you want to remove the size option titled \"" + item.name()['en'] + "\"?",
          title: "Remove Size Option",
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
                item.remove_size_options();     
                self.individual_options.remove(item);
              }
            },
          }
        });        
    }

    self.toggleAdvanced = function() {
        self.advanced(!self.advanced());
    }

    self.lName = ko.computed({
        read: function(){
            return self.name()[lang()];
        },
        deferEvaluation: true,
    });

}

function SizePrices(data) {
    var self = this;
    self.name = data.name;  
    self.ind_opt = data.ind_opt;
    self.size_ind_opt = data.size_ind_opt;
    self.size_ind_opt_id = data.size_ind_opt._id;
    self.price = ko.observable(data.price);
    self.e_price = ko.observable(false);  
    self.size_id = ko.observable(data.size_id);

    self.edit_price_size = function() { 
        self.e_price(true);     
    };  

    self.remove_self = function(){
        self.ind_opt.remove_size_option(self);
        // bootbox.dialog({
        //   message: "Are you sure you want to remove the suboption titled \"" + self.name()['en'] + "\"?",
        //   title: "Remove Suboption",
        //   buttons: {
        //     success: {
        //       label: "No",
        //       className: "btn-default pull-left col-xs-3",
        //       callback: function() {

        //       }
        //     },
        //     danger: {
        //       label: "Yes",
        //       className: "btn-danger col-xs-3 pull-right",
        //       callback: function() {
        //         self.ind_opt.remove_size_option(self);
        //       }
        //     },
        //   }
        // });        
    }    
}
SizePrices.prototype.toJSON = function() {
    var copy = ko.toJS(this); //easy way to get a clean copy
    delete copy.ind_opt; //remove an extra property
    delete copy.size_ind_opt;    
    return copy; //return the copy to be serialized
};


IndividualOption.prototype.toJSON = function() {
    var copy = ko.toJS(this); //easy way to get a clean copy
    delete copy.option; //remove an extra property
    delete copy.dish; 
    delete copy.type;  
    delete copy.size_prices_to_remove; 
    return copy; //return the copy to be serialized
};
function IndividualOption(data,option) {

    var self = this;
    self.id = ko.observable();

    self.getId = function(){
        $.ajax({
          type: "POST",
          url: "/app/menucrud/create_individual_option",
          data: {
            restaurant_id: restaurant_id,
            odesk_id: odesk_id,
          },
          success: function(data, textStatus, jqXHR){
                console.log("Individual Option Saved.");
                self.id(data.id);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                console.log("There was an error saving the individual option " + errorThrown);
            },
            dataType: "json"
        });
    }

    var tmp_id = data.id || data._id;
    if(tmp_id){
        self.id(tmp_id);
    } else {
        if(editing_mode){
            self.getId();
        }
    }
    self.option = option;
    self.name = ko.observable(data.name);
    self.price = ko.observable(data.price);     
    self.type = option.type;
    self.dish = option.dish;
    self.destroy_it = false;
    self.icon = ko.observable();
    self.size_prices = ko.observableArray([]); 
    self.price_according_to_size = ko.observable(false); 
    self.placeholder = ko.observable("Type the option here.");

    if(data.placeholder){
        self.placeholder(data.placeholder);
    }    

    if(data.icon) {
        self.icon(new Image(data.icon));               
    }  

    if(data.price_according_to_size){
        self.price_according_to_size(data.price_according_to_size);
    }  

    if(data.size_prices && self.type != 'size'){
        _.each(data.size_prices,function(e){
            var found_object = _.find(self.option.sizes_object_names(),function(i){ return i.id() == e.size_id});
            if(found_object){
                var new_size_prices = new SizePrices({name:found_object.name,size_id:found_object.id,price:e.price,ind_opt:self,size_ind_opt:found_object});
                self.size_prices.push(new_size_prices);
            } 
        });        
    }

    // if this is a size version of Options, then we need to remove all SizePrices from all other options. They will be pushed to this array.
    self.size_prices_to_remove = new Array();

    if(self.type != "size"){

        // self.option.size_object is the size version of the options model. It lists the IndividualOptions of each size.
        _.each(self.option.sizes_object_names(),function(e){
            if(_.find(self.size_prices(),function(i){ return i.size_ind_opt == e})===undefined){
                self.new_size_prices = new SizePrices({
                                                        name:e.name,
                                                        size_id:e.id,
                                                        price:0.0,
                                                        ind_opt:self,
                                                        size_ind_opt:e
                                                    });
                self.size_prices.push(self.new_size_prices);
                e.size_prices_to_remove.push(self.new_size_prices);
            } 
        });

        self.option.sizes_object_names.subscribe(function (newValue) {
                _.each(self.option.sizes_object_names(),function(e){
                    if(_.find(self.size_prices(),function(i){ return i.size_ind_opt == e}) === undefined){
                        self.new_size_prices = new SizePrices({
                                                                name:e.name,
                                                                size_id:e.id,
                                                                price:0.0,
                                                                ind_opt:self,
                                                                size_ind_opt:e
                                                            });
                        self.size_prices.push(self.new_size_prices);
                        e.size_prices_to_remove.push(self.new_size_prices);
                    } 
                });
        }, self);

        self.computed_price = ko.computed(function(){
            // console.log("self.computed_price -> " + self.dish.sizes());
            if(self.dish.sizes()){
                if(self.price_according_to_size()){
                    var p = _.find(self.size_prices.peek(),function(i){ return i.size_id()() == self.dish.sizeSelectedOptionValue().id()});
                    //console.log(p);   
                    return p.price();
                } else {
                    //console.log(self.name() + " <--");
                    return self.price();
                }
            }
            return self.price();
        });

    }

    self.remove_size_option = function(item) {      
        self.size_prices.remove(item);      
    };  

    self.dish_modal_full_width = function(length, index){
        return (length % 2) == 1 && index() == (length - 1);  
    };

    self.remove_size_options = function(){
        _.each(self.size_prices_to_remove,function(e){e.remove_self()}); 
    };

    self.editing_name = ko.observable(false);
    self.edit_name = function() { 
        self.editing_name(true);    
    }; 

    self.editing_price = ko.observable(false);
    self.edit_price = function() { 
        self.editing_price(true);   
    }; 

    self.addImage = function(item) { 
        var new_image = new Image(item);
        self.icon(new_image);
        return new_image;
    };  

    self.clickable = ko.computed({
        read: function(){
            if(!self.option.advanced()){
                return false;
            }
            if(self.option.maxSelectionsMet() && !(self.option.selectedOptionValue().indexOf(self) >= 0)){
                return true;
            } else {
                return false;
            }
        },
        deferEvaluation: true,
    });     
}

if(odesk_id === undefined){
    var odesk_id = null;
}

var editing_mode = true;
var lang;
function MenuViewModel() {
    // Data
    var self = this;
    self.current_dish = ko.observable();
    self.current_section = ko.observable();    
    self.menu = ko.observableArray([]);
    self.newDomCounter = 0;
    self.currentOption = ko.observable();
    self.currentDishOptions = ko.observable();
    self.showOptionsList = showOptionsList;
    self.showSizesList = showSizesList;
    self.dishList = ko.computed({
        read: function(){
                    return _.filter(dishList(),function(item){ return item.options().length > 0 });
        }, deferEvaluation: true,
    });
    self.dishSizeList = ko.computed({
        read: function(){
                    return _.filter(dishList(),function(item){ return item.sizes() });
        }, deferEvaluation: true,
    });    
    // self.optionsList = optionsList;
    self.preview = ko.observable(false);
    self.restaurant = ko.observable(new Restaurant(resto_data));    
    self.languages = self.restaurant().languages;
    self.lang = ko.observable('en');
    lang = self.lang;
    var skip_warning = false;

    self.show_lang = ko.computed(function(){
        if(self.languages().length > 1){
            return true;
        } else {
            return false;
        }
    });

    self.closeCopyOption = function(){
        self.currentOption(null);
        self.currentDishOptions(null);
        self.showOptionsList(false);
        self.showSizesList(false);
    };

    self.copyOptionIntoDish = function(item){
        var new_opt = new Option(JSON.parse(ko.toJSON(self.currentOption())),self.current_dish());
        new_opt.getId();
        _.each(new_opt.individual_options(),function(e){e.getId()});
        self.current_dish().options.push(new_opt);
        self.currentOption(null);
        self.currentDishOptions(null);
        self.showOptionsList(false);
    };

    self.copySizeIntoDish = function(item){
        var new_opt = new Option(JSON.parse(ko.toJSON(self.currentOption())),self.current_dish());
        new_opt.getId();
        _.each(new_opt.individual_options(),function(e){e.getId()});
        _.each(self.current_dish().options(),function(opt){
            _.each(opt.individual_options(),function(ind_opt){
                ind_opt.size_prices([]);
            });
        });
        self.current_dish().sizeSelectedOptionValue(new_opt.individual_options()[0]);
        self.current_dish().sizes_object(new_opt);
        self.current_dish().sizes(true);
        self.currentOption(null);
        self.currentDishOptions(null);
        self.showSizesList(false);
    };    

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

    // self.menu.extend({ rateLimit: 500 });
    self.menu.subscribe(function(newvalue){
        _.each(self.menu(),function(item,index){
            console.log(item.name());
            item.position(index);
        });
        console.log("----------------");
    });

    self.menu($.map(menu_data.menu, function(item) { return new Section(item,self) }));
    $(".tooltipclass").tooltip({delay: { show: 500, hide: 100 }});

    self.set_dish = function(dish) {
        self.current_section(null);
        self.current_dish(dish);
        $("body").animate({scrollTop:0}, '100', 'swing');
    };

    self.set_section = function(section) {
        self.current_dish(null);
        self.current_section(section);
        $("body").animate({scrollTop:0}, '100', 'swing');
    };    

    self.current_dish_check = function(dish) {    
        if(dish == self.current_dish()){
            return true;
        } else {
            return false;
        }
    } 

    self.current_section_check = function(section) {    
        if(section == self.current_section()){
            return true;
        } else {
            return false;
        }
    }   

    // Operations
    self.newSectionName = ko.observable();
    self.addSection = function() {
        console.log("Adding Section");
        self.newDomCounter++;
        var new_section = new Section({name:copyDefaultHash(sectionNames),subsection:[],dom_id:self.newDomCounter},self);
        self.menu.push(new_section);
        self.current_section(new_section);
        self.current_dish(null);
        // var target = "#"+self.newDomCounter;
        // $('html').animate({
        //     scrollTop: $(target).offset().top
        // }, 500);
    } 

    self.showModal = function(image) {
        console.log("#"+image.id());
        $("#"+image.id()).modal("show");
    };      

    self.publishMenu = function() {
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
                    menu: ko.toJSON(self.menu)
                  },
                  success: function(data, textStatus, jqXHR){
                        // self.menu($.map(data.menu, function(item) { return new Section(item) }));
                        // $(".tooltipclass").tooltip({delay: { show: 500, hide: 100 }});
                        spinner.stop();
                        $('#loading').fadeOut();
                        bootbox.alert("Menu Published!");
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

    self.discardDraft = function() {
        bootbox.dialog({
          message: "Are you sure you want to discard all your changes? Everything will revert to your last save.",
          title: "Discard Draft",
          buttons: {
            success: {
              label: "Continue Editing",
              className: "btn-default pull-left col-xs-5",
              callback: function() {

              }
            },
            danger: {
              label: "Discard Draft",
              className: "btn-danger col-xs-5 pull-right",
              callback: function() {
                skip_warning = true;
                location.reload();
                // var spinner = new Spinner(opts).spin(document.getElementById('center')); 
                // $('#loading').fadeIn();

                // $.ajax({
                //   type: "POST",
                //   url: "/app/administration/reset_draft_menu",
                //   data: {
                //     restaurant_id: restaurant_id,
                //     menu: ko.toJSON(self.menu)
                //   },
                //   success: function(data, textStatus, jqXHR){
                //         // self.menu($.map(data.menu, function(item) { return new Section(item) }));
                //         // $(".tooltipclass").tooltip({delay: { show: 500, hide: 100 }});
                //         spinner.stop();
                //         $('#loading').fadeOut();
                //         skip_warning = true;
                //         window.location.href = "/app";
                //     },
                //     error: function(XMLHttpRequest, textStatus, errorThrown) { 
                //         spinner.stop();
                //         $('#loading').fadeOut();
                //         bootbox.alert("There was an error publishing the menu.\n" + errorThrown);
                //     },
                //   dataType: "json"
                // }); 
              }
            },
          }
        });          
    }     

    self.for_real_discard = function(){
        $.ajax({
          type: "POST",
          url: "/app/administration/reset_draft_menu",
          data: {
            restaurant_id: restaurant_id,
            menu: ko.toJSON(self.menu)
          },
          success: function(data, textStatus, jqXHR){
                // self.menu($.map(data.menu, function(item) { return new Section(item) }));
                // $(".tooltipclass").tooltip({delay: { show: 500, hide: 100 }});
                skip_warning = true;
                window.location.href = "/app";
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                bootbox.alert("There was an error publishing the menu.\n" + errorThrown);
            },
          dataType: "json"
        });        
    }  

    self.remove = function(item) {
        bootbox.dialog({
          message: localizeMessage(item.name(),"delete_section"),
          title: "Remove Section",
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
                self.menu.remove(item);
                self.current_section(self.menu()[0]);
              }
            },
          }
        });        
    }

    // Auto Saving
    // self.auto_save_previous;
    self.save_menu_modal = ko.observable(false);
    self.preview_token = ko.observable("");
    self.saveDraft = function(){
        var spinner = new Spinner(opts).spin(document.getElementById('center')); 
        $.ajax({
          type: "POST",
          url: "/app/administration/update_menu",
          data: {
            restaurant_id: restaurant_id,
            menu: ko.toJSON(self.menu)
          },
          success: function(data, textStatus, jqXHR){
                spinner.stop();
                self.preview_token(data.preview_token);
                self.save_menu_modal(true);
                skip_warning = true;   
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                console.log("There was an error saving the menu: " + errorThrown);
                spinner.stop();
            },
            dataType: "json"
        });
    }

    self.odesk_save_menu_modal = ko.observable(false);
    self.odeskSaveDraft = function(){
        var spinner = new Spinner(opts).spin(document.getElementById('center')); 
        $.ajax({
          type: "POST",
          url: "/app/odesk/update_menu",
          data: {
            restaurant_id: restaurant_id,
            odesk_id: odesk_id,
            menu: ko.toJSON(self.menu)
          },
          success: function(data, textStatus, jqXHR){
                spinner.stop();
                self.preview_token(data.preview_token);
                self.odesk_save_menu_modal(true);
                skip_warning = true;   
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                console.log("There was an error saving the menu: " + errorThrown);
                spinner.stop();
            },
            dataType: "json"
        });
    }    

    self.odeskMenuComplete = function(){
        var spinner = new Spinner(opts).spin(document.getElementById('center')); 
        $.ajax({
          type: "POST",
          url: "/app/odesk/mark_menu_completed",
          data: {
            odesk_id: odesk_id,
          },
          success: function(data, textStatus, jqXHR){
                spinner.stop();
                self.preview_token(data.preview_token);
                alert("Menu Marked Completed, thank you!")
                skip_warning = true;   
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                console.log("There was an error saving the menu: " + errorThrown);
                spinner.stop();
            },
            dataType: "json"
        });
    }       

    $(window).on('beforeunload', function () {
        if(!skip_warning){
            return "Make sure you've saved your changes!";            
        }
    }); 

    self.firstSectionHelp = ko.computed(function(){
        return self.menu().length == 0
    });

    self.firstSectionNameHelp = ko.computed(function(){
        return self.menu().length == 1 && self.menu()[0].name()['en'] == '' && self.current_section()
    });

    self.firstDishHelp = ko.computed(function(){
        return self.menu().length == 1 && self.menu()[0].dishes().length == 0 && self.menu()[0].name()['en'] != ''
    });

    self.firstDishPreviewHelp = ko.computed(function(){
        return self.menu().length == 1 && self.menu()[0].dishes().length == 1;
    });          

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
                return translations[text][viewmodel.lang()];
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
    self.menu = ko.observableArray([]);
    self.newDomCounter = 0;
    self.preview = ko.observable(true);
    self.restaurant = ko.observable(new Restaurant(resto_data));
    self.languages = self.restaurant().languages; 
    self.lang = ko.observable(self.languages()[0]);
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

    self.menu($.map(menu_data.menu, function(item) { return new Section(item,self) }));

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
            return underlyingObservable()[viewmodel.lang()];
        },

        write: function (newValue) {
            var current = underlyingObservable();
            current[viewmodel.lang()] = newValue;
            underlyingObservable(current);
        },
    });

    var default_value;

    var placeholder = ko.computed(function(){
        if(default_value == null){
            default_value = $(element).attr("placeholder");
        }
        if(viewmodel.lang() != 'en'){
            return fullLanguageName[viewmodel.lang()] + " translation for '" + underlyingObservable()['en'] + "'";
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
        var result = ko.observable(value()[viewmodel.lang()]);
        ko.bindingHandlers.text.update(element, result);
        
        // $(element).fadeOut(250, function() {
        //     ko.bindingHandlers.text.update(element, result);
        //     $(element).fadeIn(250);
        // });        
    }
}; 

ko.bindingHandlers.lHtml = {
    update: function (element, valueAccessor) {
        //console.log("DEBUG: lHtml firing on: " + element);
        var value = valueAccessor();
        var result = ko.observable(value()[viewmodel.lang()].replace(/noscript/g,'script'));
        ko.utils.setHtml(element, result);
        
        // $(element).fadeOut(250, function() {
        //     ko.bindingHandlers.text.update(element, result);
        //     $(element).fadeIn(250);
        // });        
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


