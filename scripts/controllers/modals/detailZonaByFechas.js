(function () {
	'use-strict';

	angular
		.module('sonometerApp')
		.controller('detailZonaByFechasController', detailZonaByDayController)
		.factory('graphics', graphics);

	function detailZonaByDayController ($uibModalInstance, $uibModal, zona, turno, desde, hasta, $sails, graphics) {
		var detailZonaByFechas = this;

		detailZonaByFechas.datos = {
			zona: zona,
			turno: turno,
			desde: desde,
			hasta: hasta
		}
		
		detailZonaByFechas.cancel = function () {
			$uibModalInstance.close();
		}

		detailZonaByFechas.loadDatos = function () {
			var fecha_inicio = new Date(detailZonaByFechas.datos.desde)
			var fecha_fin = new Date(detailZonaByFechas.datos.hasta)
			
			$sails.get('/incidencia/data_range_fechas?inicio='+fecha_inicio.getFullYear()+'-'+(fecha_inicio.getMonth()+1)+'-'+fecha_inicio.getDate()+'&fin='+fecha_fin.getFullYear()+'-'+(fecha_fin.getMonth()+1)+'-'+fecha_fin.getDate()+'&zona_id='+detailZonaByFechas.datos.zona.zona_id+'&turno_id='+detailZonaByFechas.datos.turno.turno_id).success(function (data) {
				/* Cálculo del eje x */
				var xaxis = [], yaxis = [], promedio = 0;
				/* Cálculo del promedio y el semáforo */
				_.map(data, function (dia, key_dia) {
					xaxis.push(dia.dia);
					yaxis.push(dia.promedio);
					promedio += dia.promedio;
				});

				detailZonaByFechas.promedio = (promedio / data.length);
				detailZonaByFechas.porcentaje = (detailZonaByFechas.promedio < detailZonaByFechas.datos.turno.niveles[2].desde) ? 0 : ((detailZonaByFechas.promedio - detailZonaByFechas.datos.turno.niveles[2].desde) / detailZonaByFechas.datos.turno.niveles[2].desde) * 100;

				var series = [];

				series.push({
					name: detailZonaByFechas.datos.turno.turno,
					data: yaxis
				});

				var nivel = _.find(detailZonaByFechas.datos.turno.niveles, function (obj) {
					return (detailZonaByFechas.promedio >= obj.desde && detailZonaByFechas.promedio <= obj.hasta);
				});

				if (nivel) {
					detailZonaByFechas.semaforo = nivel.nivel;

					detailZonaByFechas.graphZonaDays = graphics.generateGraph('line', 'Datos de la zona desde '+fecha_inicio.getDate()+'/'+(fecha_inicio.getMonth() + 1)+'/'+fecha_inicio.getFullYear()+' '+fecha_fin.getDate()+'/'+(fecha_fin.getMonth() + 1)+'/'+fecha_fin.getFullYear(), xaxis, 'Decibelios (dB)', series, 'Gráfico N° 01 : ZONA');
				}
			}).error(function (error) {
				console.log(error);
			});
		}

		detailZonaByFechas.loadDatos();

		detailZonaByFechas.showDots = function () {
			var modalDtos = $uibModal.open({
				animation: true,
				templateUrl: 'views/pages/modals/dotsZonaDay.html',
				controller: 'dotsZonaDayController as dotsZonaDay',
				size: 'md',
				keyboard: true,
		      	resolve: {
		      		zona : function () {
		      			return zona
		      		},
		      		turno : function () {
		      			return turno
		      		},
		      		desde: function () {
		      			return desde
		      		},
		      		hasta: function () {
		      			return hasta
		      		},
					loadController: function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							files: [
								'scripts/controllers/modals/dotsZonaDayController.js'
							]
						});
					}
				}
		    });
		}

		$sails.on('incidencia', function (message) {
			switch (message.verb) {
				case 'created':
					if (message.data.zona_id == detailZonaByDay.datos.zona.zona_id) {
						detailZonaByDay.loadDatos();
					}
					break;
				case 'destroyed':
					if (message.data.zona_id == detailZonaByDay.datos.zona.zona_id) {
						detailZonaByDay.loadDatos();
					}
					break;
			}
		});
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