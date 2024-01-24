/**
* Tipo_zona.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	connection: 'mysql',
	autoCreatedAt : false,
  	autoUpdatedAt : false,
	attributes: {
		tipo_zona_id: {
			type: 'integer',
            autoIncrement: true,
            primaryKey: true
		},
		tipo_zona: {
			type: 'string',
			required: true
		},
		zonas: {
			collection: 'zona',
			via: 'tipo_zona_id'
		},
		limite_diurno: {
			type: 'float',
			required: true
		},
		limite_nocturno: {
			type: 'float',
			required: true
		}
	}
};

