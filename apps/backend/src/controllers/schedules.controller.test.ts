import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../index";
import {
	createCategory,
	createFamily,
	createFamilyMember,
	createSchedule,
	createTestUser,
} from "../tests/factories";
import { loginAs } from "../tests/helpers";

describe("POST /api/schedules", () => {
	it("creates a schedule for the authenticated user's family", async () => {
		const user = await createTestUser({ email: "sched-create@test.com" });
		const family = await createFamily("Schedule create family");
		await createFamilyMember(family.id, user.id);
		const [category] = await createCategory("Rent", family.id, "expense");
		const token = await loginAs("sched-create@test.com");

		const res = await request(app)
			.post("/api/schedules")
			.set("Authorization", `Bearer ${token}`)
			.send({
				familyId: family.id,
				categoryId: category.id,
				description: "Monthly rent",
				amount: "-1200.00",
				frequency: "monthly",
				startDate: "2026-01-01",
			});

		expect(res.status).toBe(200);
		expect(res.body.data).toMatchObject({
			familyId: family.id,
			categoryId: category.id,
			description: "Monthly rent",
			amount: "-1200.00",
			frequency: "monthly",
			startDate: "2026-01-01",
		});
	});
});

describe("GET /api/schedules", () => {
	it("returns a single schedule by id", async () => {
		const user = await createTestUser({ email: "sched-single@test.com" });
		const family = await createFamily("Schedule single family");
		await createFamilyMember(family.id, user.id);
		const [category] = await createCategory("Rent", family.id, "expense");
		const [schedule] = await createSchedule(
			family.id,
			category.id,
			"Monthly rent",
			"-1200.00",
			"monthly",
			"2026-01-01",
			true,
			user.id,
		);
		const token = await loginAs("sched-single@test.com");

		const res = await request(app)
			.get(`/api/schedules/${schedule.id}`)
			.set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(res.body.data).toMatchObject({
			id: schedule.id,
			familyId: family.id,
			description: "Monthly rent",
		});
	});

	it("lists all schedules for the authenticated user's family", async () => {
		const user = await createTestUser({ email: "sched-list@test.com" });
		const family = await createFamily("Schedule list family");
		await createFamilyMember(family.id, user.id);
		const [category] = await createCategory("Bills", family.id, "expense");
		await createSchedule(family.id, category.id, "Rent", "-1200.00", "monthly", "2026-01-01", true, user.id);
		await createSchedule(family.id, category.id, "Gym", "-40.00", "monthly", "2026-01-05", true, user.id);
		const token = await loginAs("sched-list@test.com");

		const res = await request(app)
			.get("/api/schedules")
			.set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(res.body.meta.total).toBe(2);
		expect(res.body.data.map((s: { description: string }) => s.description).sort()).toEqual([
			"Gym",
			"Rent",
		]);
	});
});

describe("PUT /api/schedules/:id", () => {
	it("updates a schedule's fields", async () => {
		const user = await createTestUser({ email: "sched-update@test.com" });
		const family = await createFamily("Schedule update family");
		await createFamilyMember(family.id, user.id);
		const [category] = await createCategory("Rent", family.id, "expense");
		const [schedule] = await createSchedule(
			family.id,
			category.id,
			"Monthly rent",
			"-1200.00",
			"monthly",
			"2026-01-01",
			true,
			user.id,
		);
		const token = await loginAs("sched-update@test.com");

		const res = await request(app)
			.put(`/api/schedules/${schedule.id}`)
			.set("Authorization", `Bearer ${token}`)
			.send({ amount: "-1300.00", description: "Monthly rent, updated" });

		expect(res.status).toBe(200);
		expect(res.body.data).toMatchObject({
			id: schedule.id,
			amount: "-1300.00",
			description: "Monthly rent, updated",
		});
	});
});

describe("DELETE /api/schedules/:id", () => {
	it("deletes a schedule", async () => {
		const user = await createTestUser({ email: "sched-delete@test.com" });
		const family = await createFamily("Schedule delete family");
		await createFamilyMember(family.id, user.id);
		const [category] = await createCategory("Subscriptions", family.id, "expense");
		const [schedule] = await createSchedule(
			family.id,
			category.id,
			"Streaming",
			"-15.99",
			"monthly",
			"2026-01-01",
			true,
			user.id,
		);
		const token = await loginAs("sched-delete@test.com");

		const res = await request(app)
			.delete(`/api/schedules/${schedule.id}`)
			.set("Authorization", `Bearer ${token}`);

		expect(res.status).toBe(200);
		expect(res.body.data).toMatchObject({
			id: schedule.id,
			description: "Streaming",
		});
	});
});
