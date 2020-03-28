const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

let ong_id = '';
let incident_id = '';

describe('Routes', () => {
  beforeAll(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  });

  afterAll(async () => {
    await connection.destroy();
  });

  // Create a new ONG
  it('should be able to create a new ONG', async () => {
    const response = await request(app)
      .post('/ongs')
      .send({
        name: "APAD3",
        email: "contato@apada.com.br",
        whatsapp: "8412341232",
        city: "Rio do Sul",
        uf: "SC"
      });

    ong_id = response.body.id
    expect(response.body).toHaveProperty('id');
    expect(response.body.id).toHaveLength(8);

  });

  // List ALL ONGs
  it('should be able to list all ONGs', async () => {

    const response = await request(app)
      .get('/ongs')
      .send();

    const [first] = response.body
    expect(first).toHaveProperty('id', 'name', 'email', 'whatsapp', 'city', 'uf');
  });

  // Log In ONG Profile
  it('should be able to LOG-IN a session', async () => {

    const response = await request(app)
      .post('/sessions')
      .send({
        id: `${ong_id}`
      });

    expect(response.body).toHaveProperty('name');
  });

  // Create Incidents
  it('should be able to create a new INCIDENT', async () => {

    const response = await request(app)
      .post('/incidents')
      .set({
        authorization: [ong_id]
      })
      .send({
        title: "Caso teste",
        description: "Detalhes do Caso",
        value: 132
      });

    incident_id = response.body.id
    expect(response.body).toHaveProperty('id');

  });

  // List ONGs Profile Incidents 
  it('should be able to list all incidents from a ONG Profile', async () => {

    const response = await request(app)
      .get('/profile')
      .set({
        authorization: [ong_id]
      })
      .send();

    const [first] = response.body
    expect(first).toHaveProperty('id', 'title', 'description', 'value', 'ong_id');
    expect(first.ong_id).toEqual(ong_id)
  });

  // List ALL Incidents (by page)
  it('should be able to list all(by page) incidents', async () => {

    const response = await request(app)
      .get('/incidents')
      .send();

    const [first] = response.body
    expect(first).toHaveProperty('id',
      'title',
      'description',
      'value',
      'ong_id',
      'name',
      'email',
      'whatsapp',
      'city',
      'uf'
    );
  });

  // Delete Incidents
  it('should be able to delete an INCIDENT', async () => {

    const response = await request(app)
      .delete(`/incidents/${incident_id}`)
      .set({
        authorization: [ong_id]
      })
      .send();

    expect(response.status).toEqual(204)
  });

});