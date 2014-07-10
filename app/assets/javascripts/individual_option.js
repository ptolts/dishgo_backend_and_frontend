IndividualOption.prototype.fastJSON = function(){
    var fast = {};
    for (var property in this) {
        if (this.hasOwnProperty(property)) {
            var result = this[property];
            while(ko.isObservable(result)){
                result = result();
            }
            if(typeof result == "function"){
                continue;
            }
            if(typeof result == "object"){
                if(property == "size_prices"){
                    fast[property] = ko.toJS(result);
                    continue;
                }                   
                if(result == null){
                    fast[property] = result;
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
    self.name = ko.observable(data.name ? data.name : copyDefaultHash(default_language_hash));
    self.price = ko.observable(data.price);     
    self.type = option.type;
    self.dish = option.dish;
    self.destroy_it = false;
    self.icon = ko.observable();
    self.position = ko.observable(data.position);
    self.size_prices = ko.observableArray([]); 
    self.price_according_to_size = ko.observable(false); 
    self.placeholder = ko.observable("Type the option here.");

    if(data.placeholder){
        self.placeholder(data.placeholder);
    } 

    self.pretty_price = ko.computed({
        read: function(){
            return parseFloat(self.price()).toFixed(2);
        },
        deferEvaluation: true,
    });   

    if(data.icon) {
        self.icon(new ImageObj(data.icon));               
    }  

    if(data.price_according_to_size){
        self.price_according_to_size(data.price_according_to_size);
    }  

    if(data.size_prices && self.type != 'size'){
        _.each(data.size_prices,function(e){
            var found_object = _.find(self.option.sizes_object_names(),function(i){ return i.id() == e.size_id});
            if(found_object){
                var new_size_prices = new SizePrices({name:found_object.name,size_id:found_object.id,price:e.price,ind_opt:self,size_ind_opt:found_object},self);
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
                                                    },self);
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
                                                            },self);
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
                    if(p){   
                        return p.price();
                    } else {
                        return 0.0;
                    }
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
        var new_image = new ImageObj(item);
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

    self.dirty = ko.observable(false);
    self.dirtyTrack = ko.computed(function(){
        self.id();
        self.name();
        self.price();
        self.position();
        self.option.id();
        self.size_prices();
        self.price_according_to_size();
        self.track_saving();
        self.dirty(true);
    });
    self.dirty(false);           

    self.update_when_dirty = ko.computed(function(){
        if(!self.dirty()){
            return;
        }
        if(self.id.peek() && editing_mode){
            $.ajax({
              type: "POST",
              url: "/app/menu_update/update_individual_option",
              data: {
                restaurant_id: restaurant_id,
                odesk_id: odesk_id,
                option_id: self.option ? self.option.id.peek() : null,
                // data: ko.toJSON(self),
                data: self.fastJSON(),
              },
              success: function(data, textStatus, jqXHR){
                    console.log("Dirty saved");
                    self.stop_track_saving();                    
                    self.dirty(false);         
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    self.stop_track_saving();                    
                    self.dirty(true);
                },
                dataType: "json"
            });
        }
    }).extend({ rateLimit: { timeout: 5000, method: "notifyWhenChangesStop" } });
}