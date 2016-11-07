$.ajax('/api/riders').done(function(data) {
  data.forEach(function(item) {
    var rider = document.createElement('li');
    rider.text = item.name;
    $('#riders-list').append(item.name);
  });
});