$.ajax('/api/riders').done(function(data) {
  data.forEach(function(item) {
    var rider = document.createElement('li');
    rider.innerHTML = item.name;
    $('#riders-list').append(rider);
  });
});

$.ajax('/api/teams').done(function(data) {
  data.forEach(function(item) {
    var team = document.createElement('li');
    team.innerHTML = item.team;
    $('#teams-list').append(team);
  });
});