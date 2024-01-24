(function () {
	'use-strict';

	angular
		.module('sonometerApp')
		.controller('dashboardController', dashboardController)
		.factory('graphics', graphics);

	function dashboardController ($sails, NgMap, graphics, $uibModal) {
		var dashboard = this;

		dashboard.dynMarkers = [];
		dashboard.loadMap = function () {
			NgMap.getMap().then(function(map) {
				dashboard.map = map;

				/*if (angular.isDefined(dashboard.incidencias)) {
					for (var i=0; i<dashboard.incidencias.length; i++) {
						var latLng = new google.maps.LatLng(dashboard.incidencias[i].latitud, dashboard.incidencias[i].longitud);
						dashboard.dynMarkers.push(new google.maps.Marker({
																			position:latLng,
																			animation: google.maps.Animation.DROP
																		}));
					}
					
					dashboard.markerClusterer = new MarkerClusterer(map, dashboard.dynMarkers, {});
				}*/
			});
		}

		dashboard.getMarkers = function () {
			$sails.get('/incidencia'+((angular.isDefined(dashboard.zona) && dashboard.zona !== null) ? '?zona_id=' + dashboard.zona.zona_id : '')+((angular.isDefined(dashboard.zona) && dashboard.zona !== null) ? '&' : '?')+'limit=50&sort=hora_incidencia DESC').success(function (data) {
				dashboard.incidencias = data;
				dashboard.loadMap();
			}).error(function (error, data) {
				console.log(data);
			});
		}

		dashboard.getDepartamentos = function () {
			$sails.get('/departamento').success(function (data) {
				dashboard.departamentos = data;
			}).error(function (error) {
				console.log(error);
			});
		}

		dashboard.loadProvincias = function () {
			if (dashboard.departamento !== null) {
				var departamento = _.find(dashboard.departamentos, function(obj) { return obj.departamento_id === dashboard.departamento.departamento_id; });

				if (departamento) {
					dashboard.provincias = departamento.provincias;
					dashboard.distritos = null;
				}
			}
		}

		dashboard.loadDistritos = function () {
			if (angular.isDefined(dashboard.provincia) && dashboard.provincia !== null) {
				$sails.get('/distrito?provincia_id='+dashboard.provincia.provincia_id).success(function (data) {
					dashboard.distritos = data;
				}).error(function (error) {
					console.log(error);
				});
			}
		}

		dashboard.loadZonas = function () {
			var distrito = _.find(dashboard.distritos, function(obj) { return obj.distrito_id === dashboard.distrito.distrito_id; });

			if (distrito) {
				dashboard.zonas = distrito.zonas;

				dashboard.getMarkers();
				dashboard.zonaDemanda();
			}
		}

		dashboard.status = {};

		dashboard.today = function() {
			dashboard.dt_desde = new Date();
			dashboard.dt_hasta = new Date();
		}

		dashboard.open = function($event, band) {
			if (band == 'dt_hasta') {
				dashboard.status.opened_dt_hasta = true;
			} else if (band == 'dt_desde') {
				dashboard.status.opened_dt_desde = true;
			}
		}

		dashboard.disabled = function(date, mode) {
			return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
		}

		dashboard.generateGraphZona = function () {
			var xaxis = [];
			var datos = [];

			$sails.get('/incidencia/data_last_week?zona_id='+dashboard.zona.zona_id).success(function (data) {
				dashboard.bandera = data;

				var data_extra = _.groupBy(data, function (obj) {
					return obj.dia;
				});

				/**
					Cargar datos en el eje x;
				*/

				var series = [];

				_.map(data_extra, function (value, key) {
					xaxis.push(key);

					_.map(value, function (turno) {
						series.push(turno);
					});
				});

				/*--------------------------*/

				/**
					Cargar datos de turnos por dia
				*/

				var data_series = _.groupBy(series, function (obj) {
					return obj.turno;
				});

				_.map(data_series, function (turno, key_turno) {
					var promedio_axis = [];
					_.map(xaxis, function (dia) {
						var promedio = _.find(turno, function (promedio) {
							return promedio.dia == dia;
						});						

						if (promedio) {
							promedio_axis.push(promedio.promedio);
						} else {
							promedio_axis.push(0);
						}
					});

					datos.push({
						name: key_turno,
						data: promedio_axis
					});
				});

				dashboard.graphZona = graphics.generateGraph('column', 'Datos de la última semana', xaxis, 'Decibelios (dB)', _.sortBy(datos, 'name'), 'Gráfico N° 01 : ZONA');
			}).error(function (error) {
				console.log(error);
			});
		}

		dashboard.countIncidencias = function () {
			$sails.get('/incidencia/count_incidencias').success(function (data) {
				dashboard.total_incidencias = data;
			}).error(function (error, data) {
				dashboard.total_incidencias = data;
			});
		}

		dashboard.zonaDemanda = function () {
			$sails.get('/incidencia/zona_demandada').success(function (data) {
				dashboard.zona_demandada = data[0];
			}).error(function (error, data) {
				console.log(error);
			});
		}

		dashboard.initialize = function () {
			dashboard.getDepartamentos();
			dashboard.today();
			dashboard.loadMap();
			dashboard.countIncidencias();
		}

		dashboard.initialize();

		dashboard.showDetailsPolygon = function (event, data) {
			dashboard.map.hideInfoWindow('marker');
			dashboard.map.hideInfoWindow('zone');
			
			dashboard.zone = data;
			dashboard.zone.position = event.latLng.lat() + ',' + event.latLng.lng();
			dashboard.map.showInfoWindow('zone', this);
		}

		dashboard.showDetailsMarker = function (event, data) {
			dashboard.map.hideInfoWindow('marker');
			dashboard.map.hideInfoWindow('zone');
			
			dashboard.marker = data;
			dashboard.map.showInfoWindow('marker', this);
		}

		$sails.on('incidencia', function (message) {
			switch (message.verb) {
				case 'created':
					dashboard.incidencias.push(message.data);
					dashboard.alert = message;

					if (message.data.zona_id == dashboard.zona.zona_id) {
						dashboard.generateGraphZona();
						dashboard.loadZona();
					}
					break;
				case 'destroyed':
					process.zones = _.without(process.zones, _.findWhere(process.zones, {zona_id: message.id}));

					if (message.data.zona_id == dashboard.zona.zona_id) {
						dashboard.generateGraphZona();
						dashboard.loadZona();
					}
					break;
			}
		});

		dashboard.loadZona = function () {
			$sails.get('/zona?zona_id='+dashboard.zona.zona_id).success(function (data) {
				dashboard.zona_seleccionada_auxiliar = data[0];
				dashboard.loadTurnos();
			}).error(function (error) {
				console.log(error);
			});
		}

		dashboard.loadTurnos = function () {
			$sails.get('/turno').success(function (data) {
				dashboard.turnos = data;
			}).error(function (error) {
				console.log(error);
			});
		}

		dashboard.loadZonaId = function (zona_id) {
			if (angular.isDefined(dashboard.zona) && dashboard.zona !== null) {
				var zona =  _.find(dashboard.zonas, function(obj) { return obj.zona_id === (zona_id ? zona_id : dashboard.zona.zona_id); });

				if (zona) {
					dashboard.zona = {};
					dashboard.zona_seleccionada = [];
					dashboard.zona_seleccionada.push(zona);
					dashboard.zona.zona_id = zona.zona_id;

					dashboard.getMarkers();
					dashboard.generateGraphZona();
					dashboard.loadZona();
				}
			} else {
				dashboard.getMarkers();
			}
		}

		dashboard.showDetailZona = function () {
			var modalZone = $uibModal.open({
				animation: true,
				templateUrl: (dashboard.dt_desde.getTime() == dashboard.dt_hasta.getTime()) ? 'views/pages/modals/detailZonaByDay.html' : 'views/pages/modals/detailZonaByFechas.html',
				controller: (dashboard.dt_desde.getTime() == dashboard.dt_hasta.getTime()) ? 'detailZonaByDayController as detailZonaByDay' : 'detailZonaByFechasController as detailZonaByFechas',
				size: 'lg',
				backdrop: true,
				keyboard: false,
		      	resolve: {
		      		zona : function () {
		      			return dashboard.zona_seleccionada_auxiliar
		      		},
		      		turno : function () {
		      			return dashboard.turno
		      		},
		      		desde: function () {
		      			return dashboard.dt_desde
		      		},
		      		hasta: function () {
		      			return dashboard.dt_hasta
		      		},
					loadController: function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							files: [
								(dashboard.dt_desde.getTime() == dashboard.dt_hasta.getTime()) ? 'scripts/controllers/modals/detailZonaByDay.js' : 'scripts/controllers/modals/detailZonaByFechas.js'
							]
						});
					}
				}
		    });
		}
	}

	function graphics() {
		var servicio = {
		    generateGraph : function (type, subtitle, xaxis, ytitle, series, title) {
				var graph = {
					options: {
					  chart: {
					    type: type,
					    zoomType: 'x'
					  },
					  plotOptions: {
					    line: {
					        dataLabels: {
					            enabled: true
					        }
					    }
					  }
					},
					subtitle: {
					    text: subtitle
					},
					xAxis: {
					  categories: xaxis
					},
					yAxis: {
					    title: {
					        text: ytitle
					    }
					},
					series: series,
					title: {
					  text: title
					},
					credits: {
					  enabled: false
					},
					rangeSelector: {
		                enabled: true
		            },
		            navigator: {
		                enabled: true
		            }
				};

				return graph;
		    }
	  };

	  return servicio;
	}
})();