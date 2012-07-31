!function(window, $, infinity, Pug) {
  var ListView = infinity.ListView,
      ListItem = infinity.ListItem,
      _ = require('underscore'),
      modal = require('o2-modal'),
      Pugs = Pug.images,
      PugNames = Pug.names,
      PugTaglines = Pug.taglines;

  var template = _.template($('#demo-template').html()),
      pugTemplate = _.template($('#demo-pug-template').html()),
      spinnerTemplate = _.template($('#spinner-template').html());

  var listView = new ListView($('#demo'), {
    className: 'list-view',
    lazy: function() {
      $(this).find('.pug').each(function() {
        var $ref = $(this);
        $ref.attr('src', $ref.attr('data-original'));
      });
    }
  });

  var currPug = null;
  $(document).on('click', '.modal .save', function() {
    if(currPug) currPug.addClass('saved');
    modal.close();
    return false;
  });
  $(document).on('click', '.modal .no-save', function() {
    currPug = null;
    modal.close();
    return false;
  });
  $(document).on('click', '.heart', function() {
    currPug = $(this);
    modal('#save-modal').open();
    return false;
  });

  var pugCount = 0;

  !function() {
    var spinner = $(spinnerTemplate());
    var updateScheduled = false;
    function onscreen($el) {
      var viewportBottom = $(window).scrollTop() + $(window).height();
      return $el.offset().top <= viewportBottom;
    }
    spinner.insertAfter($('#demo').closest('.row'));
    $(window).on('scroll', function() {
      if(!updateScheduled) {
        setTimeout(function() {
          if(onscreen(spinner)) pb(200);
          updateScheduled = false;
        }, 500);
        updateScheduled = true;
      }
    });
  }();

  function pug(num) {
    var rotate, rotateRight, rotateLeft, tagline, name,
        pugs = [];
    pugCount += num;
    for(var index = 0; index < num; index++) {
      var rotate = Math.random() > 0.5;
      rotateRight = rotate && Math.random() > 0.5;
      rotateLeft = rotate && !rotateRight;
      tagline = _.template(PugTaglines[
        Math.floor(Math.random() * PugTaglines.length)
      ]);
      name = PugNames[Math.floor(Math.random() * PugNames.length)];
      pugs.push(pugTemplate({
        num: num,
        pug: Pugs[Math.floor(Math.random() * Pugs.length)],
        title: name,
        caption: tagline({ name: name }),
        price: Math.floor(Math.random() * 100 + 10),
        rotateRight: rotateRight,
        rotateLeft: rotateLeft
      }));
    }
    return pugs;
  }

  function row(num) {
    return template({
      pugs: pug(num)
    });
  }

  function pb(num) {
    for(var i = num; i > 0; i--) {
      listView.append(row(Math.floor(Math.random() * 2) + 2));
    }
  }

  pb(200);

  window._debugListView = function() {
    return listView;
  }
  window.pugCount = function() { return pugCount; };
}(window, jQuery, infinity, Pug);
