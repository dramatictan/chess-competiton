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
            playerCapture2: "That move was dirtier than a swamp toe.",
            playerCapture3: "Touch my piece again, and I swear—no lily pad is safe.",
            botCapture1: "Snatched like a fly on a summer day.",
            botCapture2: "Don't hate the frog, hate the game",
            botCapture3: "Croak! That piece was practically begging to be eaten.",
            playerQueenCapture: "You will rue this day, pond scum.",
            botQueenCapture: "Bow before the Amphibian King.",
            playerCheckmate: "Crooooaak... My pond... my pride…",
            botCheckmate: "You tried your best, but I leapt ahead.",
        }
    },
    {
        name: "Nik",
        dialogues: {
            greeting: "Hi guys… welcome back to another emotional chess breakdown.",
            playerCapture1: "I'm calling CORPORATE!!",
            playerCapture2: "This is harassment. I'm literally shaking.",
            playerCapture3: "Popeyes chicken sandwich is better than this.",
            botCapture1: "Caught you slipping—like I do with mozzarella sticks.",
            botCapture2: "Don't forget to pay for my Pateron subscription, where you can see more unfiltered me not allowed on Youtube.",
            botCapture3: "Don't worry, I'll save a piece for you.",
            playerQueenCapture: "*grabs a broomstick aiming at you.*",
            botCheckmate: "Check her crown, she's still here.",
            playerCheckmate: "NANCY!!!!!!!!!",
            botCheckmate: "I am always two steps ahead...",
            botAbility: "My hands are messy and greasy, but my moves are clean.",
        }
    },
    {
        name: "Myrtle",
        dialogues: {
            greeting: "Darling, let’s make this game as fabulous as my outfit.",
            playerCapture1: "Oh, darling! A move so pretty it deserves a runway.",
            playerCapture2: "Chic *and* strategic? We love a multi-talented queen.",
            playerCapture3: "That move had more grace than my last gala entrance.",
            botCapture1: "Oh, sweetie, that was a tragic choice.",
            botCapture2: "Snatched—like my waist in couture.",
            botCapture3: "Beauty *and* brains. I’m the full package.",
            playerQueenCapture: "You didn’t just take my queen—you shattered the aesthetic!",
            botQueenCapture: "That is Checkmate in your spirit.",
            playerCheckmate: "Oh no, my perfect symmetry!",
            botCheckmate: "Oh, sweetie, that was a tragic choice. Now strike a pose and reflect.",
        }
    },
    {
        name: "Benny",
        dialogues: {
            greeting: "Goo ga ga, I need... I need some milk...",
            playerCapture1: "Gimme it back or I CRY.",
            playerCapture2: "WAAAH! You meanie!!",
            playerCapture3: "That's MY toy! MINE!",
            botCapture1: "CRONCH! Mmm... spicy...",
            botCapture2: "*Nom nom nom*—tastes like checkmate!",
            botCapture3: "Yummy! What does bishop taste like? Weird milk?",
            playerQueenCapture: "Queens are like my mommy. I need her!",
            botQueenCapture: "*sobs*",
            playerCheckmate: "Huh... MOM! MOMMMMY!!!",
            botCheckmate: "You got beat by a baby! Goo goo bye bye!",
            botAbility: "*burp*"
        }
    },
    {
        name: "Bongcloud",
        dialogues: {
            greeting: "Bongcloud is the only opening that matters.",
            playerCapture1: "You tryin’ so hard. Just relax, bro.",
            playerCapture2: "That was a solid move. For someone who doesn’t believe in fun.",
            playerCapture3: "Bro, you overthinking. Let your king breathe.",
            botCapture1: "That’s the power of king e2, baby.",
            botCapture2: "Gone. Just like your winning chances.",
            botCapture3: "Oops—didn’t see it, still better than your plan.",
            playerQueenCapture: "You think you’re so clever, huh?",
            botQueenCapture: "You polished that piece just for me? Aww, thanks.",
            playerCheckmate: "You know, you could just play the Bongcloud too.",
            botCheckmate: "This was never about the board. It was about the journey.",
        }
    },
    {
        name: "Antonie",
        dialogues: {
            greeting: "Just a normal, fair match. I swear.",
            playerCapture1: "Hmm, give me... 5 minutes, I need to go to the restroom.",
            playerCapture2: "Was that supposed to be a sacrifice? I’ll be back in a sec, no worries.",
            playerCapture3: "*blindly capture the piece*",
            botCapture1: "My... uh... brain calculated that in 0.0001s.",
            botCapture2: "Not exactly the move I’d suggest, but... okay.",
            botCapture3: "*nervously adjusts* I wasn’t expecting that.",
            playerCheckmate: "You were clearly using an engine. I saw it.",
            playerQueenCapture: "No! Not my queen! I—I should've prepared better...",
            botQueenCapture: "You... you took my queen? My precious queen... *sighs*.",
            botCheckmate: "When you’re as good as me, you don’t need help. But it helps.",
            botAbility1: "*a sound vibrates beneath his chair.*",
            botAbility2: "*his finger made some fast movements on the board.*",
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