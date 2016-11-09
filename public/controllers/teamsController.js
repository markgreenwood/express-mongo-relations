/* eslint-disable no-undef */

(function (module) {

  const teamsController = {};

  $.ajax('/api/teams').done(function(data) {
    $('#teams-list').empty();
    data.forEach(function(item) {
      var team = document.createElement('li');
      team.innerHTML = item.team;
      $('#teams-list').append(team);
    });
  });

  teamsController.displayTeams = function() {
    $('#teams-list').fadeIn().siblings().hide();
  };

  $('#teams').on('click', teamsController.displayTeams);

  module.teamsController = teamsController;

})(window);