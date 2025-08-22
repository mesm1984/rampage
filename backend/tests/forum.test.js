const request = require('supertest');
const { app, db, server } = require('../server');
const { User, ForumCategory, ForumTopic, ForumReply } = db;

describe('Modération Forum API', () => {
  let adminToken;
  let userToken;
  let category;
  let topic;
  let reply;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await db.sequelize.sync({ force: true });

    // Créer un utilisateur régulier
    const user = await User.create({
      username: 'alice',
      email: 'alice@test.com',
      password: 'password123',
      role: 'user'
    });
    // Créer un admin
    const admin = await User.create({
      username: 'bob',
      email: 'bob@test.com',
      password: 'adminpass',
      role: 'admin'
    });

    // Obtenir les tokens via login
    const userRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'alice@test.com', password: 'password123' });
    userToken = userRes.body.token;

    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'bob@test.com', password: 'adminpass' });
    adminToken = adminRes.body.token;

    // Créer une catégorie et un topic
    category = await ForumCategory.create({ name: 'General', slug: 'general' });
    topic = await ForumTopic.create({
      category_id: category.id,
      user_id: user.id,
      title: 'Test Topic',
      slug: 'test-topic',
      content: 'Initial content'
    });
    // Créer un message
    reply = await ForumReply.create({
      topic_id: topic.id,
      user_id: user.id,
      content: 'Test reply'
    });
  });

  afterAll(async () => {
    await db.sequelize.close();
    // Fermer le serveur pour éviter que Jest reste ouvert
    server.close();
  });

  describe('DELETE /api/forum/topics/:id', () => {
    it('devrait retourner 401 sans token', async () => {
      const res = await request(app).delete(`/api/forum/topics/${topic.id}`);
      expect(res.status).toBe(401);
    });
    it('devrait retourner 403 pour un user non-admin', async () => {
      const res = await request(app)
        .delete(`/api/forum/topics/${topic.id}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(403);
    });
    it('devrait supprimer le topic pour un admin', async () => {
      const res = await request(app)
        .delete(`/api/forum/topics/${topic.id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(204);
      // topic plus existant
      const t = await ForumTopic.findByPk(topic.id);
      expect(t).toBeNull();
    });
  });

  describe('DELETE /api/forum/messages/:id', () => {
    it('devrait retourner 401 sans token', async () => {
      const res = await request(app).delete(`/api/forum/messages/${reply.id}`);
      expect(res.status).toBe(401);
    });
    it('devrait retourner 403 pour un user non-admin', async () => {
      const res = await request(app)
        .delete(`/api/forum/messages/${reply.id}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(403);
    });
    it('devrait supprimer le message pour un admin', async () => {
      const res = await request(app)
        .delete(`/api/forum/messages/${reply.id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(204);
      const r = await ForumReply.findByPk(reply.id);
      expect(r).toBeNull();
    });
  });
});
