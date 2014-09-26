editing_mode = false;

function Category(data){
	var self = this;
	self.name = data;
	self.active = ko.observable(false);
}

function LocationModel(){
	var self = this;
	NetworkModel.apply(self);
	self.categories = ko.observableArray(_.map(categories,function(cat){ return new Category(cat)}));
	self.selected_categories = ko.observableArray([]);

    Category.prototype.push = function(){
        if(self.selected_categories().indexOf(this)){
            self.selected_categories.push(this);
            this.active(true);
            return;
        } else {
            self.selected_categories.remove(this);
            this.active(false);
            return;
        }
    }  
}

var viewmodel = new LocationModel();

$(function(){	    
	pager.Href.hash = '#!/';
	pager.extendWithPage(viewmodel);
	ko.applyBindings(viewmodel,$("html")[0]);      			
	pager.start();
});
           				
