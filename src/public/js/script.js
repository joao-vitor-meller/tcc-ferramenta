function initialize() {
    
  var map;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else { 
    x.innerHTML = "Geolocation is not supported by this browser.";
  }

  function showPosition(position) {
    var myLatLng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
    var mapOptions = {
      zoom: 17,
      center: myLatLng,
      mapTypeId: 'satellite'
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
    map.setTilt(45);
 
    // Polygon Coordinates
    var triangleCoords = [
      new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
      new google.maps.LatLng(position.coords.latitude+0.001,position.coords.longitude+0.001),
      new google.maps.LatLng(position.coords.latitude,position.coords.longitude+0.002),
    ];
      
    // Styling & Controls
    myPolygon = new google.maps.Polygon({
      paths: triangleCoords,
      draggable: true, // turn off if it gets annoying
      editable: true,
      strokeColor: '#00FF00',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#00FF00',
      fillOpacity: 0.15
    });

    cidade(position.coords.latitude,position.coords.longitude)
    myPolygon.setMap(map);
    //google.maps.event.addListener(myPolygon, "dragend", getPolygonCoords);
    google.maps.event.addListener(myPolygon.getPath(), "insert_at", getPolygonCoords);
    //google.maps.event.addListener(myPolygon.getPath(), "remove_at", getPolygonCoords);
    google.maps.event.addListener(myPolygon.getPath(), "set_at", getPolygonCoords);
   }

}

//Display Coordinates below map
function getPolygonCoords() {
  clearTimeout(time);
  var bounds = new google.maps.LatLngBounds();
  var len = myPolygon.getPath().getLength();
  var htmlStr = "";
  var X = [];
  var Y = [];
  for (var i = 0; i < len; i++) {
    htmlStr += "(" + myPolygon.getPath().getAt(i).toUrlValue(5) + "), \n";
    X.push(
        myPolygon.getPath().getAt(i).lat() 
    );
    Y.push(
        myPolygon.getPath().getAt(i).lng()
    );
    if(i>=1){
      bounds.extend(myPolygon.getPath().getAt(i));
    }
    
  }

  var time = setTimeout(function(){ cidade(bounds.getCenter().lat(),bounds.getCenter().lng()) }, 10000);

  var hectare = (google.maps.geometry.spherical.computeArea(myPolygon.getPath()) / 10000).toFixed(3);
  var m = google.maps.geometry.spherical.computeArea(myPolygon.getPath()).toFixed(0);

  $("#m").val(m);
  $("#hectare").val(hectare);
  $("#info").val(htmlStr);

  $("#mCalc").val(m);
  $("#hectareCalc").val(hectare);
  $("#infoCalc").val(htmlStr);
}

function deletes() {
  myPolygon.setMap(null);
}

function addLine() {
  myPolygon.setMap(map);
}


function cidade(lat,lgn) {
    var urlStr = "http://servicos.cptec.inpe.br/XML/cidade/7dias/"+ lat +"/"+ lgn +"/previsaoLatLon.xml";
       
    $.ajax({
        url : urlStr,
        type : "get",
        dataType : "xml",
        success : function(xml){
          $(xml).find('cidade').each(function(){
              var titulo = $(this).find('nome').text();
              $("#txtCidadeLogo").html(titulo);
              $("#txtCidade").val(titulo);
              $("#txtCidadeCalc").val(titulo);
          });
        },
        error : function(erro){
            console.log(erro);
        }
    });
}

/*
function cidade(lat,lgn) {
    var urlStr = "https://nominatim.openstreetmap.org/reverse?&format=xml&lat="+lat+"&lon="+lgn+"&zoom=27&addressdetails=1";
       
    $.ajax({
        url : urlStr,
        type : "get",
        dataType : "xml",
        success : function(xml){
          $(xml).find('addressparts').each(function(){
              var titulo = $(this).find('city').text();
              if(titulo == null){
                var titulo = $(this).find('town').text(); // RETORNA CIDADE
              }
              if(titulo == null){
                var titulo = $(this).find('city_district').text(); // RETORNA CIDADE
              }
              $("#txtCidadeLogo").html(titulo);
              $("#txtCidade").val(titulo);
          });
        },
        error : function(erro){
            console.log(erro);
        }
    });
*/

  function busca_por_cidade(place) {
    if (place.trim() == '') {
        return;
    }
    $.ajax({url: "https://nominatim.openstreetmap.org/search?" +
        "q=" + place + "&format=jsonv2&addressdetails=1", success: function(result) {
        if (result[0]) {
            if ((result[0].lat) && (result[0].lon)) {
              var city = result[0].address.city; // RETORNA CIDADE
              if(city == null){
                var city = result[0].address.town; // RETORNA CIDADE
              }
              if(city == null){
                var city = result[0].address.city_district; // RETORNA CIDADE
              }
              $("#txtCidade").val(city);
              $("#txtCidadeCalc").val(city);
              $("#txtCidadeLogo").html(city);
              buscaPosition(result[0].lat,result[0].lon);
            }
        } else {
            console.log("showAddress not found");
            trackClickEvent('button_location_search','location_not_found');
        }
    }});
  }

  function buscaPosition(lat,lgn) {
    var myLatLng = new google.maps.LatLng(lat,lgn);
    var mapOptions = {
      zoom: 17,
      center: myLatLng,
      mapTypeId: 'satellite'
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
    map.setTilt(45);
 
    // Polygon Coordinates
    var triangleCoords = [
      new google.maps.LatLng(lat,lgn),
      new google.maps.LatLng(lat-0.001, lgn-0.001),
      new google.maps.LatLng(lat, lgn-0.002),
    ];
      
    // Styling & Controls
    myPolygon = new google.maps.Polygon({
      paths: triangleCoords,
      draggable: true, // turn off if it gets annoying
      editable: true,
      strokeColor: '#00FF00',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#00FF00',
      fillOpacity: 0.15
    });

    myPolygon.setMap(map);
    //google.maps.event.addListener(myPolygon, "dragend", getPolygonCoords);
    google.maps.event.addListener(myPolygon.getPath(), "insert_at", getPolygonCoords);
    //google.maps.event.addListener(myPolygon.getPath(), "remove_at", getPolygonCoords);
    google.maps.event.addListener(myPolygon.getPath(), "set_at", getPolygonCoords);
   }


   function arrendondar(string){
      alert(string);
     Math.round(string);
     $("#arredondar").val(city);
   }


  function rolar(){
    window.location.href='#frame';
  }
   