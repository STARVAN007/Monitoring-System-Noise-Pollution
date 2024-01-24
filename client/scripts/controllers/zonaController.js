(function () {
	'use-strict';

	angular
		.module('sonometerApp')
		.controller('zonaController', zonaController)
		.factory('API_ZONA', api_zona);

	function zonaController ($uibModal, $log, $sails, API_ZONA, messageFactory) {
		var zona = this;

		zona.items_per_page = 5;
		zona.currentPage = 1;
		zona.maxSize = 5;

		API_ZONA.index('/zona', zona);
		API_ZONA.count('/zona', zona);

		zona.pageChanged = function() {
		       API_ZONA.index('/zona', zona);
		};

		zona.delete = function (zona) {
			$sails.post('/zona/borrar_zona?zona_id=' + zona).success(function (response) {
				messageFactory.message(response);

				API_ZONA.index('/zona', zona);
				API_ZONA.count('/zona', zona);
			}).error(function (err, data) {
				console.log(data);
			});
		}

		zona.newZone = function () {
			var modalZone = $uibModal.open({
				animation: true,
				templateUrl: 'views/pages/modals/newZone.html',
				controller: 'newZoneController as newZone',
				size: 'md',
				backdrop: true,
				keyboard: false,
		      	resolve: {
					loadMyFiles: function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							files: [
								'scripts/controllers/modals/newZoneController.js'
							]
						});
					}
				}
		    });

		    /*modalZone.result.then(function (data) {
		      console.log(data);
		    }, function () {
		      $log.info('Modal dismissed at: ' + new Date());
		    });*/
		}

		/*zona.getZonas = function () {
			$sails.get('/zona').success(function (data) {
				console.log(data);
				zona.zonas = data;
			}).error(function (error) {
				console.log(error);
			});
		}

		zona.getZonas();*/
	}

	function api_zona ($sails) {
		return {
			index: function(model,zona) {
				var url = model+'/grid_zonas?page='+zona.currentPage+'&limit='+zona.items_per_page;
				$sails.get(url).
				success(function(data, status, headers, config) {
					zona.zonas = data;
				}).
				error(function(data, status, headers, config) {
					console.log(data);
				});
			},
			count: function(model,zona) {
				var url = model+'/count';
				$sails.get(url).
				success(function(data, status, headers, config) {
					zona.totalItems = data.count;
				}).
				error(function(data, status, headers, config) {
					console.log(data);
				});
			},             
		};  
	}
})();