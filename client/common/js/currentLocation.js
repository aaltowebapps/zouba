
var coords = {lat: "", lon: ""};

function getLocation()
  {
  if (navigator.geolocation)
    {
    navigator.geolocation.getCurrentPosition(showPosition);
    }
  else{x.innerHTML="Geolocation is not supported by this browser.";}
  }
function showPosition(position)
  {
  coords.lat = position.coords.latitude;
  coords.lon = position.coords.longitude;
  }

