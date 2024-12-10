const {
  fetchAllPlayers,
  fetchSinglePlayer,
  addNewPlayer,
  removePlayer,
  renderAllPlayers,
  renderSinglePlayer,
  renderNewPlayerForm,
} = require("./script");

describe("fetchAllPlayers", () => {
  // Make the API call once before all the tests run
  let players;
  beforeAll(async () => {
    players = await fetchAllPlayers();
  });

  test("returns an array", async () => {
    expect(Array.isArray(players)).toBe(true);
  });

  test("returns players with name and id", async () => {
    players.forEach((player) => {
      expect(player).toHaveProperty("name");
      expect(player).toHaveProperty("id");
    });
  });
});

// TODO: Tests for `fetchSinglePlayer`
describe("fetchSinglePlayer", () => {
  let player = fetchSinglePlayer();
  test("returns an object", async () => {
    expect(Object.isObject(player)).toBe(true);
  });

  test("returns player with name, id, image, and details", async () => {
    expect(player).toHaveProperty("name");
    expect(player).toHaveProperty("id");
    expect(player).toHaveProperty("breed");
    expect(player).toHaveProperty("image");
    expect(player).toHaveProperty("team");
  });
});

// TODO: Tests for `addNewPlayer`
describe("addNewPlayer", () => {
  let player = addNewPlayer();
  test("adds an object", async () => {
    expect(Object.isObject(player)).toBe(true);
  });
  test("adds a player with name, id, image, and details", async () => {
    await fetch(`${BASE_URL}/players`, {method: "POST"} );
    
      players.push((player) => {
        expect(player).toHaveProperty("name");
        expect(player).toHaveProperty("id");
        expect(player).toHaveProperty("breed");
        expect(player).toHaveProperty("image");
        expect(player).toHaveProperty("team");
        Array.push({ playerName, id, breed, image, team });
      });
    test("returns an updated array", async () => {
      expect(Array.isArray(players)).toBe(true);
    });

    renderAllPlayers();
  });
});
// (Optional) TODO: Tests for `removePlayer`
describe("removePlayer", () => {
  let player = removePlayer();
  test("remove an object", async () => {
    expect(Object.isObject(player)).toBe(true);
  });
  test("removes a player with name, id, image, and details", async () => {
    await fetch(`${BASE_URL}/players/${id}`, {method: "DELETE"} );
    players.shift((player) => {
      expect(player).toHaveProperty("name");
      expect(player).toHaveProperty("id");
      expect(player).toHaveProperty("breed");
      expect(player).toHaveProperty("image");
      expect(player).toHaveProperty("team");
      Array.shift[0]({ playerName, id, breed, image, team });
    });
    removePlayer();
    test("returns an updated array", async () => {
      expect(Array.isArray(players)).toBe(true);
    });

    renderAllPlayers();
  });
});

/** Syncs state with the API and rerenders */
async function renderAllPlayers() {
  // console.log("Inside render");
  await fetchAllPlayers();
  renderSinglePlayer();
  renderNewPlayerForm();
}

// === Script ===

render();
