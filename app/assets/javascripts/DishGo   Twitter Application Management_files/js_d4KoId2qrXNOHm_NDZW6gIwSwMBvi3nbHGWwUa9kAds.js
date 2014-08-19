(function ($, Drupal) {

  "use strict";

  Drupal.behaviors.security_form = {

    /**
     * @param context
     * @param settings
     */
    attach : function (context, settings) {

      // Look through all forms in the page
      $('form').each(function(index, formElement) {

        var $formElement = $(formElement),
          input = $formElement.find('input[type=hidden][name=form_token]'),
          ajaxSubmit = $formElement.find('.form-submit.ajax'),
          isAjax = ajaxSubmit.length === 1 ? true : false;

        // If the form doesn't have a hidden input named "form_token" then input
        // will be undefined
        if (typeof input !== 'undefined'){
          // jQuery object of the hidden input
          var $input = $(input[0]);

          // if the input value is callback then whenever we submit the form
          // we need to query the backend for the proper CSRF token.
          if ($input.val() === 'callback') {
            // the url to the callback - set on page load
            var callback = '/ajax/get/csrf-token';

            // get the form id - on page load
            var formIdInput = $formElement.find('input[type=hidden][name=form_id]');

            if (typeof formIdInput !== "undefined") {

              // get the formId
              var formId = $(formIdInput[0]).val();

              // whether the form was submitted or not - otherwise
              // it will loop indefinitely
              var isSubmitted = false;

              // bind the event to the form element
              $formElement.submit(function(event) {
                if (isSubmitted === false) {
                  // prevent the event to be fired so we can callback
                  // then submit the form
                  event.preventDefault();

                  // then get the csrf token from the backend
                  $.get(callback, {form_id: formId}, function(data) {
                    // inject it to the token field
                    $input.val(data.token);

                    // we flag the form as submitted so we don't redo what we just did
                    isSubmitted = true;

                    // submit the form
                    $formElement.submit();
                  });
                }
              });

              // if this form is using an ajax submit, go ahead
              // and go get the csrf -- don't wait for them to submit
              if (isAjax) {
                // then get the csrf token from the backend
                $.get(callback, {form_id: formId}, function(data) {
                  // inject it to the token field
                  $input.val(data.token);
                });
              }

            }
          }
        }
      });
    },

  };

}(jQuery, Drupal));
;
