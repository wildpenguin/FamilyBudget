import request from "supertest";
import app from "../index";

export async function loginAs(email: string) {
	const res = await request(app)
		.post("/auth/login")
		.send({ email, password: "password123" });
	return res.body.token as string;
}
