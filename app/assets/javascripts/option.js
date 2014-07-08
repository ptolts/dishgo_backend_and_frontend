Option.prototype.fastJSON = function(){
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

function Option(data,dish) {
    var self = this;
    self.name = ko.observable(data.name ? data.name : copyDefaultHash(default_language_hash));
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

    var id_tmp = data._id || data.id;
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
                item.option = null;
                item.dirty(true);
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

    self.track_saving = function(){
        if(viewmodel){
            viewmodel.saving.push(self);
        };   
    }

    self.stop_track_saving = function(){
        if(viewmodel){
            viewmodel.saving.remove(self);
        };   
    }

    self.dirty = ko.observable(false);
    self.dirtyTrack = ko.computed(function(){
        self.id();
        self.name();
        self.advanced();
        self.extra_cost();
        self.min_selections();
        self.max_selections();
        self.track_saving();
        self.dish.id();
        self.dirty(true);
    });
    self.dirty(false);

    self.update_when_dirty = ko.computed(function(){
        if(!self.dirty()){
            return;
        }
        if(self.id.peek()){
            $.ajax({
              type: "POST",
              url: "/app/menu_update/update_option",
              data: {
                restaurant_id: restaurant_id,
                odesk_id: odesk_id,
                dish_id: self.dish ? self.dish.id.peek() : null,
                data: self.fastJSON(),
                // data: ko.toJSON(self),
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