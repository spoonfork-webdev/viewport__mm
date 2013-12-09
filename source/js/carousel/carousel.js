(function ($) {

$.myCarousel = function(elem, options) {
  var $carousel = $(elem);
      vars = $.extend({}, $.myCarousel.defaults, options),
      namespace = vars.namespace,
      activeClass = namespace + "active",
      base = this,
      methods = {},
      hidden = {
        "display": "none",
        "float": "none",
        "opacity": 1,
        "z-index": 0
      },
      staged = {
        "display": "block",
        "float": "left",
        "opacity": 1,
        "z-index": 1
      };

  $.data(elem, "myCarousel", $carousel);

  methods.init = function () {
    this.prepCarousel()
      .detectTransitions()
      .handleCarouselHover();

    $carousel.playing = false;

    $carousel.play();

    return this;
  };

  methods.prepCarousel = function () {
    if (!$carousel.hasClass(namespace + "slides")) $carousel.addClass(namespace + "slides");

    $carousel.children()
      .addClass(namespace + "slide")
      .css(hidden)
      .eq(0)
        .addClass(activeClass)
        .css({'z-index': 2, 'display': 'block'})
        .clone()
          .removeAttr('class')
          .css({'opacity': 0, 'position': 'relative', 'z-index': 0})
          .appendTo($carousel);

    $carousel.slides = $carousel.children('.' + namespace + 'slide');

    return this;
  };

  methods.detectTransitions = function () {
    var htmlNode = document.getElementsByTagName('html')[0];

    $carousel.hasTransitions = $(htmlNode).hasClass('cssTransitions');

    if ($carousel.hasTransitions) {
      $carousel.slides.show()
        .css({
          "-webkit-transition": "opacity" + vars.transitionSpeed + "ms ease-out",
          "-moz-transition": "opacity" + vars.transitionSpeed + "ms ease-out",
          "-o-transition": "opacity" + vars.transitionSpeed + "ms ease-out",
          "transition": "opacity" + vars.transitionSpeed + "ms ease-out"
        });
    }

    return this;
  };

  methods.handleCarouselHover = function () {
    $carousel.parent().hover(function(event) {
      event.preventDefault();
      $carousel.pause.call(base);
    }, function(event) {
      event.preventDefault();
      $carousel.play.call(base);
    });

    return this;
  };

  // methods.handleNavClick = function() {
  //   $nav.children().click(function(event) {
  //     var $this = $(this),
  //         targetIndex;

  //     if (!$this.hasClass('active') && $carousel.children().filter(':animated').length === 0) {
  //       targetIndex = $this.index();

  //       $carousel.pause.call(base);

  //       $carousel.iterate.call(base, targetIndex);
  //     }
  //   });

  //   return this;
  // };

  $carousel.swapActiveClass = function ($activeSlide, $targetSlide, targetIndex) {
    $activeSlide.removeClass(activeClass);
    $targetSlide.addClass(activeClass);

    // $nav.children()
    //   .removeClass(activeClass)
    //   .eq(targetIndex)
    //     .addClass(activeClass);

    return this;
  };

  $carousel.moveToSlide = function ($activeSlide, $targetSlide, targetIndex) {
    if (!$targetSlide.is($activeSlide)) {
      if ($carousel.hasTransitions) {
        $targetSlide.css(staged);
        $activeSlide.css('opacity', 0)
          .get(0)
          .addEventListener("webkitTransitionEnd", function () {
            $targetSlide.css('z-index', 2);
            $activeSlide.css(hidden);
            $carousel.swapActiveClass($activeSlide, $targetSlide, targetIndex);
        }, true);
      } else {
        $targetSlide.css(staged);
        $activeSlide.fadeOut(vars.transitionSpeed, function () {
            $targetSlide.css('z-index', 2);
            $activeSlide.css(hidden)
              .css("opacity", 0);
            $carousel.swapActiveClass($activeSlide, $targetSlide, targetIndex);
          });
      }
    }

    return this;
  };

  $carousel.iterate = function (targetIndex) {
    var $activeSlide = $carousel.children('.' + namespace + 'active'),
        activeIndex = $activeSlide.index(),
        $targetSlide;

    if (targetIndex === undefined) {
      targetIndex = ((activeIndex + 1) >= $carousel.slides.length) ? 0 : activeIndex + 1;
    }

    $targetSlide = $carousel.slides.eq(targetIndex);

    $carousel.moveToSlide($activeSlide, $targetSlide, targetIndex);

    return this;
  };

  $carousel.play = function () {
    $carousel.playerId = setInterval($carousel.iterate.bind(base), vars.slideShowSpeed);
    $carousel.playing = true;

    return this;
  };


  $carousel.pause = function () {
    clearInterval($carousel.playerId);
    $carousel.playing = false;

    return this;
  };

  methods.init();
};

$.myCarousel.defaults = {
  namespace: "carousel-",
  slideShowSpeed: 6000,
  transitionSpeed: 600,
  maxItems: 4
};

$.fn.myCarousel = function (options) {
  if (options === undefined) options = {};

  if (typeof options === "object") {
    this.each(function () {
      if ($(this).data('myCarousel') == undefined) {
        new $.myCarousel(this, options);
      }
    });
  } else {
    var $carousel = $(this).data('myCarousel');

    switch (options) {
      case "play": $slider.play(); break;
      case "pause": $slider.pause(); break;
      default: if (typeof options === "number") $carousel.iterate(options);
    }
  }
};

}(jQuery));