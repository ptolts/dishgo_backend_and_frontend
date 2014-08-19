window.$ = jQuery;

var Drupal = Drupal || {},
GAZ = (function ($) {

  var self = {};

  /**
   * Modify embedded tweets to hide the date and show a "promoted by" tag when
   * our WYSIWYG plugin has marked the tweet as "promoted".
   */
  self.modifyTweets = function () {

    intervalHandle = setInterval(function () {

      var tweets = $('.g-tweet').not('.g-modified');

      if (tweets.length === 0) {
        clearInterval(intervalHandle);
      }

      tweets.each(function () {

        var $this = $(this),
        thisFrame  = $this.find('iframe'),
        tweet      = thisFrame.contents().find('blockquote.tweet').last(),
        updated    = '',
        screenName = '',
        fullName   = '',
        promotedBy = '',
        promoted   = '',
        promotedImg = '';

        // If this tweet has been embedded on a blog page or has
        // been specifically set to not show a date, we mask the
        // date by replacing it with 'View on Twitter'
        if ($this.parents('.node-type-blog').length !== 1 || $this.hasClass('g-mask-date')) {

          updated = tweet.find('.dateline a');
          updated.text(Drupal.t('View on Twitter'));

          $this.addClass('g-modified');

        }

        // If this tweet has been marked as promoted by a content editor,
        // we prepend a promoted icon along with custom text
        if ($this.hasClass('g-promoted')) {
          promotedImg = $this.hasClass('g-promoted-purple') ? 'promoted-purple.png' : 'promoted.png';

          // Add the "promoted by" tagline
          screenName = $this.attr('data-promotedby-screenname');

          if (!screenName) {
            screenName = tweet.find('.header .p-nickname b').text();
          }
          fullName = $this.attr('data-promotedby-fullname');
          if (!fullName) {
            fullName = tweet.find('.header .full-name .p-name').text();
          }
          promotedBy = Drupal.t("Promoted by !fullName", { '!fullName': fullName });

          promoted = '<div class="context">';
          promoted += '<span class="metadata with-icn">';
          promoted += '<img class="gazebo-promoted-img" src="/sites/all/themes/gazebo/img/' + promotedImg + '" />';
          promoted += '<a href="https://twitter.com/' + self.hoganEscape(screenName) + '" class="js-action-profile-promoted js-user-profile-link js-promoted-badge">' + self.hoganEscape(promotedBy) + '</a>';
          promoted += '</span>';
          promoted += '</div>';

          thisFrame.css('height', thisFrame.height() + 15 + 'px');
          tweet.find('.footer').prepend(promoted);
          tweet.find('.footer .js-action-profile-promoted').css('padding-left', '5px');

          $this.addClass('g-modified');

        }

      });
    }, 3000);

  };

  self.relocateModals = function () {

    // modals can be added anywhere on the page by calling theme_bootstrap_modal()
    // b/c #gaz-content > .container has a position: relative and a z-index: 1, the
    // modals are showing up behind the overlay. to solve this, we move all modals
    // to the end of the DOM and put them just before the closing </body> tag.
    $('.modal').appendTo('body');

  };

  /**
   * Toggle sidebar menus onload & onclick
   */
  self.toggleSideMenus = function () {

    var $h3 = $('.view-success-story-taxonomy h3');

    // Open menus on click of heading
    $h3.click(function (e) {

      e.preventDefault();

      var $this = $(this);

      $this.toggleClass('open');
      $this.next('ul').toggle();

    });

    // Look for active links, and open their container if they exist.
    $('.view-success-story-taxonomy ul li a.active').parents('ul').prev('h3').click();
  };

  /**
   * Reveal youtube videos when play button is clicked.
   */
  self.toggleVideo = function () {

    $('#hero .btn-play').click(function () {

      var container	= $('.hero-video-src'),
      video_id	= self.hoganEscape(container.attr('data-video-src'));

      container.html('<iframe id="herovideo" width="100%" height="100%" src="https://www.youtube.com/embed/' + video_id + '?autoplay=1" frameborder="0"></iframe>');

      $('#hero').addClass('video-curtain');

      $('#hero .g-hero-video')
      .show()
      .addClass('visible');

      return false;
    });

    $('#hero').click(function () {

      var $this = $(this);

      if ($this.hasClass('video-curtain')) {

        $('.hero-video-src').text('');
        $this.removeClass('video-curtain');

        $('#hero .g-hero-video')
        .hide()
        .removeClass('visible');

        return false;
      }
    });
  };

  /**
   * Handle moving the left sidebar navigation below content.
   */
  self.arrangeNavigation = function () {

    var win = $(window);

    var constructNavigation = function () {

      if ($('#sidebar-first-bottom').length === 0) {
        $('#sidebar-first').clone()
        .attr('id', 'sidebar-first-bottom')
        .addClass('position-bottom')
        .removeClass('span2')
        .appendTo('#gaz-content > .container')
        .hide();
      }

    };

    var toggleNavigation = function () {
      // Use window.outerWidth if available, as it includes the scrollbar width, consistent with how Chrome and FF
      // measure browser width for CSS media queries.  $(window).width() does not include scrollbar width.
      var windowWidth = window.outerWidth ? window.outerWidth : win.width();

      if (windowWidth <= 767) {
        constructNavigation();
        $('#sidebar-first').hide();
        $('#sidebar-first-bottom').show();
      } else {
        $('#sidebar-first').show();
        $('#sidebar-first-bottom').hide();
      }
    };

    toggleNavigation();
    win.resize(toggleNavigation);
  };

  self.loadMore = {
    init: function() {

      var loadMoreLink = $('a.load-more'),
          paginationContainer = $('.pagination'),
          nextLink = paginationContainer.find('.next a').attr('href');

      if (loadMoreLink.length === 0 || paginationContainer.length === 0) {
        return false;
      }

      paginationContainer.hide();

      loadMoreLink.bind('click', function(e) {

        e.preventDefault();

        var $this            = $(this),
            resultsContainer = $this.data('target'),
            resultsItem      = $this.data('result'),
            nextResultsDom   = null,
            nextResults      = null;

        $this.addClass('loading');
        $.get(nextLink, function(data) {

          nextResultsDom = $(data);
          nextResults    = nextResultsDom.find(resultsItem);
          nextLink       = nextResultsDom.find('.pagination .next a').attr('href');

          if (typeof nextLink === 'undefined') {
            // hide the link wrapper to remove extra margins
            loadMoreLink.parent().hide();
          }

          $(resultsContainer).append(nextResults);
          $this.removeClass('loading');
        });
      });
    }
  };

  /**
   * Add a tweet button to tweetable quotes.
   */
  self.tweetableQuotes = function() {
    $('.page-node .g-quote.g-tweetable').each(function() {
      var tweetable = $(this),
        btn = $('<a class="btn btn-twhite">' + Drupal.t('Tweet') + '</a>'),
        url = encodeURIComponent(document.location);
      var text = tweetable.children('p').text();
      // If the quote isn't wrapped in quotes, do it now.
      var first_char = text.substr(0,1),
        last_char = text.substr(-1,1);
      if (first_char != '"' && first_char != '“' && last_char != '"' && last_char != '”') {
        text = '"' + text + '"';
      }
      btn.attr('href', 'https://twitter.com/intent/tweet?url=' + url + '&text=' + encodeURIComponent(text) + '&share_with_retweet=false');
      tweetable.append(btn);
    });
  };

  /**
   * Check datawrapper & easychart iframes for dimension properties, and enforce them on the iframe if present.
   */
  self.iFrameSizing = function() {
    $('.datawrapper > iframe, .easychart > iframe').each(function() {
      var frame = $(this),
        props = [ 'height', 'width' ],
        prop;

      for (var i in props) {
        prop = props[i];
        if (frame.attr(prop)) {
          frame.css(prop, frame.attr(prop));
        }
      }
    });
  };

  self.subnav = {
    isMinimized: false,

    element: null,

    initialize: function () {
      self.subnav.element = $($('#subnav').find('.menu')[0]);

      // We don't initialize if there is no need to minimize the sub nav
      if (self.subnav.isMinimizable() === false) {
        return false;
      }

      // Handle subnav for the first time
      self.subnav.handle();

      $(window).resize(function () {
        self.subnav.handle();
      });
    },

    /**
     * We call the proper handle function on the document element's width
     */
    handle: function () {
      if ($(document).width() <= 979) {
        self.subnav.handleReset();
      }
      else {
        self.subnav.handleMinimize();
      }
    },

    /**
     * Handle the logic when the window is resized from mobile view to desktop view
     * Returns false if nothing was changed otherwise returns true
     */
    handleReset: function () {
      // If it isn't currently minimized we do bother with the rest of the code
      if (self.subnav.isMinimized === false) {
        return false;
      }

      var $subnavMoreItem = $(self.subnav.element.children('#main-menu-more-item')[0]);
      var $subnavMoreDropdownList = $($subnavMoreItem.children('.dropdown-menu')[0]);

      $subnavMoreDropdownList.children().appendTo(self.subnav.element);

      // avoid having the menu blink when widening the window's width
      self.subnav.element.addClass('menu-overflow-hidden');

      $subnavMoreItem.addClass('hide');

      self.subnav.isMinimized = false; // flag the nav as not-minimized

      return true;
    },

    /**
     * Handle the logic when the total width of the nav items is wider than the actual navigation
     */
    handleMinimize: function () {
      // If it has already been minimized we don't bother processing the rest of the code
      if (self.subnav.isMinimized === true) {
        return false;
      }

      var $subnavMoreItem = $(self.subnav.element.children('#main-menu-more-item')[0]);
      var $subnavMoreDropdownList = $($subnavMoreItem.children('.dropdown-menu')[0]);
      var $item;
      var items = self.subnav.element.children('li:not(.dropdown)').toArray(); // otherwise pop doesn't work

      // available space including the more button
      var subnavAvailableWidth = self.subnav.element.width() - $subnavMoreItem.outerWidth(true);
      var subnavItemsTotalWidth = self.subnav.getItemsTotalWidth();

      // Carve down into the items total width until it fits in the subnav available width
      do {
        $item = $(items.pop());

        subnavItemsTotalWidth -= $item.outerWidth(true);

        $item.prependTo($subnavMoreDropdownList);
      } while (subnavItemsTotalWidth > subnavAvailableWidth);

      $subnavMoreItem.removeClass('hide');

      // avoid having the menu blink when widening the window's width
      self.subnav.element.removeClass('menu-overflow-hidden');

      self.subnav.isMinimized = true; // flag the subnav as minimized

      return true;
    },

    /**
     * Returns the total width of all items of the subnav except the more button
     */
    getItemsTotalWidth: function () {
      var totalWidth = 0;

      // sum all item sizes (excludes more button)
      self.subnav.element.children('li:not(#main-menu-more-item)').each(function (index, element) {
        // If we hide an element in the nav then we shouldn't count it in
        if ($(element).css('display') !== "none") {
          totalWidth += $(element).outerWidth(true); // include borders and no margins
        }
      });

      return totalWidth;
    },

    /**
     * Returns true if the nav should be minimized otherwise returns false
     */
    isMinimizable: function () {
      var subnavItemsTotalWidth = self.subnav.getItemsTotalWidth();

      // If the subnav is wider than the total width of the items then
      // we don't need to go further in the code
      if (self.subnav.element.width() > subnavItemsTotalWidth) {
        return false;
      }

      return true;
    }
  };

  self.init = function () {
    this.loadMore.init();
    this.modifyTweets();
    this.toggleSideMenus();
    this.toggleVideo();
    this.arrangeNavigation();
    this.relocateModals();
    this.tweetableQuotes();
    this.subnav.initialize();
    this.iFrameSizing();
  };

  return self;
}(jQuery));

jQuery(document).ready(function () {
  GAZ.init();

  if (jQuery.receiveMessage) {
    jQuery.receiveMessage(function (e) {
      jQuery('iframe.autosize').css({
        height: e.data
      });
    });
  }
});
;
(function (window, $) {

  'use strict';

  // GAZ is defined in gazebo.js is loaded very early on so
  // it will not break the original code.
  // gazebo.js is only included in the customer facing pages
  // while this file is included everywhere.
  // You can expect the following function to be accessible
  // anytime unless your JS file is included before this file.
  var GAZ = window.GAZ || {};

  /**
   * Html escaping from hogan.js
   */
  GAZ.hoganEscape = function(str) {
    var rAmp = /&/g,
    rLt      = /</g,
    rGt      = />/g,
    rApos    = /\'/g,
    rQuot    = /\"/g,
    hChars   = /[&<>\"\']/;

    str = String((str === null || str === undefined) ? '' : str);
    return hChars.test(str) ?
        str
        .replace(rAmp, '&amp;')
        .replace(rLt, '&lt;')
        .replace(rGt, '&gt;')
        .replace(rApos, '&#39;')
        .replace(rQuot, '&quot;') :
          str;
  };

  GAZ.loadDrupalSettings = function() {
    var drupalSettingsContainer = $("#drupal-settings");
    if (drupalSettingsContainer.length > 0) {
      var drupalSettings = $.parseJSON(drupalSettingsContainer.html());
      jQuery.extend(Drupal.settings, drupalSettings);
    }
  };

  GAZ.initializePrintButton = function () {
    $('.btn-print').click(function (event) {
      event.preventDefault();
      window.print();
    });
  };

  // moved here from init so Drupal.settings are available during page load
  GAZ.loadDrupalSettings();

  $(document).ready(function () {
    GAZ.initializePrintButton();
  });

  window.GAZ = GAZ;

})(window, jQuery);
;
