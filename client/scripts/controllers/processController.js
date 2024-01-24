(function () {
	'use-strict';

	angular
		.module('sonometerApp')
		.controller('processController', processController);

	function processController ($http, $sails, geolocation, messageFactory) {
		var process = this;

		process.users = [];
		process.coordinates = {};

		process.getPosition = function () {
			geolocation.getLocation().then(function(data){
				process.coordinates = {latitude : data.coords.latitude, longitude: data.coords.longitude};
				process.getWeather();
			});
		};

		process.getWeather = function (argument) {
			$http.get('http://api.openweathermap.org/data/2.5/weather?lat='+process.coordinates.latitude+'&lon='+process.coordinates.longitude+'&units=metric&appid=6067430073e9557d58a3c2b583e6d4bb').success(function (data) {
				process.weather = data;
				process.getZones();
				process.getTurnos();
				process.getFactores();
			}).error(function (error) {
				console.log(error);
			});
		}

		process.initialize = function () {
			process.getPosition();
		}

		process.getZones = function () {
			$sails.get("/zona").success(function (data) {
				process.zones = data;
				console.log(data);
			}).error(function (response) { console.log('error');});
		}

		process.getTurnos = function () {
			$sails.get("/turno").success(function (data) {
				process.turnos = data;
			}).error(function (response) { console.log('error');});
		}

		process.getFactores = function () {
			$sails.get("/factor").success(function (data) {
				process.factores = data;
			}).error(function (response) { console.log('error');});
		}

		$sails.on('zona', function (message) {
			switch (message.verb) {
				case 'created':
					process.zones.push(message.data);
					break;
				case 'updated':
					var zona = _.find(process.zones, function (obj) { return obj.zona_id === message.id; });

					if (zona) {
						zona.zona = message.data.zona;
					}

					break;
				case 'destroyed':
					process.zones = _.without(process.zones, _.findWhere(process.zones, {zona_id: message.id}));
					break;
			}
		});

		process.initialize();

		process.saveIncidencia = function () {
			var hoy = new Date();

			var turno = _.find(process.turnos, function (obj) {
				var aux_inicio = new Date(hoy.getFullYear() + '-' + (hoy.getMonth() + 1 ) + '-' + hoy.getDate() + ' ' + obj.hora_inicio).getTime();

				var aux_fin = new Date(hoy.getFullYear() + '-' + (hoy.getMonth() + 1 ) + '-' + hoy.getDate() + ' ' + obj.hora_fin).getTime();

				return (hoy.getTime() >= aux_inicio && hoy.getTime() <= aux_fin); 
			});

			if (turno) {
				var nivel = _.find(turno.niveles, function (obj) {
					return (process.sonometro >= obj.desde && process.sonometro <= obj.hasta);
				});

				if (nivel) {
					var formData = {
						latitud: process.coordinates.latitude,
						longitud: process.coordinates.longitude,
						temperatura: process.weather.main.temp,
						humedad: process.weather.main.humidity,
						suelo_nivel: process.weather.main.grnd_level,
						mar_nivel: process.weather.main.sea_level,
						velocidad_viento: process.weather.wind.speed,
						sonometro: process.sonometro,
						zona_id: process.zona.zona_id,
						nivel_id: nivel.nivel_id,
						factor_id: process.factor.factor_id,
						turno_id: turno.turno_id
					}

					$sails.post("/incidencia", formData).success(function (data) {
						if (angular.isDefined(data.incidencia_id)) {
							messageFactory.message('Se registró la incidencia correctamente');

							process.zona = "";
							process.factor = "";
							process.sonometro = "";
						} else {
							messageFactory.message('No se pudo registrar la encomienda');
						}
					}).error(function (error) {
						messageFactory.message('No se pudo registrar la encomienda');
					});
				} else {
					messageFactory.message('La medida capturada no está en los rangos establecidos');
				}
			} else {
				messageFactory.message('No se encuentra en el horario establecido para las mediciones');
			}
		}
	}
})();