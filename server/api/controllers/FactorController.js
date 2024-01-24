/**
 * FactorController
 *
 * @description :: Server-side logic for managing factors
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	comparative_factores : function (req, res) {
		Incidencia.query('select count(incidencia.incidencia_id) as promedio, concat(day(incidencia.hora_incidencia), "/", month(incidencia.hora_incidencia), "/", year(incidencia.hora_incidencia)) as dia, factor.factor from incidencia inner join factor on factor.factor_id = incidencia.factor_id where incidencia.hora_incidencia between "' + req.param('inicio') + ' 00:00:00" and "' + req.param('fin') + ' 23:59:59" group by incidencia.factor_id, day(incidencia.hora_incidencia) order by incidencia.hora_incidencia asc;', function (err, response) {
			if (err) return res.send(err,500);
  			res.json(response);
		});
	}
};

