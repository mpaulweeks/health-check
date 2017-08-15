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
    $('#names').append(`<p><a href="${service.endpoints[0].url}">${service.name}</a></p>`);
    $('#results').append(`<p id="${service.tag}">checking...</p>`);
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

  function checkFile(file){
    const name = file.name || file.tag;
    $('#names').append(`<p><a href="${file.endpoints[0].url}">${name}</a></p>`);
    $('#results').append(`<p id="${file.tag}">checking...</p>`);
      file.endpoints.forEach(function (endpoint){
        $.getJSON(endpoint.url, function(data){
          const updatedAt = extractUpdatedAt(file, data);
          endpoint.is_up = isNew(updatedAt);
          endpoint.message = updatedAt;
          refreshInfo(file);
        });
      });
  }

  function checkServer(server){
    const name = server.name || server.tag;
    $('#names').append(`<p><a href="${server.endpoints[0].url}">${name}</a></p>`);
    $('#results').append(`<p id="${server.tag}">checking...</p>`);
      server.endpoints.forEach(function (endpoint){
        $.ajax({
          url: endpoint.url,
          type: 'GET',
        }).success(function (data){
          endpoint.is_up = true;
          endpoint.message = data;
          refreshInfo(server);
        }).fail(function (data){
          endpoint.is_up = false;
          endpoint.message = data;
          refreshInfo(server);
        });
      });
  }

  function addBuffer(){
    $('#names').append('<br/>');
    $('#results').append('<br/>');
  }

  function extractUpdatedAt(file, data){
    let res = data;
    file.date_field.forEach(function (attr){
      res = res[attr];
    });
    return res;
  }

  function isNew(updatedAt){
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return new Date(updatedAt) > yesterday;
  }

  function createEndpoint(url){
    return {
      url: url,
      is_up: null,
      message: ''
    }
  }

  $.getJSON("static/data.json", function(data){
    data.services.forEach(function (service){
      service.endpoints = [];
      service.urls.forEach(function (url){
        service.endpoints.push(createEndpoint(url));
      });
      checkService(service);
    });
    addBuffer();
    data.files.forEach(function (file){
      file.endpoints = [createEndpoint(file.url)];
      checkFile(file);
    });
    addBuffer();
    data.servers.forEach(function (server){
      server.endpoints = [createEndpoint(server.url)];
      checkServer(server);
    });
  });
});
