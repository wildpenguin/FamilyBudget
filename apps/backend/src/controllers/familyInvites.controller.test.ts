import { eq } from "drizzle-orm";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { db } from "../db";
import { familyMembers } from "../db/schema/familyMembers";
import app from "../index";
import {
	createFamily,
	createFamilyMember,
	createTestUser,
} from "../tests/factories";
import { loginAs } from "../tests/helpers";

describe("POST /api/familyInvites", () => {
	it("creates an invite for the authenticated user's family", async () => {
		const inviter = await createTestUser({ email: "inviter@test.com" });
		const family = await createFamily("Inviter family");
		await createFamilyMember(family.id, inviter.id);
		await createTestUser({ email: "invitee@test.com" });
		const token = await loginAs("inviter@test.com");

		const res = await request(app)
			.post("/api/familyInvites")
			.set("Authorization", `Bearer ${token}`)
			.send({ invitedEmail: "invitee@test.com" });

		expect(res.status).toBe(200);
		expect(res.body.data).toMatchObject({
			familyId: family.id,
			invitedEmail: "invitee@test.com",
			invitedByUserId: inviter.id,
			status: "pending",
		});
		expect(res.body.data.token).toBeDefined();
	});

	it("rejects requests without a token", async () => {
		const res = await request(app)
			.post("/api/familyInvites")
			.send({ invitedEmail: "invitee@test.com" });

		expect(res.status).toBe(401);
	});

	it("returns 400 for an invalid payload", async () => {
		const inviter = await createTestUser({ email: "inviter2@test.com" });
		const family = await createFamily("Inviter family 2");
		await createFamilyMember(family.id, inviter.id);
		const token = await loginAs("inviter2@test.com");

		const res = await request(app)
			.post("/api/familyInvites")
			.set("Authorization", `Bearer ${token}`)
			.send({ invitedEmail: "not-an-email" });

		expect(res.status).toBe(400);
	});
});

describe("GET /api/familyInvites/:token/accept", () => {
	it("accepts an invite and joins the inviter's family", async () => {
		const inviter = await createTestUser({ email: "inviter3@test.com" });
		const family = await createFamily("Acceptor family");
		await createFamilyMember(family.id, inviter.id);
		const invitee = await createTestUser({ email: "invitee3@test.com" });
		const inviterToken = await loginAs("inviter3@test.com");

		const createRes = await request(app)
			.post("/api/familyInvites")
			.set("Authorization", `Bearer ${inviterToken}`)
			.send({ invitedEmail: "invitee3@test.com" });
		const inviteToken = createRes.body.data.token;

		const res = await request(app).get(
			`/api/familyInvites/${inviteToken}/accept`,
		);

		console.log("status:", res.status);
		console.log("body:", res.body);
		console.log("text:", res.text);
		console.log("headers:", res.headers);

		expect(res.status).toBe(200);
		expect(res.body.data).toBe("success");

		const [membership] = await db
			.select()
			.from(familyMembers)
			.where(eq(familyMembers.userId, invitee.id));
		expect(membership.familyId).toBe(family.id);
	});
});
