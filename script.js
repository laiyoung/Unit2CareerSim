// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "2409-GHP-ET-WEB-PT";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

// === State ===

const state = {
  players: [],
};

// === References ===
const form = document.getElementById("new-player-form");
/** May need a const for playerId */


// === Functions ===
/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  try {
    const promise = await fetch(API_URL);
    const response = await promise.json();

    if (!response.success) {
      throw response.error;
    }
    console.log(response.data);
    state.players = response.data;
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
    // This playerId designation doesn't match the API reference(player-ID)
    // TODO
    await fetch(`${BASE_URL}/players/${id}`, {
      method: 'GET',
    });
    // const id = window.location.hash.slice(1);
    state.players = state.players.find((player) => player.id === +id);
    
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (playerObj) => {
  try {
    const promise = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerObj),
    });
    const response = await promise.json();
    console.log(response);

    if (!response.success) {
      throw response.error;
    }
    console.log(response.data);
    render();
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
    // This playerId designation doesn't match the API reference(player-ID)
    await fetch(API_URL + "/" + playerId, {
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

// === Event Listener for Submissions and Details ===
/** The template has this event listener designed as a render... */
form.addEventListener("submit", async (player) => {
  player.preventDefault();
  const formData = new FormData(form);
  try {
    const newPlayer = {
      name: formData.get("playerName"),
      breed: formData.get("playerBreed"),
      picture: formData.get("imageUrl"),
      team: formData.get("teamNumber"), 
      // team needs a math.random to cap #s (default is null)
      // status: bench or field (needs a math.random)
      // playerId: needs to be a unused number (probably needs a math.random)
    };
    await addNewPlayer(newPlayer);
    form.reset();
  } catch (error) {
    console.log(error);
  }
});
/**Need another event listener for the details side panel? */

// === Renders ===

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
const renderAllPlayers = (playerList) => {
    const playerList = document.querySelector("#new-player-form");
    if (!state.players.length) {
      playerList.innerHTML = "<li>No players.</li>";
      return;
    }
    const playerElements = state.players.map((player) => {
      const playerCard = document.createElement("section");
      playerCard.innerHTML = `
        <div>
          <h3>${player.name}</h3>
          <p>${player.id}</p>
          <p>${player.picture}</p>
        </div>
      `;
  
      // Delete Button and Event Listener
      const deleteButton = document.createElement("button");
      deleteButton.innerText = "Delete Player";
      playerCard.append(deleteButton);
      deleteButton.addEventListener("click", () => removePlayer(player));
  
      return playerCard;
    });
  
    playerList.replaceChildren(...playerElements);
};

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
  // TODO
};

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */
const renderNewPlayerForm = () => {
  // Last time we did this with a button + Event Listener (it's above)
  try {
    // TODO
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};


/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  // Should this be state.players?
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  renderNewPlayerForm();
};

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
  init();
}
