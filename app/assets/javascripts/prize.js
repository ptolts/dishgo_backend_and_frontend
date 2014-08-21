ko.bindingHandlers.datepicker = {
    update: function (element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor();
        $(element).datepicker({
            onSelect:function(dateText,inst){
              var format = "%m/%d/%Y";
              var d = jdate.strptime(dateText,format); 
              console.log("Changing date to: " + d);
              value(d);
            },
            defaultDate: value(),
        });

        console.log(value());

        $(element).val(jdate.strftime(value(),"%m/%d/%Y"));
        // value(jdate.strftime(value(),"%m/%d/%Y"));

        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
          $(element).datepicker( "destroy" );
        });
    },
}

function IndividualPrize(data) {
    var self = this;
    self.id = (data.id || null);
    self.prize_token = (data.prize_token || null);
    self.user_id = ko.observable(data.user_id || null);
    self.number = ko.observable(data.number || null);

    self.claimed = ko.computed({
      read: function(){
        if(self.user_id()){
          return true;
        }
        return false;
      }
    });
}

function Prize(data) {
    var self = this;
    self.id = ko.observable(data.id || null);
    self.name = ko.observable(data.name || copyDefaultHash(default_language_hash));
    self.restaurant_name = ko.observable(data.restaurant_name || "");
    self.amount = ko.observable(data.amount || 0);
    self.prize_type = ko.observable(data.prize_type || "$");
    self.prize_types = ["$","%"];
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

    self.individual_prizes = ko.observable(_.map(data.individual_prizes,function(ind_pri){ return new IndividualPrize(ind_pri) }));

    self.lName = ko.computed({
    	read: function(){
            return self.name()[lang()];
    	},
    	deferEvaluation: true,
    });

    self.lDescription = ko.computed({
      read: function(){
            return self.description()[lang()];
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
    		for(i=2;i<13;i++){
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

    self.validate = function(){
      if(self.lName() == ""){
        alert("Gift certificates require a name!");
        return false;
      }
      if(self.amount() <= 2){
        alert("Gift certificates cannot be worth less than $5");
        return false
      }
      return true;
    }

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
              if("winner_winner_chicken_dinner" in window){
                winner_winner_chicken_dinner(true);
              }
            } else if(data.error){
              alert(data.error);
            } else {
              alert(data.lost);
              if("winner_winner_chicken_dinner" in window){
                winner_winner_chicken_dinner(false);
              }              
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
      if(!self.validate()){
        return;
      }      
    	self.spin(true);
        $.ajax({
          type: "POST",
          url: "/app/prizes/save",
          data: {
          	id: self.id(),
            prize:ko.toJSON(self),
          },
          success: function(data, textStatus, jqXHR){
            self.id(data.id);
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