ko.bindingHandlers.datepicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor();    
        $(element).datepicker({
            onSelect:function(dateText,inst){
              value(dateText);
            },
            defaultDate: value(),
        });
        $(element).val(jdate.strftime(value(),"%m/%d/%Y"));
    }    
}

function Prize(data) {
    var self = this;
    self.id = ko.observable(data.id || null);
    self.name = ko.observable(data.name || copyDefaultHash(default_language_hash));
    self.amount = ko.observable(data.amount || 0);
    self.quantity = ko.observable(data.quantity || 2);
    self.number_of_bets = ko.observable();
    self.awarded = ko.observable(data.awarded);
    var format = "%Y-%m-%dT%H:%M:%S.%L%z";
    self.start_date = ko.observable(data.start_date ? jdate.strptime(data.start_date,format) : new Date());
    self.end_date = ko.observable(data.end_date ? jdate.strptime(data.end_date,format) : new Date());
    self.description = ko.observable(data.description || copyDefaultHash(default_language_hash));
    self.active = ko.observable(data.active || null);
    self.spin = ko.observable(false);
    self.saved = ko.observable();

    self.lName = ko.computed({
    	read: function(){
            return self.name()[lang()];
    	},
    	deferEvaluation: true,
    });

    self.computed_name = ko.computed({
    	read: function(){
    		if(self.lName() == ""){
    			return "New Prize";
    		} else {
    			return self.lName();
    		}
    	},
    	deferEvaluation: true,
    });

    self.quantity_list = ko.computed({
    	read: function(){
    		var list = [];
    		for(i=2;i<11;i++){
    			list.push(i);
    		}
    		return list;
    	},
    	deferEvaluation: true,
    });

    self.total_value = ko.computed({
    	read: function(){
    		var p = parseFloat(self.amount());
    		p = p * self.quantity();
    		return p.toFixed(2);
    	},
    	deferEvaluation: true,
    }); 

    self.bid = function(item){
      self.spin(true);
        $.ajax({
          type: "POST",
          url: "/app/prizes/bid",
          data: {
            id: self.id(),
            prize:ko.toJSON(self),
          },
          success: function(data, textStatus, jqXHR){
            self.spin(false);
            self.saved(true);
            if(data.won){
              alert(data.won);
            } else if(data.error){
              alert(data.error);
            } else {
              alert(data.lost);
            }
          },
          error: function(data){
            self.spin(false);
            alert("There was an issue bidding on this prize.");
          },
          dataType: "json"
        });         
    }

    self.save = function(item){
    	self.spin(true);
        $.ajax({
          type: "POST",
          url: "/app/prizes/save",
          data: {
          	id: self.id(),
            prize:ko.toJSON(self),
          },
          success: function(data, textStatus, jqXHR){
        		self.spin(false);
        		self.saved(true);
          },
          error: function(data){
    		self.spin(false);
    		alert("There was an issue saving this prize.");
          },
          dataType: "json"
        });		    	
    }

    self.create = function(item){
        $.ajax({
          type: "POST",
          url: "/app/prizes/create",
          data: {
          	id: self.id(),
            data:ko.toJSON(self),
          },
          success: function(data, textStatus, jqXHR){
          },
          dataType: "json"
        });		    	
    }

    self.destroy = function(item){
        $.ajax({
          type: "POST",
          url: "/app/prizes/destroy",
          data: {
            id:self.id(),
          },
          success: function(data, textStatus, jqXHR){
          },
          dataType: "json"
        });		    	
    }    	        
}