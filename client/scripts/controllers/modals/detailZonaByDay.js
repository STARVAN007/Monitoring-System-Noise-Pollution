(function () {
	'use-strict';

	angular
		.module('sonometerApp')
		.controller('detailZonaByDayController', detailZonaByDayController);

	function detailZonaByDayController ($uibModalInstance, $uibModal, zona, turno, desde, hasta, $sails) {
		var detailZonaByDay = this;

		detailZonaByDay.datos = {
			zona: zona,
			turno: turno,
			desde: desde,
			hasta: hasta
		}

		detailZonaByDay.loadPromedio = function () {
			var fecha = new Date(detailZonaByDay.datos.desde)
			
			$sails.get('/incidencia/data_range?inicio='+fecha.getFullYear()+'-'+(fecha.getMonth()+1)+'-'+fecha.getDate()+'&fin='+fecha.getFullYear()+'-'+(fecha.getMonth()+1)+'-'+fecha.getDate()+'&zona_id='+detailZonaByDay.datos.zona.zona_id+'&turno_id='+detailZonaByDay.datos.turno.turno_id).success(function (data) {
				detailZonaByDay.promedio = data[0].promedio;
				detailZonaByDay.porcentaje = (data[0].promedio < detailZonaByDay.datos.turno.niveles[2].desde) ? 0 : ((data[0].promedio - detailZonaByDay.datos.turno.niveles[2].desde) / detailZonaByDay.datos.turno.niveles[2].desde) * 100;

				var nivel = _.find(detailZonaByDay.datos.turno.niveles, function (obj) {
					return (detailZonaByDay.promedio >= obj.desde && detailZonaByDay.promedio <= obj.hasta);
				});

				if (nivel) {
					detailZonaByDay.semaforo = nivel.nivel;
				}
			}).error(function (error) {
				console.log(error);
			});
		}

		detailZonaByDay.loadPromedio();
		
		detailZonaByDay.cancel = function () {
			$uibModalInstance.close();
		}

		detailZonaByDay.showDots = function () {
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
						detailZonaByDay.loadPromedio();
					}
					break;
				case 'destroyed':
					if (message.data.zona_id == detailZonaByDay.datos.zona.zona_id) {
						detailZonaByDay.loadPromedio();
					}
					break;
			}
		});
	}
})();