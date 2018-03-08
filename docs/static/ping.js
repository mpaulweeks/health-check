$(document).ready(function () {
  const elmNames = document.getElementById("names")
  const elmResults = document.getElementById("results")
  const elmDetails = document.getElementById("details")

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
        elmDetails.innerHTML += details;
      }
      var result = is_up ? 'OK' : 'DOWN';
      document.getElementById(service.tag).innerHTML = result;
    }
  }

  function checkService(service){
    elmNames.innerHTML += `<p><a target="_blank" href="${service.endpoints[0].url}">${service.name}</a></p>`;
    elmResults.innerHTML += `<p id="${service.tag}">checking...</p>`;
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
    elmNames.innerHTML += `<p><a target="_blank" href="${file.endpoints[0].url}">${name}</a></p>`;
    elmResults.innerHTML += `<p id="${file.tag}">checking...</p>`;
      file.endpoints.forEach(function (endpoint){
        fetch(endpoint.url)
          .then(resp => resp.json())
          .then(data => {
            const updatedAt = extractUpdatedAt(file, data);
            endpoint.is_up = isNew(updatedAt);
            endpoint.message = updatedAt;
            refreshInfo(file);
          })
          .catch(err => {
            endpoint.is_up = false;
            endpoint.message = err;
            refreshInfo(file);
          })
      });
  }

  function checkServer(server){
    const name = server.name || server.tag;
    elmNames.innerHTML += `<p><a target="_blank" href="${server.endpoints[0].url}">${name}</a></p>`;
    elmResults.innerHTML += `<p id="${server.tag}">checking...</p>`;
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
    elmNames.innerHTML += '<br/>';
    elmResults.innerHTML += '<br/>';
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

  fetch("static/data.json")
    .then(resp => resp.json())
    .then(data => {
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
    })
});
