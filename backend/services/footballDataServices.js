const fetch = require('node-fetch');
const Partido = require('../models/Partido');

const competiciones = {
  'Liga EA Sports': 2014,
  'Premier League': 2021,
  'Champions League': 2001
};

const obtenerPartidosPorCompeticion = async (nombre, id) => {
  try {
    const response = await fetch(`https://api.football-data.org/v4/competitions/${id}/matches?status=SCHEDULED`, {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY }
    });

    const data = await response.json();

    if (data.matches) {
      await Partido.deleteMany({ competicion: nombre, estado: 'pendiente' });
      
      for (const match of data.matches) {
        const existe = await Partido.findOne({
          equipoLocal: match.homeTeam.name,
          equipoVisitante: match.awayTeam.name,
          fecha: new Date(match.utcDate),
          competicion: match.competition.name
        });

        if (!existe) {
          const partido = new Partido({
            deporte: 'futbol',
            competicion: match.competition.name,
            equipoLocal: match.homeTeam.name,
            equipoVisitante: match.awayTeam.name,
            fecha: new Date(match.utcDate),
            estado: 'pendiente'
          });
          await partido.save();
        }
      }

      console.log(`Partidos de ${nombre} actualizados`);
    } else {
      console.log(`No se encontraron partidos para ${nombre}`);
    }

  } catch (error) {
    console.error(`Error al obtener partidos de ${nombre}:`, error);
  }
};

const actualizarPartidos = async () => {
  for (const [nombre, id] of Object.entries(competiciones)) {
    await obtenerPartidosPorCompeticion(nombre, id);
  }
};

module.exports = { actualizarPartidos };