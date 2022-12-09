(function () {
	'use-strict';

	angular
		.module('sonometerApp')
		.controller('newZoneController', newZoneController);

	function newZoneController ($uibModalInstance, $timeout, NgMap, $sce, $sails, messageFactory) {
		var newZone = this;

		newZone.map = null;
		newZone.creator = null;
		newZone.message = false;
		newZone.create = false;

		newZone.cancel = function () {
			$uibModalInstance.close();
		}

		newZone.gettinMap = function () { 
			NgMap.getMap({id:'foo'}).then(function(map) {
				newZone.map = map;

				newZone.creator = new PolygonCreator(newZone.map);

				newZone.create = true;
			});
		}

		newZone.showData = function () {
			newZone.message = false;
			if (newZone.creator.showData() !== null) {
				var path_aux = newZone.creator.showData().split(")(");
				var path = [];

				angular.forEach(path_aux, function(value, key){
					var aux_one = value.replace("(", "");
					var aux_two = aux_one.replace(")", "");

					path.push("[" + aux_two + "]");
				});

				newZone.path = path.join();
			} else {
				newZone.message = true;
			}
		}
		
		newZone.resetPolygon = function () {
			newZone.creator.destroy()
			newZone.create = false;
			newZone.path = null;
		}

		newZone.getDepartamentos = function () {
			$sails.get('/departamento').success(function (data) {
				newZone.departamentos = data;
			}).error(function (error) {
				console.log(error);
			});
		}

		newZone.getTipoZonas = function () {
			$sails.get('/tipo_zona').success(function (data) {
				newZone.tipo_zonas = data;
			}).error(function (error) {
				console.log(error);
			});
		}


		newZone.initialize = function () {
			newZone.getDepartamentos();
			newZone.getTipoZonas();
		}

		newZone.initialize();

		newZone.loadProvincias = function () {
			if (newZone.departamento !== null) {
				var departamento = _.find(newZone.departamentos, function(obj) { return obj.departamento_id === newZone.departamento.departamento_id; });

				if (departamento) {
					newZone.provincias = departamento.provincias;
					newZone.distritos = null;
				}
			}
		}

		newZone.loadDistritos = function () {
			if (angular.isDefined(newZone.provincia) && newZone.provincia !== null) {
				$sails.get('/distrito?provincia_id='+newZone.provincia.provincia_id).success(function (data) {
					newZone.distritos = data;
				}).error(function (error) {
					console.log(error);
				});
			}
		}

		newZone.loadZonas = function () {
			NgMap.initMap('foo');

			var distrito = _.find(newZone.distritos, function(obj) { return obj.distrito_id === newZone.distrito.distrito_id; });

			if (distrito) {
				newZone.zonas = distrito.zonas;
			}
		}

		newZone.saveZona = function () {
			var formData = {
				zona: newZone.zona,
				path: newZone.path,
				stroke_color: newZone.stroke_color,
				fill_color: newZone.fill_color,
				referencia_inicial: newZone.referencia_inicial,
				referencia_final: newZone.referencia_final,
				limite_maximo: newZone.limite_permitido,
				distrito_id: newZone.distrito.distrito_id,
				tipo_zona_id: newZone.tipo_zona.tipo_zona_id
			}

			$sails.post("/zona", formData).success(function (data) {
				if (angular.isDefined(data.zona_id)) {
					messageFactory.message('Se registró la zona correctamente');

					newZone.cancel();
				} else {
					messageFactory.message('No se pudo registrar la zona');
				}
			}).error(function (error) {
				messageFactory.message('No se pudo registrar la zona');
			});
		}
	}
})();