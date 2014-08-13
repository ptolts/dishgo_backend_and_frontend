/*
*= require bootstrap_wysiwyg.js
*= require colorpicker.js
*/

(function( $, ko ) {

	ko.bindingHandlers['wysiwyg'] = {
		init: function (element, valueAccessor, allBindingsAccessor) {
        	console.log("DEBUG: wysiwyg firing on: " + element);
			var underlyingObservable = valueAccessor();
			var interceptor = ko.computed({
			    read: function () {
			        return underlyingObservable.peek()[viewmodel.lang()];
			    },

			    write: function (newValue) {
			        var current = underlyingObservable.peek();
			        current[viewmodel.lang()] = newValue;
			        underlyingObservable.peek(current);
			    },
			});

            var editor = $(element).summernote({
				onImageUpload: function(files, editor, $editable) {
			        $(element).fileupload({         
			            url: "/app/website/upload_website_image",
			            dataType: 'json',
				        formData: {},    			            
			            progressInterval: 50,
			            add: function(e,data){
			                data.img_element = $editable;
			                data.img_editor = editor;
			                data.submit();
			            },
			            submit: function(e, data){
			                console.log(data);
			            },
			            send: function (e, data) {

			            },
			            done: function (e, data) {
			                var file = data.result.files[0];                 
							data.img_editor.insertImage(data.img_element, file.url);                                       
			            },
			            progress: function (e, data) {
			                var progress = parseInt(data.loaded / data.total * 100, 10);
			                console.log(progress);
			            },
			            fail: function (e, data) {
			            	alert("There was an issue uploading your image.");
			            },                       
			        }); 
				},            	
            	onkeyup: function (cm) {
	                interceptor($(element).code());
				},
				toolbar: [
				    ['style', ['style']], // no style button
				    ['style', ['bold', 'italic', 'underline', 'clear']],
				    // ['fontsize', ['fontsize']],
				    ['color', ['color']],
				    ['para', ['paragraph']],
				    ['view', ['codeview']],
				    // ['height', ['height']],
				    //['insert', ['picture', 'link']], // no insert buttons
				    //['table', ['table']], // no table button
				    //['help', ['help']] //no help button
				  ],			
            });

            $(element).code(interceptor());
          
        },
        update: function (element, valueAccessor, allBindingsAccessor) {
        	console.log("DEBUG: wysiwyg firing on: " + element);
			var underlyingObservable = valueAccessor();
			var interceptor = ko.computed({
			    read: function () {
			        return underlyingObservable()[viewmodel.lang()];
			    },

			    write: function (newValue) {
			        var current = underlyingObservable();
			        current[viewmodel.lang()] = newValue;
			        underlyingObservable(current);
			    },
			});

            $(element).code(interceptor());
        }
	};

})( jQuery, ko );
