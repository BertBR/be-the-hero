const express = require('express');

const OngController = require('./controllers/OngController')
const IncidentController = require('./controllers/IncidentController')
const ProfileController = require('./controllers/ProfileController')
const SessionController = require('./controllers/SessionController')

const {
  validLogIn,
  validOngCreate,
  validOngProfile,
  validIncidentsListPage,
  validIncidentsCreate,
  validIncidentsDelete
} = require('./utils/routeValidations');

const routes = express.Router();

// Create a new ONG
routes.post('/ongs', validOngCreate(), OngController.create);

// List ALL ONGs
routes.get('/ongs', OngController.index);

// Log In ONG Profile
routes.post('/sessions', validLogIn(), SessionController.create);

// Create Incidents
routes.post('/incidents', validIncidentsCreate() , IncidentController.create);

// List ONGs Profile Incidents 
routes.get('/profile', validOngProfile(), ProfileController.index);

// List ALL Incidents (by page)
routes.get('/incidents', validIncidentsListPage() , IncidentController.index);

// Delete Incidents
routes.delete('/incidents/:id', validIncidentsDelete() , IncidentController.delete);

module.exports = routes; 