(function ($) {

$.myCarousel.nav = function() {
  var base = this,
      methods = {};

  methods.init = function () {
    this.buildNav()
      .handleNavClick();

    return this;
  };

  methods.buildNav = function () {


    return this;
  };

  methods.handleNavClick = function () {


    return this;
  };

  methods.init();
};

$.fn.myCarousel.nav = function () {
  if ($(this).data('myCarousel')) {
    new $.myCarousel.nav();
  }
};

}(jQuery));