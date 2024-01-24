(function () {
	'use-strict';

	angular
		.module('sonometerApp')
		.factory('userService', userService);

	function userService () {
		return {
			isAuthenticated: false,
          	dataUser: {},
			objUsers : [
				{username: 'admin', password: 'admin'}
			],
			logIn: function(username, password) {
			  var user = _.find(this.objUsers, function(obj) { return obj.username === username; });

			  if (user) {
			  	//var hash = CryptoJS.SHA256(password);

				if (user.password == /*hash.toString(CryptoJS.enc.Base64)*/ password) {
					return 1;
				} else {
					return 2;
				}
			  } else {
			  	return 0;
			  }
			}
		}
	}
})();