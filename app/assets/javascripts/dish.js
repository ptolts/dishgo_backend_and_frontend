var showOptionsList = ko.observable(false);
var showSizesList = ko.observable(false);
var dishList = ko.observableArray([]);

Dish.prototype.toJSON = function() {
    var copy = ko.toJS(this,["topmodel","computed_price","sizeSelectedOptionValue","section_list","new_section","sizes_object","options"]); //easy way to get a clean copy
    return copy; //return the copy to be serialized
};

Dish.prototype.fastJSON = function(){
    var fast = {};
    for (var property in this) {
        if (this.hasOwnProperty(property)) {
            var result = this[property];
            while(ko.isObservable(result)){
                result = result.peek();
            }
            if(typeof result == "function"){
                continue;
            }
            if(typeof result == "object"){
                if(result == null){
                    fast[property] = result;
                    continue;
                }                
                if(property == "images"){
                    fast[property] = _.collect(result,function(res){ return res.fastJSON() });
                    continue;
                }                
                if(Array.isArray(result)){
                    continue;
                }
                if(result.fastJSON){
                    continue;
                }
            }         
            fast[property] = result;
        }
    } 
    return JSON.stringify(fast);    
}

function Dish(data, topmodel) {
    var self = this;
    self.name = ko.observable(data.name ? data.name : copyDefaultHash(default_language_hash));
    self.description = ko.observable(data.description ? data.description : copyDefaultHash(default_language_hash));
    self.price = ko.observable(data.price);
    self.topmodel = topmodel;
    self.position = ko.observable(data.position ? data.position : 0);
    self.rating = ko.observable(data.rating ? data.rating : 0);
    self.images = ko.observableArray([]);
    self.sizeSelectedOptionValue = ko.observable();
    self.modalVisible = ko.observable(false);
    self.fullWidth = ko.observable(false);

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
                    console.log("There was an error creating the dish " + errorThrown);
                    var ret = this;
                    retryAjax(ret);
                },
                dataType: "json"
            });
        }
    }

    self.new_section = ko.observable();
    self.moveToSection = function(old_section){
        self.new_section().dishes.push(self);
        self.topmodel.dishes.remove(self);
        self.topmodel = self.new_section();
        self.new_section(null);
    }

    self.section_list = ko.computed({
        read: function(){
            var sectionlist = [];
            self.new_section();
            _.each(viewmodel.current_menu().menu() ,function(section){ 
                                        if(section != self.topmodel){
                                            sectionlist.push(section);
                                        }
                                    }
            );
            return sectionlist;
        },
        deferEvaluation: true,
    });

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
        self.images = ko.observableArray($.map(data.image, function(item) { return new ImageObj(item) }));                
    }

    self.quantity = ko.observable(1);

    self.price_template = ko.computed({
        read: function(){
            if(self.sizes())
                return 'many_prices';
            else
                return 'single_price';
        },
        deferEvaluation: true,
    });

    self.computed_price = ko.computed(function() {
        var cost;
        if(self.sizes()){
            if(self.sizeSelectedOptionValue()){
                cost = parseFloat(self.sizeSelectedOptionValue().price());
            } else {
                console.log("problem in dish.js calculating price");
                cost = 0.0;
            }
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

    self.pretty_price = ko.computed({
        read: function(){
            var final_cost = parseFloat(self.price()).toFixed(2);
            if(final_cost == "0.00"){
                if(translations['ask'][lang()]){
                    return translations['ask'][lang()];
                } else {
                    return 'Ask';
                }
            } else {
                return final_cost;
            }            
        },
        deferEvaluation: true,
    });      

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
        var new_image = new ImageObj(item);
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
                item.dish = null;
                item.dirty(true);
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

    self.track_saving = function(){
        if(viewmodel && viewmodel.saving){
            viewmodel.saving.push(self);
        };   
    }

    self.stop_track_saving = function(){
        if(viewmodel && viewmodel.saving){
            viewmodel.saving.remove(self);
        };   
    }

    // self.dirty = ko.observable(false).extend({ notify: 'always', rateLimit: 5000 });

    self.update_when_dirty = function(){
        if(self.id.peek() && editing_mode){
            $.ajax({
                type: "POST",
                url: "/app/menu_update/update_dish",
                data: {
                    restaurant_id: restaurant_id,
                    odesk_id: odesk_id,
                    section_id: self.topmodel ? self.topmodel.id.peek() : null,
                    // data: ko.toJSON(self),
                    data: self.fastJSON(),
                },
                success: function(data, textStatus, jqXHR){
                    self.stop_track_saving();                         
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    self.stop_track_saving();                                           
                    self.id.valueHasMutated();
                },
                dataType: "json"
            });
        }
    }

    self.dirtyTrack = ko.computed(function(){
        self.id();
        self.name();
        self.description();
        self.price();
        self.sizes();
        self.position();
        _.each(self.images(),function(image){            
            image.id();
        });
        if(self.topmodel){
            self.topmodel.id();
        }
        self.track_saving();
        if(!ko.computedContext.isInitial()){
            self.update_when_dirty();    
        }
    }).extend({ notify: 'always', rateLimit: 5000 });
        
}