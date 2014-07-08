Section.prototype.fastJSON = function(){
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

function Section(data,topmodel) {

    var self = this;
    self.topmodel = topmodel;
    self.id = ko.observable();
    self.position = ko.observable(data.position ? data.position : 0);
    self.menu_link = ko.observable(data.menu_link ? data.menu_link : false);
    self.description = ko.observable(data.description ? data.description : copyDefaultHash(default_language_hash));

    self.toggle_menu_link = function(dis){
        if(dis() && !self.menu_link()){
            return;
        }
        self.menu_link(!self.menu_link());
    }

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
    self.name = ko.observable(data.name ? data.name : copyDefaultHash(default_language_hash));
    // self.subsections = ko.observableArray($.map(data.subsection, function(item) { return new Subsection(item) }));

    self.dishes = ko.observableArray([]);
    if(data.dishes){
        self.dishes = ko.observableArray($.map(data.dishes, function(item) { return new Dish(item,self) }));     
    }

    // self.dishes.extend({ rateLimit: 500 });
    self.dishes.subscribe(function(newvalue){
        _.each(self.dishes(),function(item,index){
            if(item.position() != index){
                item.position(index);
            }
        });
    });    

    self.printJson = function(){
        console.log(ko.toJSON(self.id));
    }    

    if(data.dom_id){
        self.dom_id = data.dom_id;
    } else {
        self.dom_id = "";
    } 

    self.lName = ko.computed({
        read: function(){
            return self.name()[lang()];
        },
        deferEvaluation: true,
    });      

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
                item.topmodel = null;
                item.dirty(true);
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
        self.description(); 
        self.position();
        if(self.topmodel && self.topmodel.id){
            self.topmodel.id();
        }
        self.track_saving();
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
              url: "/app/menu_update/update_section",
              data: {
                restaurant_id: restaurant_id,
                odesk_id: odesk_id,
                menu_id: self.topmodel ? self.topmodel.id.peek() : null,
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

Section.prototype.toJSON = function() {
    var copy = ko.toJS(this,["topmodel","dishes"]); //easy way to get a clean copy
    return copy; //return the copy to be serialized
};  