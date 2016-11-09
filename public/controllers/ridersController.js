/* eslint-disable no-undef */

(function (module) {

  const ridersController = {};

  $.ajax('/api/riders').done(function(data) { // eslint-disable-line no-undef
    $('#riders-list').empty();
    data.forEach(function(item) {
      var rider = document.createElement('li');
      rider.innerHTML = item.name;
      $('#riders-list').append(rider);
    });
  });

  ridersController.displayRiders = function() {
    $('#riders-list').fadeIn().siblings().hide();
  };

  $('#riders').on('click', ridersController.displayRiders);

  module.ridersController = ridersController;

})(window);