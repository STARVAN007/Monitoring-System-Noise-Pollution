(function () {
	'use-strict';

	angular
		.module('sonometerApp')
		.factory('messageFactory', messageFactory)
		.controller('messageController', messageController);

	function messageController ($uibModalInstance, $sce, message, callback, button) {
		var alert = this;

		callback = callback || null;

		alert.button = button;
		alert.message = $sce.trustAsHtml(message);

		alert.ok = function () {
			$uibModalInstance.close();
		};

		if(callback){
			alert.callback = callback;
		}  
	}
	
	function messageFactory ($uibModal, $log) {
		return {
		    message : function (message, callback, button) {
				var modalInstance = $uibModal.open({
					animation: true,
					templateUrl: 'views/pages/modals/message.html',
					controller: 'messageController as alert',
					size: 'md',
					keyboard: false,
					resolve: {
					  message: function () {
					    return message; 
					  },
					  callback : function(){
					    return callback;
					  },
					  button: function(){
					    return button;
					  }
					}
				});
		    }
		}
	}
})();