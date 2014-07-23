SizePrices.prototype.fastJSON = function(){
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
    // This model doesn't save itself, so we return the raw JS object.
    return fast;
    // return JSON.stringify(fast);    
}

SizePrices.prototype.toJSON = function() {
    var copy = ko.toJS(this,["ind_opt","size_ind_opt"]); //easy way to get a clean copy
    return copy; //return the copy to be serialized
};

function SizePrices(data,ind_opt) {
    var self = this;
    self.name = data.name;  
    self.size_ind_opt = data.size_ind_opt;
    self.size_ind_opt_id = data.size_ind_opt._id;
    self.price = ko.observable(data.price);
    self.e_price = ko.observable(false);  
    self.size_id = ko.observable(data.size_id);
    self.ind_opt = ind_opt;

    self.dirty = ko.observable(false);
    self.dirtyTrack = ko.computed(function(){
        self.price();
        self.e_price();
        self.size_id();
        self.dirty(true);
    });
    self.dirty(false);

    self.update_when_dirty = ko.computed(function(){
        if(!self.dirty()){
            return;
        }
        if(self.ind_opt && self.ind_opt.dirty && self.ind_opt.track_saving){
            self.ind_opt.track_saving();
            self.ind_opt.dirty(true);
        }
    });        

    self.edit_price_size = function() { 
        self.e_price(true);     
    };  

    self.remove_self = function(){
        self.ind_opt.remove_size_option(self);        
    }    
}