// Select character to play with from DOM
const listPlayers = document.querySelector("#listPlayers")
const imagePlayers = document.querySelector("#imagePlayers")
const selectedPlayer = document.querySelector("#selectedPlayer")
const textFlavour = document.querySelector("#textFlavour")

const characters = [
    {name: "Nikocado Avocado", image: "images/character/nikocado avocado.jpeg", textFlavour: "Once known for dramatic mukbangs, he's now channeling that same chaotic energy into chess. Emotional, unpredictable, and surprisingly strategic when he's not mid-snack."},
    {name: "Chelsea", image: "images/character/chelsea.jpeg", textFlavour: "She just started her chess career and is eager to learn. Full of curiosity and determination, she sees every loss as a chance to grow."},
    {name: "Harlow", image: "images/character/harlow.jpeg", textFlavour: "A busy father of two who loves playing chess with his children. He often lets them win, finding more joy in their smiles than in victory."},
    {name: "Elizabeth", image: "images/character/elizabeth.jpeg", textFlavour: "A Victorian lady with a sharp mind and a sharper wit. A true master of the game, she blends strategy with charm, always ready with a clever remark."},
    {name: "Luke", image: "images/character/luke.jpeg", textFlavour: "A sharp-suited businessman who plays chess to unwind after high-stakes meetings. Calm, collected, and always three steps ahead—even when he's just playing for fun."},
    {name: "Miss", image: "images/character/miss.jpeg", textFlavour: "Elegant and efficient, Miss is half-human, half-machine—with circuits on the left and grace on the right. She calculates ten moves ahead, but still enjoys the thrill of a human surprise."},
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