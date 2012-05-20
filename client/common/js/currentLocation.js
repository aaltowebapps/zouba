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
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  
  alert(lat + ', ' + lng);
  
  }
