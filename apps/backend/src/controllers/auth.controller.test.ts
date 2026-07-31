import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../index";
import { createTestUser } from "../tests/factories";

describe("POST /auth/login", () => {
	it("return a token for valid credentials", async () => {

		await createTestUser({ name: "testuser", email: "user1@test.com" });

		const res = await request(app)
			.post("/auth/login")
			.send({ email: "user1@test.com", password: "password123" });
		expect(res.status).toBe(200);
		expect(res.body.token).toBeDefined();
	});
});

describe("POST /auth/register", () => {
    it("allow registering new users", async () => {
        const res = await request(app)
            .post("/auth/register")
            .send({email: "newuser@test.com", name: "Test", password: "password123"});
        expect(res.status).toBe(200);
        expect(res.body.user.name).toBe('Test');
    });
});
