const request = require('supertest');
const { app, db } = require('../server');

describe('Tests d\'intégration API', () => {
  beforeAll(async () => {
    // Synchronisation de la base pour tests
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  test('GET /api/test renvoie un message de succès', async () => {
    const res = await request(app).get('/api/test');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'API backend OK');
  });

  test('Route inexistante renvoie 404', async () => {
    const res = await request(app).get('/api/inexistant');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('success', false);
  });
});
