/**
 * TurnoController
 *
 * @description :: Server-side logic for managing turnoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	comparative_turnos : function (req, res) {
		Incidencia.query('select count(incidencia.incidencia_id) as promedio, concat(day(incidencia.hora_incidencia), "/", month(incidencia.hora_incidencia), "/", year(incidencia.hora_incidencia)) as dia, turno.turno from incidencia inner join turno on turno.turno_id = incidencia.turno_id where incidencia.hora_incidencia between "' + req.param('inicio') + ' 00:00:00" and "' + req.param('fin') + ' 23:59:59" group by incidencia.turno_id, day(incidencia.hora_incidencia) order by incidencia.hora_incidencia asc;', function (err, response) {
			if (err) return res.send(err,500);
  			res.json(response);
		});
	}
};

