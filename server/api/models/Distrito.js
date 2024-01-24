/**
* Distrito.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	connection: 'mysql',
	autoCreatedAt : false,
  	autoUpdatedAt : false,
	attributes: {
		distrito_id: {
			type: 'integer',
            autoIncrement: true,
            primaryKey: true
		},
		distrito: {
			type: 'string'
		},
		provincia_id: {
			model: 'provincia'
		},
		zonas: {
			collection: 'zona',
			via: 'distrito_id'
		},
		latitud: {
			type: 'float',
			required: true
		},
		longitud: {
			type: 'float',
			required: true
		}
	}
};

