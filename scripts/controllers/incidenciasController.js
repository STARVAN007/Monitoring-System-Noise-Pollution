(function () {
	'use-strict';

	angular
		.module('sonometerApp')
		.controller('incidenciasController', incidenciasController)
		.factory('API_INCIDENCIAS', API_INCIDENCIAS);

	function incidenciasController ($uibModal, $log, $sails, API_INCIDENCIAS, messageFactory) {
		var incidencias = this;

		incidencias.items_per_page = 5;
		incidencias.currentPage = 1;
		incidencias.maxSize = 5;

		incidencias.loadGrid = function () {
			API_INCIDENCIAS.index('/incidencia', incidencias);
			API_INCIDENCIAS.count('/incidencia', incidencias);

			console.log(incidencias.incidencias);
		};

		incidencias.pageChanged = function() {
		       API_INCIDENCIAS.index('/incidencia', incidencias);
		};

		incidencias.loadZonas = function () {
			$sails.get('/zona').
			success(function(data, status, headers, config) {
				incidencias.zonas = data;
			}).
			error(function(data, status, headers, config) {
				console.log(data);
			});
		};

		incidencias.loadTurnos = function () {
			$sails.get('/turno').
			success(function(data, status, headers, config) {
				incidencias.turnos = data;
			}).
			error(function(data, status, headers, config) {
				console.log(data);
			});
		};

		incidencias.initialize = function () {
			incidencias.loadTurnos();
			incidencias.loadZonas();
			incidencias.today();
			incidencias.loadGrid();
		};

		incidencias.status = {};

		incidencias.today = function() {
			var today = new Date();
			incidencias.dt_desde = new Date(today.getFullYear()+'-'+(today.getMonth() + 1)+'-'+(today.getDate() - 6));
			incidencias.dt_hasta = today;
		}

		incidencias.open = function($event, band) {
			if (band == 'dt_hasta') {
				incidencias.status.opened_dt_hasta = true;
			} else if (band == 'dt_desde') {
				incidencias.status.opened_dt_desde = true;
			}
		}

		incidencias.showGraphs = function (argument) {
			var modalGraph = $uibModal.open({
				animation: true,
				templateUrl: 'views/pages/modals/graphComparative.html',
				controller: 'graphComparativeController as graphComparative',
				size: 'lg',
				backdrop: true,
				keyboard: false,
		      	resolve: {
		      		desde: function () {
		      			return incidencias.dt_desde
		      		},
		      		hasta: function () {
		      			return incidencias.dt_hasta
		      		},
					loadController: function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							files: [
								'scripts/controllers/modals/graphComparative.js'
							]
						});
					}
				}
		    });
		}

		incidencias.initialize();
	}

	function API_INCIDENCIAS ($sails) {
		return {
			index: function(model,incidencias) {
				var inicio = incidencias.dt_desde, fin = incidencias.dt_hasta;
				var url = model+'/grid_incidencias?page='+incidencias.currentPage+'&limit='+incidencias.items_per_page+(incidencias.zona && incidencias.zona !== null ? '&zona_id=' + incidencias.zona.zona_id : '')+(incidencias.turno && incidencias.turno !== null ? '&turno_id=' + incidencias.turno.turno_id : '')+'&inicio='+(inicio.getFullYear()+'-'+(inicio.getMonth() + 1)+'-'+inicio.getDate())+'&fin='+(fin.getFullYear()+'-'+(fin.getMonth() + 1)+'-'+fin.getDate());
				$sails.get(url).
				success(function(data, status, headers, config) {
					incidencias.incidencias = data;
				}).
				error(function(data, status, headers, config) {
					console.log(data);
				});
			},
			count: function(model,incidencias) {
				var inicio = incidencias.dt_desde, fin = incidencias.dt_hasta;
				var url = model+'/count?'+(incidencias.zona && incidencias.zona !== null ? '&zona_id=' + incidencias.zona.zona_id : '')+(incidencias.turno && incidencias.turno !== null ? '&turno_id=' + incidencias.turno.turno_id : '')+'&inicio='+(inicio.getFullYear()+'-'+(inicio.getMonth() + 1)+'-'+inicio.getDate())+'&fin='+(fin.getFullYear()+'-'+(fin.getMonth() + 1)+'-'+fin.getDate());
				$sails.get(url).
				success(function(data, status, headers, config) {
					incidencias.totalItems = data.count;
				}).
				error(function(data, status, headers, config) {
					console.log(data);
				});
			},             
		};  
	}
})();