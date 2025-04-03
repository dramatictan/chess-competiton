// Select character to play with from DOM
const listPlayers = document.querySelector("#listPlayers")
const imagePlayers = document.querySelector("#imagePlayers")
const selectedPlayer = document.querySelector("#selectedPlayer")

const characters = [
    {name: "Nikocado Avocado", image: "images/character/nikocado.jpeg" , elo: 300},
    {name: "Scout", image: "images/character/scout.jpeg" , elo: 600},
    {name: "BOT 3", image: "images/character/martin.png" , elo: 800},
    {name: "BOT 4", image: "images/character/martin.png" , elo: 900},
    {name: "Spy", image: "images/character/spy.jpeg" , elo: 1000},
    {name: "BOT 6", image: "images/character/martin.png" , elo: 1200},
]

characters.forEach(character => {
    const botContainer = document.createElement("div")
    botContainer.classList.add("bot");

    const botImage = document.createElement("img");
    botImage.src = character.image;
    botImage.alt = character.name;

    const botName = document.createElement("p");
    botName.textContent = `${character.name} | ELO: (${character.elo})`;

    // Append the image and name to the bot container
    botContainer.appendChild(botImage);
    botContainer.appendChild(botName);

    // Append the bot container to the #listPlayers or #imagePlayers
    listPlayers.appendChild(botContainer);
})