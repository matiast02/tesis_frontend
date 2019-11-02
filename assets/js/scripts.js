/* google maps */
var map;
var markers = [];

// Initialize and add the map
function initMap() {

    //styling map
    var styledMapType = new google.maps.StyledMapType(
        [
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#242f3e"
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#746855"
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#242f3e"
                    }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#d59563"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#d59563"
                    }
                ]
            },
            {
                "featureType": "poi.business",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#263c3f"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#6b9a76"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#38414e"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#212a37"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9ca5b3"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#746855"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#1f2835"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#f3d19c"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#2f3948"
                    }
                ]
            },
            {
                "featureType": "transit.station",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#d59563"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#17263c"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#515c6d"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#17263c"
                    }
                ]
            }
        ], {name: 'Styled Map'});


    // The map, centered at Uluru
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -24.829028, lng: -65.428031},
        zoom: 15,
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                'styled_map']
        }
    });

    //get all gateways position
    $.ajax({
        url: 'http://localhost/tesis-backend/public/gateway',
        type: 'GET',
        success: function(gateways) {
            console.log('Gateways positions loaded');
            console.log(gateways);
            var Gateways = [];
            $.each(gateways, function (i, item){
                console.log(gateways[i].lat);
                // Gateways.push({
                //     position: new google.maps.LatLng(gateways[i].lat, gateways[i].long),
                //     type: 'gateway',
                //
                // });
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(gateways[i].lat, gateways[i].long),
                    icon: 'assets/images/markers/gateway.png',
                    animation:  google.maps.Animation.DROP,
                    map: map
                });
                var content = '<p><h5><b>' + gateways[i].nombre +  '</b></h5></p>' +
                               '<p>Frecuencia: '+ gateways[i].freq + '</p>' +
                               '<input type="hidden" id="nodo_id" value="'+ gateways[i].id +'" />'+
                               '<input type="hidden" id="gw_id" value="'+ gateways[i].gw_id +'" />'+
                               '<input type="hidden" id="tipo_nodo" value="gateway" />'+
                               '<p><i class="glyphicon glyphicon-eye-open"></i><a href="./gateway/'+ gateways[i].id  +'"> Ver</a></p>'+
                               '<p><button type="button" class="btn btn-info btn-labeled btn-lg legitRipple"  data-toggle="modal" data-target="#modal_form_edit"><b><i class="glyphicon glyphicon-pencil"></i></b> Editar</button></p>' +
                               '<p><button type="button" class="btn btn-danger btn-labeled btn-lg legitRipple"  onclick="clearMarkers();"><b><i class="glyphicon glyphicon-remove"></i></b> Eliminar</button></p>';

                var infowindow = new google.maps.InfoWindow()

                google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){
                    return function() {
                        infowindow.setContent(content);
                        infowindow.open(map,marker);
                    };
                })(marker,content,infowindow));



            });
        },
        error: function(data){
            var errors = data.responseJSON;
            // swal("Oops...", "Algo salio mal!", "error");
            $.each(errors, function(key,val){
                console.log(val);
            })
        }
    });


    $.ajax({
        url: 'http://localhost/tesis-backend/public/nodo',
        type: 'GET',
        success: function(nodos) {
            console.log('Nodos positions loaded');
            console.log(nodos);
            $.each(nodos, function (i, item){
                console.log(nodos[i].lat);
                // Gateways.push({
                //     position: new google.maps.LatLng(gateways[i].lat, gateways[i].long),
                //     type: 'gateway',
                //
                // });
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(nodos[i].lat, nodos[i].long),
                    icon: 'assets/images/markers/nodo.png',
                    animation:  google.maps.Animation.DROP,
                    map: map
                });
                var content = '<p><h5><b>' + nodos[i].nombre +  '</b></h5></p>' +
                    '<p>Frecuencia: '+ nodos[i].freq + '</p>' +
                 //   '<input type="hidden" id="nodo_id" value="'+ nodos[i].src +'" />'+
                    '<input type="hidden" id="nodo_id" value="'+ nodos[i].id +'" />'+
                    '<input type="hidden" id="gw_id" value="'+ nodos[i].gw_id +'" />'+
                    '<input type="hidden" id="tipo_nodo" value="sensor" />'+
                    '<p><i class="glyphicon glyphicon-eye-open"></i><a href="./nodo.html?id=' + nodos[i].id  +'"> Ver</a></p>'+
                    '<p><button type="button" class="btn btn-info btn-labeled btn-lg legitRipple" data-toggle="modal" data-target="#modal_form_edit" ><b><i class="glyphicon glyphicon-pencil"></i></b> Editar</button></p>' +
                    '<p><button type="button" class="btn btn-danger btn-labeled btn-lg legitRipple"  onclick="clearMarkers();"><b><i class="glyphicon glyphicon-remove"></i></b> Eliminar</button></p>';

                var infowindow = new google.maps.InfoWindow()

                google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){
                    return function() {
                        infowindow.setContent(content);
                        infowindow.open(map,marker);
                    };
                })(marker,content,infowindow));



            });
        },
        error: function(data){
            var errors = data.responseJSON;
            // swal("Oops...", "Algo salio mal!", "error");
            $.each(errors, function(key,val){
                console.log(val);
            })
        }
    });
    //.......................

    //
    // var icons = {
    //     gateway: {
    //         icon: 'assets/images/markers/gateway.png'
    //     },
    //     nodo: {
    //         icon: 'assets/images/markers/nodo.png'
    //     }
    // };
    //
    // var features = [
    //     {
    //         position: new google.maps.LatLng(-24.829028, -65.428031),
    //         type: 'gateway'
    //     }, {
    //         position: new google.maps.LatLng(-24.830990, -65.430899),
    //         type: 'nodo'
    //     }
    // ];
    //
    //
    //
    // // Create markers.
    // for (var i = 0; i < features.length; i++) {
    //     var marker = new google.maps.Marker({
    //         position: features[i].position,
    //         icon: icons[features[i].type].icon,
    //         animation:  google.maps.Animation.DROP,
    //         map: map
    //     });
    // };


    //add new marker
    map.addListener('click', function(event) {
        if (markers.length < 1) {
            addMarker(event.latLng);
            //add value to input
            document.getElementById('lat').value = event.latLng.lat();
            document.getElementById('long').value = event.latLng.lng();
            console.log(event.latLng.lat());
        }
    });

    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

}


// Adds a marker to the map and push to the array.
function addMarker(location) {

    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
    document.getElementById('lat').value = '';
    document.getElementById('long').value = '';
}

/* end google maps */

/* edit gateway */
//on change name
$('#nombre-dispositivo').keyup(function () {
    $('#device-title').text(this.value.toUpperCase());
});

//intercept form submit
$('#edit-gateway').submit(function(e){
    e.preventDefault();
    var tipo = $('#tipo_nodo').val();
    if( tipo == 'sensor'){
        $.ajax({
            url: 'http://localhost/tesis-backend/public/nodo/' + $('#id').val(),
            type: 'PUT',
            data: $(this).serialize(),
            success: function(data) {
                swal({title:"Listo", type:'success', text: "Datos actualizados!"});
                $('#modal_form_edit').modal('hide');
            },
            error: function(data){
                var errors = data.responseJSON;
                var err = [];
                $.each(errors, function(key,val){
                    err.push(val);
                    console.log(val);
                })
                swal("Oops...", err, "error");
            }
        });
    }else{
        $.ajax({
            url: 'http://localhost/tesis-backend/public/gateway/' + $('#id').val(),
            type: 'PUT',
            data: $(this).serialize(),
            success: function(data) {
                swal({title:"Listo", type:'success', text: "Datos actualizados!"});
                $('#modal_form_edit').modal('hide');
            },
            error: function(data){
                var errors = data.responseJSON;
                var err = [];
                $.each(errors, function(key,val){
                    err.push(val);
                    console.log(val);
                })
                swal("Oops...", err, "error");
            }
        });
    }

    
});
/* end edit gateway*/

//editar nodos sensores

$('#modal_form_edit').on('show.bs.modal', function() {
    var id = $('#nodo_id').val();
    var tipo = $('#tipo_nodo').val();

    loadNodo(id, tipo);
});


/* load data to edit gateway form */
function loadNodo(id, tipo){

    var url = 'http://localhost/tesis-backend/public/';

    if ( tipo == 'sensor'){
        url += 'nodo/' + id.toString();
        $('.modal-title').text('Editar Nodo Sensor');
    }else{
        url += 'gateway/' + id.toString();
        $('.modal-title').text('Editar Nodo Gateway');
    }

    console.log("cargando formulario");
   
    $.ajax({
        url: url,
        type: 'GET',
        success: function(data) {
            console.log("datos cargados");
            $('#device-title').text(data.nombre.toUpperCase());
            $('#nombre-dispositivo').val(data.nombre.toUpperCase());
            $('#id').val(data.id);
            $('#freq').val(data.freq);
            $('#lat').val(data.lat);
            $('#long').val(data.long);
            $('#edit_gw_id').val(data.gw_id.toString());
            $('#src').val(data.src);
            console.log(data.gw_id);
            
        },
        error: function(data){
            var errors = data.responseJSON;
            swal("Error", "No se pudieron traer los datos!", "error");
            $.each(errors, function(key,val){
                console.log(val);
            })
        }
    });

   
};
/* end load */

/* edit gateway */
function editGateway(id){
    loadGateway(id);
    $('#edit-gateway').show();
}


function countRegisters(){
    console.log('obteniendo total de registros...');
    //obtener cantidad de gateways, nodos y registros
    $.ajax({
        url: 'http://localhost/tesis-backend/public/count/total',
        type: 'GET',
        success: function(data) {
            console.log(data);
            $('#count-gateways').text(data.gateways);
            $('#count-nodes').text(data.nodes);
            $('#count-registers').text(data.registers);
        },
        error: function(data){
            var errors = data.responseJSON;
            // swal("Oops...", "Algo salio mal!", "error");
            $.each(errors, function(key,val){
                console.log(val);
            })
        }
    });
    setTimeout(countRegisters,30000);
}

countRegisters();

$('.panel').velocity('transition.slideUpIn', {
    stagger: 500
});




