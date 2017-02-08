$(document).ready(function () {
  function refresh_info(service){
    var details = "";
    var is_up = true;
    var is_done = true;
    service.endpoints.forEach(function (endpoint){
      if (endpoint.is_up == null){
        is_done = false;
      } else {
        is_up = is_up && endpoint.is_up;
        details += '<br/>' + endpoint.url + '<br/>' + endpoint.message + '<br/>';
      }
    });
    if (is_done){
      if (window.location.href.includes("details")){
        $('#details').append(details);
      }
      var result = is_up ? 'OK' : 'DOWN';
      $('#' + service.tag).html(result);
    }
  }

  function check_service(service){
    $('#names').append('<p><a href="' + service.endpoints[0].url + '">' + service.name + '</a></p>');
    $('#results').append('<p id="' + service.tag + '">checking...</p>');
      service.endpoints.forEach(function (endpoint){
        $.ajax({
          url: endpoint.url,
          type: 'GET',
        }).success(function (data){
          endpoint.is_up = true;
          endpoint.message = data;
          refresh_info(service);
        }).fail(function (data){
          endpoint.is_up = false;
          endpoint.message = data;
          refresh_info(service);
        });
      });
  }

  function create_endpoint(url){
    return {
      url: url,
      is_up: null,
      message: ''
    }
  }

  var services = [
    {
      tag: 'cat-herder',
      name: 'cat herder',
      endpoints: [
        create_endpoint('http://cat-herder.mpaulweeks.com')
      ]
    },
    {
      tag: 'commander-league',
      name: 'commander league',
      endpoints: [
        create_endpoint('http://edh.mpaulweeks.com')
      ]
    },
    {
      tag: 'type4stack',
      name: 'type4stack',
      endpoints: [
        create_endpoint('http://type4.mpaulweeks.com/')
      ]
    },
    {
      tag: 'fgc-demo',
      name: 'sfv.fightinggame.community',
      endpoints: [
        create_endpoint('http://sfv.fightinggame.community/health')
      ]
    },
  ];

  services.forEach(function (service){
    check_service(service);
  });
});
