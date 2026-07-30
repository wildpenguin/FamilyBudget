import bcrypt from 'bcrypt';
import { db } from '../db';
import { users } from '../db/schema/users'

export async function createTestUser(overrides = {}) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const [user] = await db.insert(users).values({
        name: 'testuser',
        email: 'test@test.com',
        password: hashedPassword,
        ...overrides,
    }).returning();
    return user;
}