// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "2409-GHP-ET-WEB-PT";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

// === State ===

const state = {
  players: [],
  player: {},
  teams: [],
};

// === References ===
const form = document.getElementById("new-player-form");
console.log(form);
const playerList = document.getElementById("playerList");

// === API Functions ===
/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  try {
    const promise = await fetch(API_URL + "/players");
    const response = await promise.json();

    if (!response.success) {
      throw response.error;
    }
    console.log(response.data);
    state.players = response.data.players;
    // console.log(state.players);
    return response.data.players;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    console.log(playerId);
    const promise = await fetch(API_URL + "/players/" + playerId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await promise.json();
    state.player = response.data.player;
    // console.log(response.data.player);
    return response.data.player
  } catch (err) {
    console.error(
      `Whoops, trouble getting player #${playerId} from the roster!`,
      err
    );
  }
};

/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (playerObj) => {
  try {
    const promise = await fetch(API_URL + "/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerObj),
    });
    const response = await promise.json();
    // console.log(response);

    if (!response.success) {
      throw response.error;
    }
    // console.log(state.players);
    render();
    return response.data.newPlayer
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (playerId) => {
  try {
    console.log(playerId);
    await fetch(API_URL + "/players/" + playerId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    render();
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};
/**
 * Fetches the team IDs from the API.
 */
async function fetchTeams() {
  try {
    const promise = await fetch(
      "https://fsa-puppy-bowl.herokuapp.com/api/COHORT-NAME/teams"
    );
    const response = await promise.json();
    console.log(response);
    state.teams = response.data.teams;
    console.log(state.teams);
  } catch (err) {
    console.error(err);
  }
}
fetchTeams();

// === Event Listener ===

// Form Listener:
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    const formData = new FormData(form);
    const newPlayer = {
      name: form.playerName.value,
      breed: form.playerBreed.value,
      image: form.imageUrl.value,
    };
    console.log(newPlayer);
    // Post to endpoint with current form values to create and add a player
    await addNewPlayer(newPlayer);

    // Clear form inputs
    form.reset();
  } catch (err) {
    console.log(err);
  }
});

// === Renders ===

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */
async function renderNewPlayerForm() {
  try {
    form.innerHTML = `
        <div>
         <label for="playerName">Name:</label>
        <input
          id="playerName"
          name="playerName"
          type="text"
          placeholder="New Puppy's Name"
          required
        />
        </div>
        <div>
        <label for="playerBreed">Puppy Breed:</label>
        <input
          id="playerBreed"
          name="playerBreed"
          type="text"
          placeholder="What breed is your puppy?"
        />
        </div>
        <div>
        <label> Picture: </label>
        <input type="text" name="imageUrl" placeholder="Image URL" />
    </div>
    <div>
        <label> Pick a Puppy Team: </label>
       <select id="teams">
        <option>Available Teams</option>
        <option>Ruff</option>
        <option>Fluff</option>
    </select>
        </div>
        <div>
        <button type="submit">Add Puppy</button> 
        </div>
      `;
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
}

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
async function renderAllPlayers(players) {
  // console.log("RENDERALL",players);
  if (!players.length) {
    playerList.innerHTML = "<p>No players.</p>";
    return;
  }
  const playerElements = players.map((player) => {
    // console.log("MAP",player)
    const playerCard = document.createElement("section");
    playerCard.innerHTML = `
        <div>
          <h3>${player.name}</h3>
          <p>Player ID: ${player.id} </p>
        </div>
      `;
    playerList.append(playerCard);
    // console.log("CARD",playerCard.innerHTML);

    // Player Details Button and Event Listener:
    const detailsButton = document.createElement("button");
    detailsButton.innerText = "Player Details";
    playerCard.append(detailsButton);
    detailsButton.addEventListener("click", async () => {
      await fetchSinglePlayer(player.id);
      renderSinglePlayer(state.player);
    });

    // Image Set Up:
    const image = document.createElement("img");
    //set the img src to be the imageUrl from the player object
    image.src = player.imageUrl;
    image.style.width = "50%";
    image.style.height = "50%";
    playerCard.append(image);

    // Delete Button and Event Listener:
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete Player";
    playerCard.append(deleteButton);
    deleteButton.addEventListener("click", () => removePlayer(player.id));

    return playerCard;
  });
  // console.log("BEFOREREPLACE", playerElements);
  playerList.replaceChildren(...playerElements);
  // console.log("AFTERPLACE", playerList.innerHTML);
}

/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = (player) => {
  const details = document.createElement("section");
  details.innerHTML = `
  <h3>${player.name}</h3>
   <p>Player ID: ${player.id} </p>
    <p>Player Status: ${player.status}<p>
    <p>Team ID: ${player.teamId}</p>
   
`;

  // Image Set Up:
  const image = document.createElement("img");
  //set the img src to be the imageUrl from the player object
  image.src = player.imageUrl;
  image.style.width = "50%";
  image.style.height = "50%";
  details.append(image);

  const backButton = document.createElement("button");
  backButton.innerText = "Back to Roster";
  details.append(backButton);
  backButton.addEventListener("click", () => render());

  playerList.replaceChildren(details);
};

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
async function render() {
  renderNewPlayerForm();
  await fetchAllPlayers();
  renderAllPlayers(state.players);
}

render();

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
    removePlayer,
    renderAllPlayers,
    renderSinglePlayer,
    renderNewPlayerForm,
  };
} else {
  render();
}
