(function () {
	'use-strict';

	angular
		.module('sonometerApp')
		.controller('dotsZonaDayController', dotsZonaDayController);

	function dotsZonaDayController ($uibModalInstance, NgMap, $timeout, zona, turno, desde, hasta, $sails) {
		var dotsZonaDay = this;

		dotsZonaDay.datos = {
			zona: zona,
			turno: turno,
			desde: desde,
			hasta: hasta
		}

		dotsZonaDay.loadDots = function () {
			var fecha_inicio = new Date(dotsZonaDay.datos.desde);
			var fecha_fin = new Date(dotsZonaDay.datos.hasta);
			
			$sails.get('/incidencia/dots_range?inicio='+fecha_inicio.getFullYear()+'-'+(fecha_inicio.getMonth()+1)+'-'+fecha_inicio.getDate()+'&fin='+fecha_fin.getFullYear()+'-'+(fecha_fin.getMonth()+1)+'-'+fecha_fin.getDate()+'&zona_id='+dotsZonaDay.datos.zona.zona_id+'&turno_id='+dotsZonaDay.datos.turno.turno_id).success(function (data) {
				dotsZonaDay.dots = data;
			}).error(function (error) {
				console.log(error);
			});
		}

		dotsZonaDay.cancel = function () {
			$uibModalInstance.close();
		}

		dotsZonaDay.initMap = function(mapId) {
			NgMap.initMap(mapId);

			NgMap.getMap({ id : 'dots' }).then(function(map) {
				dotsZonaDay.map = map;
			});
		}

		$timeout(function() {
			dotsZonaDay.initMap('dots');
			dotsZonaDay.loadDots();
		}, 500);

		dotsZonaDay.showDetailsIncidente = function (event, data) {
			var infowindow = new google.maps.InfoWindow();
	        var center = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());

	        var fecha = new Date(data.hora_incidencia);

	        infowindow.close();

	        infowindow.setContent(
	            '<h4 class="text-center">Datos del marcador</h4>'+
                '<b>Longitud : </b>'+data.longitud+'<br />'+
                '<b>Latitud : </b>'+data.latitud+'<br />'+
                '<b>Humedad : </b>'+data.humedad+'%<br />'+
                '<b>Temperatura : </b>'+data.temperatura+'°C<br />'+
                '<b>Velocidad Viento : </b>'+data.velocidad_viento+'Km/h<br />'+
                '<b>Sonómetro : </b>'+data.sonometro+'dB<br />'+
                '<b>Fecha y Hora : '+fecha.getDate()+'/'+(fecha.getMonth() + 1)+'/'+fecha.getFullYear()+' '+dotsZonaDay.zPad(fecha.getHours(), 2)+':'+dotsZonaDay.zPad(fecha.getMinutes(), 2)+':'+dotsZonaDay.zPad(fecha.getSeconds(), 2)+'</b>');

	        infowindow.setPosition(center);
	        infowindow.open(dotsZonaDay.map);
		}

		dotsZonaDay.zPad = function (n, width, z) {
			z = z || '0';
			n = n + '';
			return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
		}

		$sails.on('incidencia', function (message) {
			switch (message.verb) {
				case 'created':
					if (message.data.zona_id == dotsZonaDay.datos.zona.zona_id) {
						dotsZonaDay.loadDots();
					}
					break;
				case 'destroyed':
					if (message.data.zona_id == dotsZonaDay.datos.zona.zona_id) {
						dotsZonaDay.loadDots();
					}
					break;
			}
		});
	}
})();