$(document).ready(function () {
  function refreshInfo(service){
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

  function checkService(service){
    $('#names').append('<p><a href="' + service.endpoints[0].url + '">' + service.name + '</a></p>');
    $('#results').append('<p id="' + service.tag + '">checking...</p>');
      service.endpoints.forEach(function (endpoint){
        $.ajax({
          url: endpoint.url,
          type: 'GET',
        }).success(function (data){
          endpoint.is_up = true;
          endpoint.message = data;
          refreshInfo(service);
        }).fail(function (data){
          endpoint.is_up = false;
          endpoint.message = data;
          refreshInfo(service);
        });
      });
  }

  function createEndpoint(url){
    return {
      url: url,
      is_up: null,
      message: ''
    }
  }

  $.getJSON("services.json", function(data){
    data.forEach(function (service){
      service.endpoints = [];
      service.urls.forEach(function (url){
        service.endpoints.push(createEndpoint(url));
      });
      checkService(service);
    });
  });
});
