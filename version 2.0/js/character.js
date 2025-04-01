// Select character to play with from DOM
const listPlayers = document.querySelector("#listPlayers")
const imagePlayers = document.querySelector("#imagePlayers")
const selectedPlayer = document.querySelector("#selectedPlayer")

const characters = [
    {name: "BOT 1", image: "images/character/martin.png" , elo: 300},
    {name: "BOT 2", image: "images/character/martin.png" , elo: 600},
    {name: "BOT 3", image: "images/character/martin.png" , elo: 800},
    {name: "BOT 4", image: "images/character/martin.png" , elo: 900},
    {name: "BOT 5", image: "images/character/martin.png" , elo: 1000},
    {name: "BOT 6", image: "images/character/martin.png" , elo: 1200},
]

characters.forEach(character => {
    const botContainer = document.createElement("div")
    botContainer.classList.add("bot");

    const botImage = document.createElement("img");
    botImage.src = character.image;
    botImage.alt = character.name;

    const botName = document.createElement("p");
    botName.textContent = `${character.name} (${character.elo})`;

    // Append the image and name to the bot container
    botContainer.appendChild(botImage);
    botContainer.appendChild(botName);

    // Append the bot container to the #listPlayers or #imagePlayers
    listPlayers.appendChild(botContainer);
})