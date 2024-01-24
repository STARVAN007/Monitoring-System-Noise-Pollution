/**
* Factor.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	connection: 'mysql',
	autoCreatedAt : false,
  	autoUpdatedAt : false,
	attributes: {
		factor_id: {
			type: 'integer',
            autoIncrement: true,
            primaryKey: true
		},
		factor: {
			type: 'string',
			required: true
		},
		nivel_contaminacion: {
			type: 'integer',
			required: true
		},
		incidencias: {
			collection: 'incidencia',
			via: 'factor_id'
		}
	}
};

