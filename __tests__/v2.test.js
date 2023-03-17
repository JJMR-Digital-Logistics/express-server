'use strict';

const { server } = require('../server.js');
const { db, users } = require('../Models/index.js');
const supertest = require('supertest');
const request = supertest(server);

let testAdmin;

beforeAll(async () => {
  await db.sync();
  testAdmin = await users.create({
    username: 'testyAdmin',
    password: 'pass123',
    role: 'admin',
  });
});

afterAll(async () => {
  await db.drop();
});

describe('v2 Routes', () => {
  it('creates a record', async() => {
    let response = await request.post('/api/v2/parts').send({
      name: 'screw',
      quantity: 100,
      description: 'twisty',
      manufacturer: 'Marco',
      color: 'Polo',
    }).set('Authorization', `Bearer ${testAdmin.token}`);

    expect(response.status).toEqual(201);
    expect(response.body.name).toEqual('screw');
  });

  it('gets all records', async() => {
    let response = await request.get('/api/v2/parts').set('Authorization', `Bearer ${testAdmin.token}`);

    expect(response.status).toEqual(200);
    expect(response.body[0].name).toEqual('screw');
  });

  it('gets a single record', async() => {
    let response = await request.get('/api/v2/parts/1').set('Authorization', `Bearer ${testAdmin.token}`);

    console.warn('body: ', response);
    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('screw');
  });

  it('updates a record', async() => {
    let response = await request.put('/api/v2/parts/1').send({
      name: 'bolts',
      quantity: 10,
      description: 'turny',
      manufacturer: 'Polo',
      color: 'Marco',
    }).set('Authorization', `Bearer ${testAdmin.token}`);

    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual('bolts');
    expect(response.body.quantity).toEqual(10);
  });

  it('deletes a record', async() => {
    let response = await request.delete('/api/v2/parts/1').set('Authorization', `Bearer ${testAdmin.token}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual(1);
  });

}); 