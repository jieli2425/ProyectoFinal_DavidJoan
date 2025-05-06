const fetch = require('node-fetch');
const Partido = require('../models/Partido');

const obtenerPartidosEnVivo = async () => {
  try {
    const response = await fetch('https://api.football-data.org/v4/matches', {
      method: 'GET',
      headers: {
        'X-Auth-Token': process.env.FOOTBALL_API_KEY
      }
    });

    const data = await response.json();

    if (data.matches) {
      data.matches.forEach(async (match) => {
        const partido = new Partido({
          deporte: 'futbol',
          equipoLocal: match.homeTeam.name,
          equipoVisitante: match.awayTeam.name,
          fecha: new Date(match.utcDate),
          estado: 'pendiente'
        });
        await partido.save();
      });

      console.log('Partidos en vivo actualizados');
    } else {
      console.log('No se encontraron partidos en vivo');
    }

  } catch (error) {
    console.error('Error al obtener partidos:', error);
  }
};

module.exports = {
  obtenerPartidosEnVivo
};