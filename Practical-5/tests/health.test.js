
const request = require("supertest");
const app = require("../server");

describe("Health Check API", () => {
  test("GET /health returns status 200", async () => {
    const res = await request(app).get("/health");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: "OK",
    });
  });
});
