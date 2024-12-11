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
console.log(form);
const playerList = document.getElementById("playerList");
// const player = state.players[i]
// Do I need a const for playerId



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
    console.log(state.players);
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
    console.log(playerId.id);
    await fetch(API_URL + "/players/" + playerId.id, {
     method: "GET",
     headers: {
       "Content-Type": "application/json",
     },
   });
   render();
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
    console.log(response);

    if (!response.success) {
      throw response.error;
    }
    console.log(state.players);
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
     console.log(playerId.id);
     await fetch(API_URL + "/players/" + playerId.id, {
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
// === Navigation Functions ===
// function openNav() {
//   document.getElementById("mySidepanel").style.width = "250px";
// }

// === Event Listeners ===

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
  // Post to endpoint with current form values to create and add an event
   await addNewPlayer(newPlayer)

  // Clear form inputs
  form.reset();
} catch (err) {
  console.log(err);
}
 
});
// form.reset();
 // await addNewPlayer(newPlayer);

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
        <input
          id="numberClear"
          name="teamNumber"
          type="number"
          min="1"
          max="2"
        />
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
async function renderAllPlayers() {
  if (!state.players.length) {
    playerList.innerHTML = "<p>No players.</p>";
    return;
  }
  const playerElements = state.players.map((player) => {
    // console.log(player)
    const playerCard = document.createElement("section");
    playerCard.innerHTML = `
        <div>
          <h3>${player.name}</h3>
          <p>Player ID: <p>
          <p>${player.id}</p>
        </div>
      `;
    // Player Details Button and Event Listener:
    const detailsButton = document.createElement("button");
    detailsButton.innerText = "Player Details";
    playerCard.append(detailsButton);
    detailsButton.addEventListener("click", () => fetchSinglePlayer(player));
    // detailsButton.addEventListener("click", () => fetchSinglePlayer(player));
    // // openNav();

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
    deleteButton.addEventListener("click", () => removePlayer(player));

    return playerCard;
  });

  playerList.replaceChildren(...playerElements);
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
  // TODO
};

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
async function render() {
  renderNewPlayerForm();
  await fetchAllPlayers();
  renderAllPlayers();
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
