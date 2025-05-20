const fetch = require('node-fetch');
const Partido = require('../models/Partido');

const competiciones = {
  'Liga EA Sports': 2014,
  'Premier League': 'PL',
  'Champions League': 'CL'
};

const fechaInicio = new Date('2025-05-12T00:00:00Z');
const fechaFin = new Date('2025-05-18T23:59:59Z');

const obtenerPartidosPorCompeticion = async (nombre, id) => {
  try {
    const response = await fetch(`https://api.football-data.org/v4/competitions/${id}/matches?status=SCHEDULED`, {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY }
    });

    const data = await response.json();

    if (data.matches) {
      await Partido.deleteMany({ competicion: nombre, estado: 'pendiente' });
      
      for (const match of data.matches) {
        const homeTeamName = match.homeTeam?.name;
        const awayTeamName = match.awayTeam?.name;
        const fechaPartido = new Date(match.utcDate);

        if (!homeTeamName || !awayTeamName) continue;

        // Filtro de fechas
        if (fechaPartido < fechaInicio || fechaPartido > fechaFin) continue;

        const existe = await Partido.findOne({
          equipoLocal: homeTeamName,
          equipoVisitante: awayTeamName,
          fecha: new Date(match.utcDate),
          competicion: match.competition.name
        });

        if (!existe) {
          const partido = new Partido({
            deporte: 'futbol',
            competicion: match.competition.name,
            equipoLocal: homeTeamName,
            equipoVisitante: awayTeamName,
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



const obtenerPartidosPremierLeague = async () => {
  try {
    const response = await fetch('https://api.football-data.org/v4/competitions/PL/matches?status=SCHEDULED', {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY }
    });
    const data = await response.json();
    if (data.matches) {
      await Partido.deleteMany({ competicion: 'Premier League', estado: 'pendiente' });
      
      for (const match of data.matches) {
        const homeTeamName = match.homeTeam?.name;
        const awayTeamName = match.awayTeam?.name;
        const fechaPartido = new Date(match.utcDate);

        if (!homeTeamName || !awayTeamName) continue;

        // Filtro de fechas
        if (fechaPartido < fechaInicio || fechaPartido > fechaFin) continue;
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
    }
  } catch (error) {
    console.error('Error al obtener partidos de la Premier League:', error);
  }
};

const fechaInicioChampions = new Date('2025-05-05T00:00:00Z');
const fechaFinChampions = new Date('2025-05-10T23:59:59Z');

const obtenerPartidosChampionsLeague = async () => {
  try {
    const response = await fetch('https://api.football-data.org/v4/competitions/CL/matches?status=SCHEDULED', {
      headers: { 'X-Auth-Token': process.env.FOOTBALL_API_KEY }
    });
    const data = await response.json();
    if (data.matches) {
      await Partido.deleteMany({ competicion: 'UEFA Champions League', estado: 'pendiente' });
      for (const match of data.matches) {
        const homeTeamName = match.homeTeam?.name;
        const awayTeamName = match.awayTeam?.name;
        const fechaPartido = new Date(match.utcDate);

        if (!homeTeamName || !awayTeamName) continue;

        // Filtro de fechas
        if (fechaPartido < fechaInicioChampions || fechaPartido > fechaFinChampions) continue;
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
    }
  } catch (error) {
    console.error('Error al obtener partidos de la Champions League:', error);
  }
};


const actualizarPartidos = async () => {
  for (const [nombre, id] of Object.entries(competiciones)) {
    await obtenerPartidosPorCompeticion(nombre, id);
  }
};

module.exports = { obtenerPartidosPremierLeague, obtenerPartidosChampionsLeague, actualizarPartidos };