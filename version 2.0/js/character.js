// Select character to play with from DOM
const listPlayers = document.querySelector("#listPlayers")
const imagePlayers = document.querySelector("#imagePlayers")
const selectedPlayer = document.querySelector("#selectedPlayer")
const textFlavour = document.querySelector("#textFlavour")

const characters = [
    {name: "Croak", image: "images/character/croak.jpeg", textFlavour: "A talking frog who croaks with joy when capturing a piece. Surprisingly patient and zen in his playstyle.", nationality: "UK"},
    {name: "Nik", image: "images/character/nik.jpeg", textFlavour: "Too lazy to set up the board, so he uses food as pieces. A burger for the King, fries as pawns. He may snack mid-game—but don’t let that fool you, he’s a surprisingly clever player.", nationality: "USA"},
    {name: "Myrtle", image: "images/character/myrtle.jpeg", textFlavour: "Too fabulous to lose. Obsessed with symmetry on the board and only plays pretty moves.", nationality: "UK"},  
    {name: "Benny", image: "images/character/benny.jpeg", textFlavour: "A toddler prodigy in diapers who calculates five moves ahead… but sometimes eats the pieces.", nationality: "Italy"},
    {name: "Bongcloud", image: "images/character/bongcloud.jpeg", textFlavour: "He plays the Bongcloud unironically—and with terrifying confidence.", nationality: "USA"},
    {name: "Antonie", image: "images/character/antonie.jpeg", textFlavour: "He swears he’s just really good. But with suspiciously perfect moves and frequent bathroom breaks, even the pieces are side-eyeing him", nationality: "France"},
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