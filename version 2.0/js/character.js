// Select character to play with from DOM
const listPlayers = document.querySelector("#listPlayers")
const imagePlayers = document.querySelector("#imagePlayers")
const selectedPlayer = document.querySelector("#selectedPlayer")
const textFlavour = document.querySelector("#textFlavour")

const playButton = document.querySelector("#playButton");
const rightRectangle = document.querySelector("#rightRectangle");

const characters = [
    {name: "Croak", image: "images/character/croak.jpeg", textFlavour: "A talking frog who croaks with joy when capturing a piece. Surprisingly patient and zen in his playstyle.", nationality: "UK"},
    {name: "Nik", image: "images/character/nik.jpeg", textFlavour: "Too lazy to set up the board, so he uses food as pieces. A burger for the King, fries as pawns. He may snack mid-game—but don’t let that fool you, he’s a surprisingly clever player.", nationality: "USA"},
    {name: "Myrtle", image: "images/character/myrtle.jpeg", textFlavour: "Too fabulous to lose. Obsessed with symmetry on the board and only plays pretty moves.", nationality: "UK"},  
    {name: "Benny", image: "images/character/benny.jpeg", textFlavour: "A toddler prodigy in diapers who calculates five moves ahead… but sometimes eats the pieces.", nationality: "Italy"},
    {name: "Bongcloud", image: "images/character/bongcloud.jpeg", textFlavour: "He plays the Bongcloud unironically—and with terrifying confidence.", nationality: "USA"},
    {name: "Antonie", image: "images/character/antonie.jpeg", textFlavour: "He swears he’s just really good. But with suspiciously perfect moves and frequent bathroom breaks, even the pieces are side-eyeing him", nationality: "France"},
]

const characterDialogues = [
    {
        name: "Croak",
        dialogues: {
            greeting: "Let's hop into it. No lily-padding around!",
            playerCapture1: "Croak! That's a leap in the right direction!",
            botCapture1: "Snatched like a fly on a summer day.",
            playerCheckmate: "Crooooaak... My pond... my pride…",
            botCheckmate: "You tried your best, but I leapt ahead.",
        }
    },
    {
        name: "Nik",
        dialogues: {
            greeting: "Hi guys… welcome back to another emotional chess breakdown.",
            playerCapture1: "I'm calling CORPORATE!!",
            botCapture1: "Caught you slipping—like I do with mozzarella sticks.",
            playerCheckmate: "NANCY!!!!!!!!!",
            botCheckmate: "I am always two steps ahead...",
        }
    },
    {
        name: "Myrtle",
        dialogues: {
            greeting: "Darling, let’s make this game as fabulous as my outfit.",
            playerCapture1: "Oh, darling! A move so pretty it deserves a runway.",
            botCapture1: "Oh, sweetie, that was a tragic choice.",
            playerCheckmate: "Oh no, my perfect symmetry!",
            botCheckmate: "Oh, sweetie, that was a tragic choice.",
        }
    },
    {
        name: "Benny",
        dialogues: {
            greeting: "Goo ga ga, I need... I need some milk...",
            playerCapture1: "Gimme it back or I CRY.",
            botCapture1: "CRONCH! Mmm... spicy...",
            playerCheckmate: "Huh... MOM! MOMMMMY!!!",
            botCheckmate: "You got beat by a baby! Goo goo bye bye!",
        }
    },
    {
        name: "Bongcloud",
        dialogues: {
            greeting: "Bongcloud is the only opening that matters.",
            playerCapture1: "You tryin’ so hard. Just relax, bro.",
            botCapture1: "That’s the power of king e2, baby.",
            playerCheckmate: "I’m still winning in my heart.",
            botCheckmate: "This was never about the board. It was about the journey.",
        }
    },
    {
        name: "Antonie",
        dialogues: {
            greeting: "Just a normal, fair match. I swear.",
            playerCapture1: "Hmm, give me... 5 minutes, I need to go to the restroom.",
            botCapture1: "My... uh... brain calculated that in 0.0001s.",
            playerCheckmate: "You were clearly using an engine. I saw it.",
            botCheckmate: "When you’re as good as me, you don’t need help. But it helps.",
        }
    }
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
        playButton.dataset.selectedBot = character.name; // Store the selected bot's name
        console.log(playButton.dataset.selectedBot); // Should log the selected bot's name
    })
    
    // Append the bot container to the #listPlayers or #imagePlayers
    listPlayers.appendChild(botContainer);
})

// Add event listener to play button
playButton.addEventListener("click", () => {
    const selectedBot = playButton.dataset.selectedBot; // Get the selected bot's name
    if (!selectedBot) {
        alert("Please select a character before playing!");
        return;
    }

    const bot = characters.find(character => character.name === selectedBot);
    if (!bot) {
        alert("Selected bot not found!");
        return;
    }

    // Access the greeting dialogue without overwriting the dialogues object
    const greeting = characterDialogues.find(dialogue => dialogue.name === bot.name)?.dialogues.greeting;
    if (!greeting) {
        alert("Dialogue not found for the selected bot!");
        return;
    }

    console.log(greeting); // Should log the bot's greeting

    // Replace the rectangle content with the bot's greeting
    rightRectangle.innerHTML = `
        <div class="rightRectangleHeader">
            <h1>${bot.name} Says:</h1>
        </div>
        <div class="bot-greeting">
            <img src="${bot.image}" alt="${bot.name}" class="bot-greeting-image">
            <p id="botDialogue">${greeting}</p>
        </div>
        <button id="resignButton">Resign</button>
    `;

    // Add functionality to the Resign button
    const resignButton = document.querySelector("#resignButton");
    resignButton.addEventListener("click", () => {
        location.reload(); // Reload the page to reset the rectangle
    });
});