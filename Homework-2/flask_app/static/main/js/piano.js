document.addEventListener("DOMContentLoaded", () => {
    const keysContainer = document.querySelector(".keys");
    const piano = document.getElementById("piano");
    const greatOldOne = document.getElementById("great-old-one");
    const greatOldOneTitle = document.querySelector(".title p");

    const keyMap = {
        'a': 'a-key', 's': 's-key', 'd': 'd-key', 'f': 'f-key', 'g': 'g-key',
        'h': 'h-key', 'j': 'j-key', 'k': 'k-key', 'l': 'l-key', ';': 'semi-key',
        'w': 'w-key', 'e': 'e-key', 't': 't-key', 'y': 'y-key', 'u': 'u-key',
        'o': 'o-key', 'p': 'p-key'
    };

    // Preload audio objects
    const sound = {};
    const soundURLs = {
        'a': "http://carolinegabriel.com/demo/js-keyboard/sounds/040.wav",
        'w': "http://carolinegabriel.com/demo/js-keyboard/sounds/041.wav",
        's': "http://carolinegabriel.com/demo/js-keyboard/sounds/042.wav",
        'e': "http://carolinegabriel.com/demo/js-keyboard/sounds/043.wav",
        'd': "http://carolinegabriel.com/demo/js-keyboard/sounds/044.wav",
        'f': "http://carolinegabriel.com/demo/js-keyboard/sounds/045.wav",
        't': "http://carolinegabriel.com/demo/js-keyboard/sounds/046.wav",
        'g': "http://carolinegabriel.com/demo/js-keyboard/sounds/047.wav",
        'y': "http://carolinegabriel.com/demo/js-keyboard/sounds/048.wav",
        'h': "http://carolinegabriel.com/demo/js-keyboard/sounds/049.wav",
        'u': "http://carolinegabriel.com/demo/js-keyboard/sounds/050.wav",
        'j': "http://carolinegabriel.com/demo/js-keyboard/sounds/051.wav",
        'k': "http://carolinegabriel.com/demo/js-keyboard/sounds/052.wav",
        'o': "http://carolinegabriel.com/demo/js-keyboard/sounds/053.wav",
        'l': "http://carolinegabriel.com/demo/js-keyboard/sounds/054.wav",
        'p': "http://carolinegabriel.com/demo/js-keyboard/sounds/055.wav",
        ';': "http://carolinegabriel.com/demo/js-keyboard/sounds/056.wav"
    };

    // Preload the sounds
    Object.keys(soundURLs).forEach(key => {
        sound[key] = new Audio(soundURLs[key]);
        sound[key].load();
    });

    let keySequence = [];
    const greatOldOneSequence = ['w', 'e', 's', 'e', 'e', 'y', 'o', 'u']; 
    let pianoDisable = false;

    function toggleNotes(visible) {
        keysContainer.querySelectorAll(".note").forEach(note => {
            note.style.opacity = visible ? "1" : "0";
        });
    }

    // Handle mouse hover events
    keysContainer.addEventListener("mouseenter", () => toggleNotes(true));
    keysContainer.addEventListener("mouseleave", () => toggleNotes(false));

    // Handle key press events
    document.addEventListener("keydown", (event) => {
        if (pianoDisable) return;
        const key = event.key.toLowerCase();
        const keyElement = document.getElementById(keyMap[key]);

        // Prevent duplicate keydown events
        if (!keyElement || keyElement.classList.contains("pressed")) return;
        
        keySequence.push(key);
        if (keySequence.length > greatOldOneSequence.length) keySequence.shift();

        keyElement.classList.add("pressed");

        // Play preloaded sound instantly
        if (sound[key]) {
            sound[key].currentTime = 0; // Reset to allow rapid replays
            sound[key].play();
        }

        if (keySequence.join("") === greatOldOneSequence.join("")) {
            console.log("Sequence matched:", keySequence.join(""));
            awakenTheGreatOldOne();
        }
    });

    // Handle key release events
    document.addEventListener("keyup", (event) => {
        if (pianoDisable) return;

        const key = event.key.toLowerCase();
        const keyElement = document.getElementById(keyMap[key]);

        if (keyElement) keyElement.classList.remove("pressed");
    });

    // Function to trigger the awakening of the Great Old One
    function awakenTheGreatOldOne() {
        if (!piano || !greatOldOne || !greatOldOneTitle) return;

        piano.classList.add("disabled");
        greatOldOne.classList.add("show"); 
        pianoDisable = true;

        greatOldOneTitle.textContent = "I have awoken";

        const greatOldOneSound = new Audio("../static/main/audio/Creepy-piano-sound-effect.mp3");
        greatOldOneSound.play();

        // Reset the title after a few seconds
        setTimeout(() => {
            greatOldOneTitle.textContent = "The piano of the Great Old One";
        }, 5000);
    }
});
