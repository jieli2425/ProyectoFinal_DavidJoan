const fetch = require('node-fetch');
const Partido = require('../models/Partido');

const actualizarResultadosPorCompeticion = async (nombre, id) => {
  try {
    const response = await fetch(`https://api.football-data.org/v4/competitions/${id}/matches?status=FINISHED`, {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY }
    });
    const data = await response.json();

    if (data.matches) {
      for (const match of data.matches) {
        const partido = await Partido.findOne({
            equipoLocal: match.homeTeam?.name,
            equipoVisitante: match.awayTeam?.name,
            competicion: match.competition.name,
            fecha: {
                $gte: new Date(new Date(match.utcDate).getTime() - 5 * 60000), // 5 min antes
                $lte: new Date(new Date(match.utcDate).getTime() + 5 * 60000)  // 5 min después
            }
            });

        if (partido) {
          let ganador = 'empate';
          if (match.score.winner === 'HOME_TEAM') ganador = 'local';
          else if (match.score.winner === 'AWAY_TEAM') ganador = 'visitante';

          if (partido.estado !== 'finalizado' || partido.ganador !== ganador) {
            partido.estado = 'finalizado';
            partido.ganador = ganador;
            await partido.save();
          }
        }
      }
      console.log(`Resultados de ${nombre} actualizados`);
    } else {
      console.log(`No se encontraron resultados para ${nombre}`);
    }
  } catch (error) {
    console.error(`Error al actualizar resultados de ${nombre}:`, error);
  }
};

const actualizarResultadosApuestas = async () => {
  const competiciones = {
    'Liga EA Sports': 2014,
    'Premier League': 'PL',
    'Champions League': 'CL'
  };
  for (const [nombre, id] of Object.entries(competiciones)) {
    await actualizarResultadosPorCompeticion(nombre, id);
  }
};

module.exports = {
  actualizarResultadosApuestas,
};
