
const elmNames = document.getElementById("names");
const elmResults = document.getElementById("results");
const elmDetails = document.getElementById("details");
const showDetails = window.location.href.includes("details");

function refreshInfo(service){
  var details = document.createElement('div');
  var is_up = true;
  var is_done = true;
  service.endpoints.forEach(function (endpoint){
    if (endpoint.is_up == null){
      is_done = false;
    } else {
      is_up = is_up && endpoint.is_up;
      if (showDetails) {
        const newDiv = document.createElement('div');
        newDiv.appendChild(document.createElement('div')).innerText = endpoint.url;
        newDiv.appendChild(document.createElement('div')).innerText = endpoint.message;
        newDiv.appendChild(document.createElement('hr'));
        details.appendChild(newDiv);
      }
    }
  });
  if (is_done){
    elmDetails.appendChild(details);
    var result = is_up ? 'OK' : 'DOWN';
    document.getElementById(service.tag).innerHTML = result;
  }
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

function checkApi(api){
  const name = api.name || api.tag;
  elmNames.innerHTML += `<p><a target="_blank" href="${api.endpoints[0].url}">${name}</a></p>`;
  elmResults.innerHTML += `<p id="${api.tag}">checking...</p>`;
  api.endpoints.forEach(function (endpoint){
    fetch(endpoint.url)
      .then(resp => resp.text())
      .then(text => {
        endpoint.is_up = true;
        endpoint.message = text;
        refreshInfo(api);
      })
      .catch(err => {
        endpoint.is_up = false;
        endpoint.message = err;
        refreshInfo(api);
      })
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
      checkApi(service);
    });
    addBuffer();
    data.files.forEach(function (file){
      file.endpoints = [createEndpoint(file.url)];
      checkFile(file);
    });
    addBuffer();
    data.servers.forEach(function (server){
      server.endpoints = [createEndpoint(server.url)];
      checkApi(server);
    });
  })
