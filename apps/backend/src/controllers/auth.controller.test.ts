import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index';
import { createTestUser } from '../tests/factories';

describe('POST /login', () => {
    it('return a token for valid credentials', async () => {
        await createTestUser({ name: 'testuser', email: 'user2@test.com'});

        const res = await request(app)
            .post('/api/login')
            .send({email: 'user1@test.com', password: "password123"});
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    })
})