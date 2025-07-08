const sum = (a, b) => a + b;
const request = require("supertest");
const app = require("./app");

test("adds 1 + 2 to equal 3", () => {
	expect(sum(1, 2)).toBe(3);
});

test("GET /api/auth/me returns 401 when not authenticated", async () => {
	const res = await request(app).get("/api/auth/me");
	expect(res.status).toBe(401);
});
