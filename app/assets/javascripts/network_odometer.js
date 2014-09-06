// var odo = ko.observableArray();

// (function() {

//       $.ajax({
//           type: "POST",
//           url: "/app/network/menus_served",
//           success: function(data, textStatus, jqXHR){
//             odo(data.count.toString());
//           },
//           dataType: "json"
//       });  
 
// });

// ko.bindingHandlers.odometer = {
//     update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
//       var number_string = odo();
//       for(i=0;i<number_string.length;i++){
//         this.addNumber(number_string[i]);
//       }
//     }    
// }