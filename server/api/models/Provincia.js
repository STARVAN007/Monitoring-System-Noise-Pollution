/**
* Provincia.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  	connection: 'mysql',
  	autoCreatedAt : false,
  	autoUpdatedAt : false,
	attributes: {
		provincia_id: {
			type: 'integer',
	        autoIncrement: true,
	        primaryKey: true
		},
		provincia: {
			type: 'string'
		},
		departamento_id:{
			model: 'departamento'
		},
		distritos: {
			collection: 'distrito',
			via: 'provincia_id'
		}
	}
};

