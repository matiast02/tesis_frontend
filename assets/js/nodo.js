var url_string =  window.location.href;
var url = new URL(url_string);
var id = url.searchParams.get('id');

console.log(id);



//chart
$(document).ready(function(){

    var co_char = echarts.init(document.getElementById('co_level'));
    var co_level;

    optionLast = {
        tooltip : {
            formatter: "{a} <br/>{b} : {c}%"
        },
        toolbox: {
            feature: {
                restore: {},
                saveAsImage: {}
            }
        },
        series: [
            {
                name: 'CO PPM',
                type: 'gauge',
                detail: {formatter:'{value}PPM'},
                data: [{value: 50, name: 'CO PPM'}],
                max: 15.4,
                splitNumber: 3.5,
                axisLine: {
                    lineStyle: {
                        color: [[0.285, '#29B647'], [0.61, '#E8CF00'], [0.805, '#FA690B'],[1, '#c23531']],
                    } 
                    
                },
            }
        ]
    };

    //first request to get co level's
    $.ajax({
        url: 'http://localhost/tesis-backend/public/nodo/lastMeasure',
        type: 'POST',
        data: { id: id},
        success: function(data) {
           co_level = data.co;
           optionLast.series[0].data[0].value = co_level;
           co_char.setOption(optionLast, true);
           $('#fecha_ultimo').text(data.created_at.substring(0,10));
           $('#hora_ultimo').text(data.created_at.substring(12,19));
           $('#co').text(data.co);
           $('#tc').text(data.tc.substring(0,2) + '°');
           $('#humedad').text(data.hu.substring(0,2) + '%');
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

    //make request co levels each 30 sec
    setInterval(function () {

        $.ajax({
            url: 'http://localhost/tesis-backend/public/nodo/lastMeasure',
            type: 'POST',
            data: { id: id},
            success: function(data) {
               co_level = data.co;
               $('#fecha_ultimo').text(data.created_at.substring(0,10));
               $('#hora_ultimo').text(data.created_at.substring(12,19));
               $('#co').text(data.co);
               $('#tc').text(data.tc.substring(0,2) + '°');
               $('#humedad').text(data.hu.substring(0,2) + '%');
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
        optionLast.series[0].data[0].value = co_level;
        co_char.setOption(optionLast, true);
    },30000);
//----------------------------------------------------------------------
    //co 24 level
    var co_24level  = echarts.init(document.getElementById('co_24level'));
    var co_total  = echarts.init(document.getElementById('co_semanal'));
    var chart_tc  = echarts.init(document.getElementById('tc_semanal'));
    var fecha24hs;
    var nivel24hs;
    var listaFechas = [];
    var listaCo     = [];
    var listaTc     = [];

    function setArray(array, data){
        array.push(data);
    }

    option24Level = {
        tooltip : {
            formatter: "CO {c} <br/>Hora {b}"
        },
        xAxis: {
            type: 'category',
            data: listaFechas
        },
        yAxis: {
            type: 'value'
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 10
        }, {
            start: 0,
            end: 10,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }],
        series: [{
            data: listaCo,
            type: 'line',
            smooth: true
        }]
    };

    var option_total = {
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: false
                },
                saveAsImage: {
                    pixelRatio: 2
                }
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            bottom: 90
        },
        dataZoom: [{
            type: 'inside'
        }, {
            type: 'slider'
        }],
        xAxis: {
            data: listaFechas,
            silent: false,
            splitLine: {
                show: false
            },
            splitArea: {
                show: false
            }
        },
        yAxis: {
            splitArea: {
                show: false
            }
        },
        series: [{
            type: 'bar',
            data: listaCo,
            // Set `large` for large data amount
            large: true
        }]
    };

  
    
    
    $.ajax({
        url: 'http://localhost/tesis-backend/public/nodo/coMeasure24/' + id,
        type: 'GET',
        success: function(data) {
            $.each(data, function(index, value){
                var date = new Date(value.created_at);
                date.setHours(date.getHours() - 3);//substract 3 hs
                fecha = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
                setArray(listaCo,value.co);
                setArray(listaFechas, fecha);
                setArray(listaTc, value.tc );
                
            });
            console.log(listaCo);
           co_24level.setOption(option24Level, true);
          

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

    //make request 24 hs co levels each 30 sec
    setInterval(function () {
        //clear arrays
        listaCo = [];
        listaFechas = [];
        $.ajax({
            url: 'http://localhost/tesis-backend/public/nodo/coMeasure24/' + id,
            type: 'GET',
            success: function(data) {
                $.each(data, function(index, value){
                    setArray(listaCo,value.co);
                    setArray(listaFechas, value.created_at.substring(12,19));                    
                });
                co_24level.setOption(option24Level, true);
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
       
    },72000);
//-------------------------------------------------------
// get avg of CO each 8hs
$.ajax({
    url: 'http://localhost/tesis-backend/public/nodo/promedio8hs/' + id,
    type: 'GET',
    success: function(data) {
       $('#promedio8hs').text(data.substring(0,3) + ' PPM.');
       console.log('promedio ' + data);
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

//make request 24 hs co levels each 30 sec
setInterval(function () {

    $.ajax({
        url: 'http://localhost/tesis-backend/public/nodo/promedio8hs/' + id,
        type: 'GET',
        success: function(data) {
            $('#promedio8hs').text(data.substring(0,3) + ' PPM.');           
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
   
},72000);

//---- week co and tc charts
var option_tc = {
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: false
            },
            saveAsImage: {
                pixelRatio: 2
            }
        }
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    grid: {
        bottom: 90
    },
    dataZoom: [{
        type: 'inside'
    }, {
        type: 'slider'
    }],
    xAxis: {
        data: listaFechas,
        silent: false,
        splitLine: {
            show: true
        },
        splitArea: {
            show: false
        }
    },
    yAxis: {
        splitArea: {
            show: false
        }
    },
    series: [{
        type: 'bar',
        data: listaTc,
        // Set `large` for large data amount
        large: true
    }]
};



$.ajax({
    url: 'http://localhost/tesis-backend/public/nodo/semanal/' + id,
    type: 'GET',
    success: function(data) {
        $.each(data, function(index, value){
            var date = new Date(value.created_at);
            date.setHours(date.getHours() - 3);//substract 3 hs
            fecha = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
            setArray(listaCo,value.co);
            setArray(listaFechas, fecha);
            setArray(listaTc, value.tc );
            
        });
       co_total.setOption(option_total,true);
       chart_tc.setOption(option_tc,true);
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


//resize charrts
    window.onresize = function () {
        setTimeout(function () {
            co_char.resize();
            co_24level.resize();
            co_total.resize();
            chart_tc.resize();
          
        }, 200);
    }
    
});


//---- map for node position
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

  


    $.ajax({
        url: 'http://localhost/tesis-backend/public/nodo/' + id,
        type: 'GET',
        success: function(nodo) {
            console.log('Nodos positions loaded');
            console.log(nodo);
            $('#nombre-sensor').text(nodo.nombre);
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(nodo.lat, nodo.long),
                icon: 'assets/images/markers/nodo.png',
                animation:  google.maps.Animation.DROP,
                map: map
            });
            var content = '<p><h5><b>' + nodo.nombre +  '</b></h5></p>' +
                '<p>Frecuencia: '+ nodo.freq + '</p>' +
             //   '<input type="hidden" id="nodo_id" value="'+ nodos[i].src +'" />'+
                '<input type="hidden" id="nodo_id" value="'+ nodo.id +'" />'+
                '<input type="hidden" id="gw_id" value="'+ nodo.gw_id +'" />'+
                '<input type="hidden" id="tipo_nodo" value="sensor" />'+
                '<p><i class="glyphicon glyphicon-eye-open"></i><a href="./nodo.html?id=' + nodo.id  +'"> Ver</a></p>'+
                '<p><button type="button" class="btn btn-info btn-labeled btn-lg legitRipple" data-toggle="modal" data-target="#modal_form_edit" ><b><i class="glyphicon glyphicon-pencil"></i></b> Editar</button></p>' +
                '<p><button type="button" class="btn btn-danger btn-labeled btn-lg legitRipple"  onclick="clearMarkers();"><b><i class="glyphicon glyphicon-remove"></i></b> Eliminar</button></p>';

            var infowindow = new google.maps.InfoWindow()

            google.maps.event.addListener(marker,'click', (function(marker,content,infowindow){
                return function() {
                    infowindow.setContent(content);
                    infowindow.open(map,marker);
                };
            })(marker,content,infowindow));

          
        },
        error: function(data){
            var errors = data.responseJSON;
            // swal("Oops...", "Algo salio mal!", "error");
            $.each(errors, function(key,val){
                console.log(val);
            })
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


