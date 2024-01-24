(function () {
	'use-strict';

	angular
		.module('sonometerApp')
		.controller('graphComparativeController', graphComparativeController)
		.factory('graphics', graphics);

	function graphComparativeController ($uibModalInstance, $uibModal, desde, hasta, $sails, graphics) {
		var graphComparative = this;

		graphComparative.datos = {
			desde: desde,
			hasta: hasta
		}

		graphComparative.cancel = function () {
			$uibModalInstance.close();
		}

		graphComparative.zonas = function () {
			var xaxis = [];
			var datos = [];

			$sails.get('/zona/comparative_zonas?inicio='+desde.getFullYear()+'-'+(desde.getMonth()+1)+'-'+desde.getDate()+'&fin='+hasta.getFullYear()+'-'+(hasta.getMonth()+1)+'-'+hasta.getDate()).success(function (data) {
				var data_extra = _.groupBy(data, function (obj) {
					return obj.dia;
				});

				var data_zonas = _.groupBy(data, function (obj) {
					return obj.zona;
				});;

				var zonas_totales = [];
				var colors = ['danger', 'success', 'warning', 'info', 'primary', 'default'];

				_.map(data_zonas, function (value, key) {
					var promedio = 0;
					_.map(value, function (value, key) {
						promedio += value.promedio;
					})

					zonas_totales.push({
						zona: key,
						total: promedio,
						color: colors[Math.floor(Math.random() * colors.length)]
					});
				});

				graphComparative.zonas_totales = zonas_totales;

				/**
					Cargar datos en el eje x;
				*/

				var series = [];

				_.map(data_extra, function (value, key) {
					xaxis.push(key);

					_.map(value, function (zona) {
						series.push(zona);
					});
				});

				/*--------------------------*/

				/**
					Cargar datos de turnos por dia
				*/

				var data_series = _.groupBy(series, function (obj) {
					return obj.zona;
				});

				_.map(data_series, function (zona, key_zona) {
					var promedio_axis = [];
					_.map(xaxis, function (dia) {
						var promedio = _.find(zona, function (promedio) {
							return promedio.dia == dia;
						});						

						if (promedio) {
							promedio_axis.push(promedio.promedio);
						} else {
							promedio_axis.push(0);
						}
					});

					datos.push({
						name: key_zona,
						data: promedio_axis
					});
				});

				graphComparative.graphZona = graphics.generateGraph('line', 'Datos comparativos de zonas', xaxis, 'Incidencias (UND)', _.sortBy(datos, 'name'), 'Gráfico N° 01 : COMPARATIVO ZONAS');
			}).error(function (err) {
				console.log(err);
			});
		}

		graphComparative.turnos = function () {
			var xaxis = [];
			var datos = [];

			$sails.get('/turno/comparative_turnos?inicio='+desde.getFullYear()+'-'+(desde.getMonth()+1)+'-'+desde.getDate()+'&fin='+hasta.getFullYear()+'-'+(hasta.getMonth()+1)+'-'+hasta.getDate()).success(function (data) {
				var data_extra = _.groupBy(data, function (obj) {
					return obj.dia;
				});

				var data_turnos = _.groupBy(data, function (obj) {
					return obj.turno;
				});;

				var turnos_totales = [];
				var colors = ['danger', 'success', 'warning', 'info', 'primary', 'default'];

				_.map(data_turnos, function (value, key) {
					var promedio = 0;
					_.map(value, function (value, key) {
						promedio += value.promedio;
					})

					turnos_totales.push({
						turno: key,
						total: promedio,
						color: colors[Math.floor(Math.random() * colors.length)]
					});
				});

				graphComparative.turnos_totales = turnos_totales;

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

				graphComparative.graphTurno = graphics.generateGraph('area', 'Datos comparativos de turnos', xaxis, 'Incidencias (UND)', _.sortBy(datos, 'name'), 'Gráfico N° 02 : COMPARATIVO TURNOS');
			}).error(function (err) {
				console.log(err);
			});
		}

		graphComparative.factores = function () {
			var xaxis = [];
			var datos = [];

			$sails.get('/factor/comparative_factores?inicio='+desde.getFullYear()+'-'+(desde.getMonth()+1)+'-'+desde.getDate()+'&fin='+hasta.getFullYear()+'-'+(hasta.getMonth()+1)+'-'+hasta.getDate()).success(function (data) {
				var data_extra = _.groupBy(data, function (obj) {
					return obj.dia;
				});

				var data_factores = _.groupBy(data, function (obj) {
					return obj.factor;
				});;

				var factores_totales = [];
				var colors = ['danger', 'success', 'warning', 'info', 'primary', 'default'];

				_.map(data_factores, function (value, key) {
					var promedio = 0;
					_.map(value, function (value, key) {
						promedio += value.promedio;
					})

					factores_totales.push({
						factor: key,
						total: promedio,
						color: colors[Math.floor(Math.random() * colors.length)]
					});
				});

				graphComparative.factores_totales = factores_totales;

				/**
					Cargar datos en el eje x;
				*/

				var series = [];

				_.map(data_extra, function (value, key) {
					xaxis.push(key);

					_.map(value, function (factor) {
						series.push(factor);
					});
				});

				/*--------------------------*/

				/**
					Cargar datos de factor por dia
				*/

				var data_series = _.groupBy(series, function (obj) {
					return obj.factor;
				});

				_.map(data_series, function (factor, key_factor) {
					var promedio_axis = [];
					_.map(xaxis, function (dia) {
						var promedio = _.find(factor, function (promedio) {
							return promedio.dia == dia;
						});						

						if (promedio) {
							promedio_axis.push(promedio.promedio);
						} else {
							promedio_axis.push(0);
						}
					});

					datos.push({
						name: key_factor,
						data: promedio_axis
					});
				});

				graphComparative.graphFactor = graphics.generateGraph('spline', 'Datos comparativos de turnos', xaxis, 'Incidencias (UND)', _.sortBy(datos, 'name'), 'Gráfico N° 03 : COMPARATIVO FACTORES');
			}).error(function (err) {
				console.log(err);
			});
		}

		graphComparative.initialize = function () {
			graphComparative.zonas();
			graphComparative.turnos();
			graphComparative.factores();
		}

		graphComparative.initialize();
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