TopFive.prototype.fastJSON = function(){
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
                if(property == "dishes"){
                    fast[property] = _.collect(result,function(res){ return res.id() });
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

function TopFive(data) {
    data = data || {};
    var self = this;
    self.id = ko.observable(data.id);
    self.name = ko.observable(data.name ? data.name : copyDefaultHash(default_language_hash));
    self.beautiful_url = ko.observable(data.beautiful_url ? data.beautiful_url : data.id);
    self.description = ko.observable(data.description ? data.description : copyDefaultHash(default_language_hash));
    self.dishes = ko.observableArray(data.dishes ? _.map(data.dishes,function(d){ return new Dish(d) }) : []);

    self.allow_more_dishes = ko.computed(function(){
        if(self.dishes().length < 5){
            return true;
        } else {
            return false;
        }
    });

    Dish.prototype.push = function(){
        if(self.dishes().length < 5 && !!self.dishes().indexOf(this)){
            self.dishes.unshift(this);
            return;
        } else {
            self.dishes.remove(this);
        }
    }

    Dish.prototype.active = ko.computed(function(){
        if(!self.dishes().indexOf(this)){
            return false;
        } else {
            return true;
        }
    });

    self.top_five_saving = ko.observable(false);
    self.save = function(){
        $.ajax({
            type: "POST",
            url: "/app/top_five/save",
            data: {data:self.fastJSON()},
            beforeSend: function(){
                self.top_five_saving(true);
            },
            success: function(data, textStatus, jqXHR){
                self.top_five_saving(false);
                self.id(data.id);
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                alert(errorThrown);
                self.top_five_saving(false);
            },
            dataType: "json"
        }); 
    }
        
}