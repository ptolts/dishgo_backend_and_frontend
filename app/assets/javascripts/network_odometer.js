var odo = ko.observableArray([]);
var odo_count = ko.observable();

$(document).ready ( function(){
	var getMenusServed = function(){
		$.ajax({
			type: "POST",
			url: "/app/network/menus_served",
			success: function(data, textStatus, jqXHR){
				odo_count(data.count.toString());
			},
			dataType: "json"
		});
	}
	getMenusServed();
  	setInterval(function(){getMenusServed();}, 10000);
});

odo_count.subscribe(function(number_string){
  var odo_array = odo();
  for(i=0;i<number_string.length;i++){
  	if(!odo_array[i]){
  		odo_array.push(ko.observable());
  	}
  	var odo_observable = odo_array[i];
	odo_observable(number_string[i]);
  }
  odo.valueHasMutated();
});


ko.bindingHandlers.odometer_animate = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var number = valueAccessor();
      $(element).removeClass();
      $(element).addClass('animated goto-' + number);
    }    
}

// var sarma = false;

// function pad(n, width, z) {
//   z = z || '0';
//   n = n + '';
//   return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
// }
// var num = 0;
/*setTimeout(function(){
  $('.cou-item').find('ul').each(function(i, el){
    var val = pad(num, 5, 0).split("");
    var $el = $(this);
    $el.removeClass();
    $el.addClass('goto-' + val[i]);
  })
}, 10);*/


// function counter() {
//   setInterval(function(){
//     sarma = !sarma;
    
//     if (sarma) {
//       $('.cou-item').find('ul').each(function(i, el){
//         var $el = $(this);
        
//         if ($el.hasClass("goto-0")) {
//           $el.removeClass()
//              .addClass("no-animation-0");
//         }
//       });
      
//       return;
//     }
    
//     $('.cou-item').find('ul').each(function(i, el){
//       var val = pad(num + 1, 5, 0).split("");
//       var $el = $(this);
      
//       if ($el.hasClass('goto-' + val[i]) || 
//          $el.hasClass('no-animation-' + val[i])) {
//         return;
//       }
      
//       num += 1;
      
//       $el.removeClass();
     
//       $el.addClass('animated goto-' + val[i]);
      
//     })
//   }, 250);
// }
