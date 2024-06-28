process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");


let pickles = { 
    name: "Pickles", 
    price: "$5.99"
};

beforeEach(function () {
  items.push(pickles);
});

afterEach(function () {
  items.length = 0;
});


describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ items: [pickles] })
  })
})

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/items/${pickles.name}`);
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ item: pickles })
  })
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).get(`/items/icecube`);
    expect(res.statusCode).toBe(404)
  })
})

describe("POST /items", () => {
  test("Creating a item", async () => {
    const res = await request(app).post("/items").send({ name: "Taco", price: "$3.71" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ item: { name: "Taco", price: "$3.71" } });
  })
  test("Responds with 400 if name is missing", async () => {
    const res = await request(app).post("/items").send({});
    expect(res.statusCode).toBe(400);
  })
})

describe("/PATCH /items/:name", () => {
  test("Updating an item's name", async () => {
    const res = await request(app).patch(`/items/${pickles.name}`).send({ name: "Cucumber" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: { name: "Cucumber" } });
  })
  test("Responds with 404 for invalid name", async () => {
    const res = await request(app).patch(`/items/Piggles`).send({ name: "Cucumber" });
    expect(res.statusCode).toBe(404);
  })
})

describe("/DELETE /items/:name", () => {
  test("Deleting a item", async () => {
    const res = await request(app).delete(`/items/${pickles.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Deleted' })
  })
  test("Responds with 404 for deleting invalid item", async () => {
    const res = await request(app).delete(`/items/hamface`);
    expect(res.statusCode).toBe(404);
  })
})

