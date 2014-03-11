/*
*= require jquery.Jcrop.min.js
*/

//<![CDATA[ 

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

function updateFilters() {
    // Only allow prices in any price field.
    $(".price_filter").removeAttr("keypress");
    $('.price_filter').keypress(function(eve) {
       if (( eve.which != 46 || $(this).val().indexOf('.') != -1 ) && ( eve.which <  48 || eve.which > 57 ) || ( $(this).val().indexOf('.') == 0)){
           eve.preventDefault();
       }
    });         
} 


Section.prototype.toJSON = function() {
    var copy = ko.toJS(this); //easy way to get a clean copy
    delete copy.topmodel;
    return copy; //return the copy to be serialized
};  

function Section(data,topmodel) {

    var self = this;
    self.topmodel = topmodel;
    if(data._id){
        self.id = data._id;
    } else {
        if(editing_mode){
            $.ajax({
              type: "POST",
              url: "/app/menucrud/create_section",
              data: {
                restaurant_id: restaurant_id,
              },
              success: function(data, textStatus, jqXHR){
                    console.log("Section Saved.");
                    self.id = data.id;          
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
        self.dishes = ko.observableArray($.map(data.dishes, function(item) { return new Dish(item) }));     
    }

    if(data.dom_id){
        self.dom_id = data.dom_id;
    } else {
        self.dom_id = "";
    } 

    self.computed_name = ko.computed(function(){
        if(self.name() == ""){
            return "New Section";
        } else {
            return self.name();
        }
    })

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
        console.log("Section Editing! " + self.editing_name());
        self.editing_name(true);
        console.log("Section Editing! " + self.editing_name());     
    }; 

    self.remove = function(item) {
        bootbox.dialog({
          message: "Are you sure you want to remove the dish titled \"" + item.name() + "\"?",
          title: "Remove Dish",
          buttons: {
            success: {
              label: "No",
              className: "btn-primary pull-left col-xs-3",
              callback: function() {

              }
            },
            danger: {
              label: "Yes",
              className: "btn-danger col-xs-3 pull-right",
              callback: function() {
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
        var new_dish = new Dish({name:""});
        self.dishes.unshift(new_dish);
        self.topmodel.current_section(null);
        self.topmodel.current_dish(new_dish);
        updateFilters();
    }   

}

function Image(data) {
    var self = this;
    self.progressValue = ko.observable(1);
    self.filename = ko.observable("");
    self.id = ko.observable("");
    self.url = ko.observable("/loader.gif");
    self.original = ko.observable("/loader.gif");
    self.completed = ko.observable(false);
    self.image_width = ko.observable(0);
    self.image_height = ko.observable(0);
    self.coordinates = [];
    self.failed = ko.observable(false);

    if(data){
        if(data.local_file){
            self.id(data._id);
            self.url = ko.observable(data.local_file);
            self.completed(true);
            self.original = ko.observable(data.original);
            self.image_width = ko.observable(data.width);
            self.image_height = ko.observable(data.height);            
        }  
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

    self.update_info = function(item){
        self.url(item.thumbnailUrl);
        self.completed(true);
        self.id(item.image_id);
        self.original(item.original);
        self.image_width = ko.observable(item.width);
        self.image_height = ko.observable(item.height); 
    }
}

ko.bindingHandlers.file_upload = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var self = this;
        self.imageModel;
        $(element).fileupload({
            formData: {restaurant_id: restaurant_id},
            url: image_upload_url,
            dataType: 'json',
            progressInterval: 50,
            send: function (e, data) {
                $.each(data.files, function (index, file) {
                    self.imageModel = viewModel.addImage();
                    console.log(self.imageModel);
                    self.imageModel.filename(file.name);
                });                
            },
            done: function (e, data) {
                var file = data.result.files[0];
                self.imageModel.update_info(file);                
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                self.imageModel.progressValue(progress);
            },
            fail: function (e, data) {
                self.imageModel.failed(true);
            },      
        });
    }
};

ko.bindingHandlers.file_upload_icon = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var self = this;
        self.imageModel;
        $(element).fileupload({
            formData: {restaurant_id: restaurant_id},
            url: icon_upload_url,
            dataType: 'json',
            progressInterval: 50,
            send: function (e, data) {
                $.each(data.files, function (index, file) {
                    self.imageModel = viewModel.addImage();
                    console.log(self.imageModel);
                    self.imageModel.filename(file.name);
                });                
            },
            done: function (e, data) {
                var file = data.result.files[0];
                self.imageModel.update_info(file);                               
            },
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                self.imageModel.progressValue(progress);
            },
            fail: function (e, data) {
                self.imageModel.failed(true);
            },                       
        });
    }
};

function Dish(data) {
    var self = this;
    self.name = ko.observable(data.name);  
    self.description = ko.observable(data.description);
    self.price = ko.observable(data.price);
    self.images = ko.observableArray([]);
    self.sizeSelectedOptionValue = ko.observable();

    self.computed_name = ko.computed(function(){
        if(self.name() == ""){
            return "New Dish";
        } else {
            return self.name();
        }
    })

    if(data._id){
        self.id = data._id;
    } else {
        if(editing_mode){
            $.ajax({
              type: "POST",
              url: "/app/menucrud/create_dish",
              data: {
                restaurant_id: restaurant_id,
              },
              success: function(data, textStatus, jqXHR){
                    console.log("Section Saved.");
                    self.id = data.id;          
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    console.log("There was an error saving the section " + errorThrown);
                },
                dataType: "json"
            });
        }
    }

    if(data.has_multiple_sizes){
        self.sizes = ko.observable(true);
        console.log("data size:");
        console.log(data.sizes);
        self.sizes_object = ko.observable(new Option(data.sizes,self));
    } else {
        self.sizes = ko.observable(false);
        console.log("no data sizes");
        self.sizes_object = ko.observable(new Option({type:"size",name:"Sizes",individual_options:[{name:"Small",price:'0.0'},{name:"Large",price:'0.0'}]},self));
    }

    self.sizeSelectedOptionValue = ko.observable(self.sizes_object().individual_options()[0]);
    console.log("Hey guy: " + ko.toJSON(self.sizeSelectedOptionValue()));    

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
            console.log("dish object -> " + plus_price + "\n" + cost + "\n---");
            cost = cost + plus_price;
            console.log("new price: " + cost);
        });
        cost = cost * self.quantity();
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
            return "/app/public/icon@2x.png";
        }
    }, self);  

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
        self.options.push(new Option({type:"generic",placeholder:"Type the option group title here.",individual_options:[{placeholder:"Type the first option title here.",price:'0.0'},{placeholder:"Type the second option title here.",price:'0.0'}]},self));
        updateFilters();
    };

    self.addImage = function(item) { 
        var new_image = new Image(item);
        self.images.unshift(new_image);
        return new_image;
    };    

    // Which option template to use.
    self.remove = function(item) {
        bootbox.dialog({
          message: "Are you sure you want to remove the option titled \"" + item.name() + "\"?",
          title: "Remove Option",
          buttons: {
            success: {
              label: "No",
              className: "btn-primary pull-left col-xs-3",
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

}

Option.prototype.toJSON = function() {
    var copy = ko.toJS(this); //easy way to get a clean copy
    delete copy.dish; //remove an extra property
    delete copy.multiple_prices; 
    delete copy.sizes_object_names; 
    return copy; //return the copy to be serialized
};

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

    if(data._id){
        self.id = data._id;
        if(data.extra_cost){
            self.extra_cost(data.extra_cost);
        }
    } else {
        if(editing_mode){
            $.ajax({
              type: "POST",
              url: "/app/menucrud/create_option",
              data: {
                restaurant_id: restaurant_id,
              },
              success: function(data, textStatus, jqXHR){
                    console.log("Option Saved.");
                    self.id = data.id;          
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    console.log("There was an error saving the option " + errorThrown);
                },
                dataType: "json"
            });
        }
    }

    self.type = data.type; 
    self.max_selections = ko.observable();
    self.min_selections = ko.observable();  
    self.multiple_prices = self.dish.sizes;

    if(data.type != "size"){
        // This is the list of size options if this happens to be the size option version of this model.
        self.sizes_object_names = dish.sizes_object().individual_options;
    }

    self.individual_options = ko.observableArray([]);
    if(data.individual_options){
        self.individual_options = ko.observableArray($.map(data.individual_options, function(item) { return new IndividualOption(item,self)})); 
    }

    self.selectedOptionValue = ko.observableArray([]);    

    self.computed_price = ko.computed(function(){
        var cost = 0;
        if(self.extra_cost) {
            _.each(self.selectedOptionValue(),function(e){
                console.log(e);
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
        self.individual_options.push(new IndividualOption({name:"New Size",price:'0.0'},self));
        updateFilters();        
    }

    // Which option template to use.
    self.addOption = function() {
        self.individual_options.push(new IndividualOption({name:"New Option",price:'0.0'},self));
        updateFilters();
    }   

    // Which option template to use.
    self.remove = function(item) {
        bootbox.dialog({
          message: "Are you sure you want to remove the size option titled \"" + item.name() + "\"?",
          title: "Remove Size Option",
          buttons: {
            success: {
              label: "No",
              className: "btn-primary pull-left col-xs-3",
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

}

function SizePrices(data) {
    var self = this;
    self.name = data.name;  
    self.ind_opt = data.ind_opt;
    self.size_ind_opt = data.size_ind_opt;
    self.size_ind_opt_id = data.size_ind_opt._id;
    self.price = ko.observable(data.price);
    self.e_price = ko.observable(false);  

    self.edit_price_size = function() { 
        self.e_price(true);     
    };  

    self.remove_self = function(){
        bootbox.dialog({
          message: "Are you sure you want to remove the suboption titled \"" + item.name() + "\"?",
          title: "Remove Suboption",
          buttons: {
            success: {
              label: "No",
              className: "btn-primary pull-left col-xs-3",
              callback: function() {

              }
            },
            danger: {
              label: "Yes",
              className: "btn-danger col-xs-3 pull-right",
              callback: function() {
                self.ind_opt.remove_size_option(self);
              }
            },
          }
        });        
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
    if(data._id){
        self.id = data._id;
    } else {
        if(editing_mode){
            $.ajax({
              type: "POST",
              url: "/app/menucrud/create_individual_option",
              data: {
                restaurant_id: restaurant_id,
              },
              success: function(data, textStatus, jqXHR){
                    console.log("Individual Option Saved.");
                    self.id = data.id;          
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    console.log("There was an error saving the individual option " + errorThrown);
                },
                dataType: "json"
            });
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
            if(_.find(self.option.sizes_object_names(),function(i){return i.name() == e.name})){
                var found_object = _.find(self.option.sizes_object_names(),function(i){ return i.name() == e.name});
                var new_size_prices = new SizePrices({name:found_object.name,price:e.price,ind_opt:self,size_ind_opt:found_object});
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
                self.new_size_prices = new SizePrices({name:e.name,price:0.0,ind_opt:self,size_ind_opt:e});
                self.size_prices.push(self.new_size_prices);
                e.size_prices_to_remove.push(self.new_size_prices);
            } 
        });

        self.option.sizes_object_names.subscribe(function (newValue) {
                _.each(self.option.sizes_object_names(),function(e){
                    if(_.find(self.size_prices(),function(i){ return i.size_ind_opt == e}) === undefined){
                        self.new_size_prices = new SizePrices({name:e.name,price:0.0,ind_opt:self,size_ind_opt:e});
                        self.size_prices.push(self.new_size_prices);
                        e.size_prices_to_remove.push(self.new_size_prices);
                    } 
                });
        }, self);

        self.computed_price = ko.computed(function(){
            console.log("self.computed_price -> " + self.dish.sizes());
            if(self.dish.sizes()){
                if(self.price_according_to_size()){
                    var p = _.find(self.size_prices(),function(i){ return i.name() == self.dish.sizeSelectedOptionValue().name()});
                    console.log(p);   
                    return p.price();
                } else {
                    console.log(self.name() + " <--");
                    return self.price();
                }
            }
            return 0;
        });

    }

    self.remove_size_option = function(item) {      
        self.size_prices.remove(item);      
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
}

function Restaurant(data) {
    var self = this;
    self.name = ko.observable(data.name);
    self.lat = ko.observable(data.lat);
    self.lon = ko.observable(data.lon);
    self.id = data._id;
    self.phone = ko.observable("450-458-0123");
    self.address = ko.observable("45 Creme Brule");

    self.image = ko.observable(new Image({local_file:"/assets/help.jpg"}));

    if(data.images && data.images[0]) {
        console.log(data.images[0]);
        self.image(new Image(data.images[0]));                
    }    
}

var editing_mode = true;

function MenuViewModel() {
    // Data
    var self = this;
    self.menu = ko.observableArray([]);
    self.newDomCounter = 0;
    self.preview = ko.observable(true);

    self.restaurant = ko.observable(new Restaurant(resto_data));

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

    self.menu($.map(menu_data.menu, function(item) { return new Section(item,self) }));
    $(".tooltipclass").tooltip({delay: { show: 500, hide: 100 }});
    updateFilters();

    self.current_dish = ko.observable();
    self.current_section = ko.observable();

    self.set_dish = function(dish) {
        self.current_section(null);
        self.current_dish(dish);
    };

    self.set_section = function(section) {
        self.current_dish(null);
        self.current_section(section);
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
        var new_section = new Section({name:"",subsection:[],dom_id:self.newDomCounter},self);
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

    self.saveMenu = function() {
        bootbox.dialog({
          message: "Are you sure you want to publish your changes to the menu? The changes will be immediately visible to the world.",
          title: "Publish Menu",
          buttons: {
            success: {
              label: "No, continue editing.",
              className: "btn-primary pull-left col-xs-5",
              callback: function() {

              }
            },
            danger: {
              label: "Yes, publish changes.",
              className: "btn-danger col-xs-5 pull-right",
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
                        // updateFilters();
                        spinner.stop();
                        $('#loading').fadeOut();
                        bootbox.alert("Menu Publish!");
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

    self.remove = function(item) {
        bootbox.dialog({
          message: "Are you sure you want to remove the section titled \"" + item.name() + "\"?",
          title: "Remove Section",
          buttons: {
            success: {
              label: "No",
              className: "btn-primary pull-left col-xs-3",
              callback: function() {

              }
            },
            danger: {
              label: "Yes",
              className: "btn-danger col-xs-3 pull-right",
              callback: function() {
                self.menu.remove(item);
              }
            },
          }
        });        
    }

    // Auto Saving
    self.auto_save_previous = ko.toJSON(self.menu);
    self.auto_save = function(){
        console.log("Automatically saving menu.");
        if(self.ajax_counter != 0){
            console.log("Waiting until all ajax calls are processed before saving.");
            return;
        }
        var auto_save_now = ko.toJSON(self.menu);
        if(self.auto_save_previous != auto_save_now){
            $.ajax({
              type: "POST",
              url: "/app/administration/update_menu",
              data: {
                restaurant_id: restaurant_id,
                menu: ko.toJSON(self.menu)
              },
              success: function(data, textStatus, jqXHR){
                    // self.menu($.map(data.menu, function(item) { return new Section(item) }));
                    // $(".tooltipclass").tooltip({delay: { show: 500, hide: 100 }});
                    // updateFilters();
                    // spinner.stop();
                    // $('#loading').fadeOut();
                    console.log("Menu Saved.");
                    self.auto_save_previous = auto_save_now;          
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    // spinner.stop();
                    // $('#loading').fadeOut();
                    console.log("There was an error saving the menu: " + errorThrown);
                },
                dataType: "json"
            });
        }
    }

    self.ajax_counter = 0;

    $(document).ajaxStart(function(){
        self.counter++;
    });

    $(document).ajaxStop(function(){
        self.counter--;
    });    

    if(editing_mode){
        setInterval(self.auto_save,15000);  
        // window.onbeforeunload = function (){
        //   self.auto_save;
        // }                   
    }
};


ko.bindingHandlers.jcrop = {
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext){
        var self = this;
        var value = valueAccessor();
        var valueUnwrapped = ko.unwrap(value);

        console.log(value);
        console.log(valueUnwrapped);

        var update_cords = function update_crop(coords) {
            viewModel.coordinates = [coords.x,coords.y,coords.w,coords.h];
            console.log(viewModel.coordinates);
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

function DemoViewModel() {
    // Data
    var self = this;
    self.dish = new Dish(dish_demo_json);
    self.showModal = function(image) {
        console.log("#"+image.id());
        $("#"+image.id()).modal("show");
    };     
}
//]]>  

