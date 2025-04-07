// Select character to play with from DOM
const listPlayers = document.querySelector("#listPlayers")
const imagePlayers = document.querySelector("#imagePlayers")
const selectedPlayer = document.querySelector("#selectedPlayer")
const textFlavour = document.querySelector("#textFlavour")

const characters = [
    {name: "Chelsea", image: "images/character/chelsea.jpeg", textFlavour: "She just started her chess career and is eager to learn."},
    {name: "Harlow", image: "images/character/harlow.jpeg", textFlavour: "A busy father of two who loves chess with his children. He would lose on purpose to let them win."},
    {name: "Elizabeth", image: "images/character/elizabeth.jpeg", textFlavour: "A victorian lady who loves chess. She is a master of the game and has a great sense of humor."},
]

characters.forEach(character => {
    const botContainer = document.createElement("div")
    botContainer.classList.add("bot");

    const botImage = document.createElement("img");
    botImage.src = character.image;
    botImage.alt = character.name;

    const botName = document.createElement("p");
    botName.textContent = `${character.name}`;

    // Append the image and name to the bot container
    botContainer.appendChild(botImage);
    botContainer.appendChild(botName);

    // Add click event listener to the bot container
    botContainer.addEventListener("click", () => {
        imagePlayers.innerHTML = `<img src="${character.image}" alt="${character.name}" class="selected-bot-image">`;
        selectedPlayer.textContent = character.name;
        textFlavour.textContent = character.textFlavour;
    })

    // Append the bot container to the #listPlayers or #imagePlayers
    listPlayers.appendChild(botContainer);
})