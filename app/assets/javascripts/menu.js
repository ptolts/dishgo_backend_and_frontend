Menu.prototype.fastJSON = function(){
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

function Menu(data, topmodel) {
	var self = this;
    self.id = ko.observable(data.id);
    self.name = ko.observable(data.name ? data.name : copyDefaultHash(default_language_hash));
    self.current_dish = ko.observable();
    self.current_section = ko.observable();  
    self.default_menu = ko.observable(data.default_menu ? data.default_menu : false);  
    self.currentOption = ko.observable();
    self.currentDishOptions = ko.observable();
    self.showOptionsList = showOptionsList;
    self.showSizesList = showSizesList;
    self.menu = ko.observableArray([]);
    self.topmodel = topmodel;

    self.default_menu.subscribe(function(){
    	if(self.default_menu()){
	    	if(self.topmodel){
	    		self.topmodel.menu_default(self.default_menu);
	    	}
	    }
    });

    self.menu_id = ko.computed({
    	read: function(){
    		return self.name()[lang()].replace(/\s/,"_");
    	},
    	deferEvaluation: true
    });

    if(data._id){
        self.id(data._id);
    } else {
        if(editing_mode){
            $.ajax({
              type: "POST",
              url: "/app/menucrud/create_menu",
              data: {
                restaurant_id: restaurant_id,
                odesk_id: odesk_id,
              },
              success: function(data, textStatus, jqXHR){
                    console.log("ID Fetched.");
                    self.id(data.id);          
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    console.log("There was an error saving the section " + errorThrown);
                },
                dataType: "json"
            });
        }
    }    

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

	self.closeCopyOption = function(){
		self.currentOption(null);
		self.currentDishOptions(null);
		self.showOptionsList(false);
		self.showSizesList(false);
	};

	self.copyOptionIntoDish = function(item){
		var new_opt = new Option(JSON.parse(ko.toJSON(self.currentOption())),self.current_dish());
		new_opt.getId();
		_.each(new_opt.individual_options(),function(e){
			e.getId()
		});
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


	self.menu.subscribe(function(newvalue){
		_.each(self.menu(),function(item,index){
			if(item.position() != index){
				item.position(index);
			}
		});
		console.log("----------------");
	});

	self.menu($.map(data.menu, function(item) { 
									return new Section(item,self) 
								}
	));

	self.additional_menus = ko.observableArray([]);

	$(".tooltipclass").tooltip({delay: { show: 500, hide: 100 }});  

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


	self.newSectionName = ko.observable();
	self.addSection = function() {
		console.log("Adding Section");
		self.newDomCounter++;
		var new_section = new Section({name:copyDefaultHash(sectionNames),subsection:[],dom_id:self.newDomCounter},self);
		self.menu.push(new_section);
		self.current_section(new_section);
		self.current_dish(null);
	} 


	// Make sure we hide the menu edit interface.
	self.current_dish.subscribe(function(value){
		if(value){
			if(self.topmodel && self.topmodel.current_menu_edit){
				self.topmodel.current_menu_edit(null);
			}			
		}
	});

	self.current_section.subscribe(function(value){
		if(value){
			if(self.topmodel && self.topmodel.current_menu_edit){
				self.topmodel.current_menu_edit(null);
			}			
		}
	});	

	self.showModal = function(image) {
		console.log("#"+image.id());
		$("#"+image.id()).modal("show");
	};      

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
					}
				},
			}
		});          
	} 

    self.lName = ko.computed({
        read: function(){
            return self.name()[lang()];
        },
        deferEvaluation: true,
    }); 	    

	self.for_real_discard = function(){
		$.ajax({
			type: "POST",
			url: "/app/administration/reset_draft_menu",
			data: {
				restaurant_id: restaurant_id,
				menu: ko.toJSON(self.menu)
			},
			success: function(data, textStatus, jqXHR){
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
						item.topmodel = null;
						item.dirty(true);
						self.menu.remove(item);
						self.current_section(self.menu()[0]);
					}
				},
			}
		});        
	}

	self.destroyed = ko.observable(false);
    self.removeMenu = function(item) {
        bootbox.dialog({
          message: localizeMessage(item.name(),"remove_menu"),
          title: "Remove Menu",
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
              	item.topmodel.menus.remove(item);
              	if(item.topmodel.current_menu() == item){
              		item.topmodel.current_menu(item.topmodel.menus()[0]);
              	}
                item.topmodel = null;
                self.destroyed(true);
                item.dirty(true);
              }
            },
          }
        });        
    }	

	self.save_menu_modal = ko.observable(false);
	self.preview_token = ko.observable("");
	self.saveDraft = function(){
		var spinner = new Spinner(opts).spin(document.getElementById('center')); 
		$.ajax({
			type: "POST",
			url: "/app/administration/update_menu",
			data: {
				restaurant_id: restaurant_id,
				menu: JSON.stringify(self.menu())
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
				menu: JSON.stringify(self.menu())
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

    self.set_dish = function(dish) {
    	if(self.topmodel)
        	self.topmodel.current_menu_edit(null);
        self.current_section(null);
        self.current_dish(dish);
        $("body").animate({scrollTop:0}, '100', 'swing');
    };

    self.set_section = function(section) {
    	if(self.topmodel)
        	self.topmodel.current_menu_edit(null);
        self.current_dish(null);
        self.current_section(section);
        $("body").animate({scrollTop:0}, '100', 'swing');
    };  	    

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
	    self.default_menu();
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
              url: "/app/menu_update/update_menu",
              data: {
                restaurant_id: restaurant_id,
                odesk_id: odesk_id,
                // data: ko.toJSON(self),
                data: self.fastJSON(),
                destroyed: self.destroyed.peek(),
              },
              success: function(data, textStatus, jqXHR){
                    console.log("Menu Saved.");
                    self.stop_track_saving();                            
    				self.dirty(false);
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) { 
                    self.stop_track_saving();                	
    				self.dirty(true);
                    console.log("There was an error saving the section " + errorThrown);
                },
                dataType: "json"
            });
    	}
    }).extend({ rateLimit: { timeout: 5000, method: "notifyWhenChangesStop" } });
}

Menu.prototype.toJSON = function() {
    var copy = ko.toJS(this,["menu","showSizesList","currentDishOptions","showOptionsList","current_section","current_dish","dishList","dishSizeList"]); //easy way to get a clean copy
    return copy; //return the copy to be serialized
};  