const keyMap = {
    'a': 'a-key',
    's': 's-key',
    'd': 'd-key',
    'f': 'f-key',
    'g': 'g-key',
    'h': 'h-key',
    'j': 'j-key',
    'k': 'k-key',
    'l': 'l-key',
    ';': ';-key',
    'w': 'w-key',
    'e': 'e-key',
    't': 't-key',
    'y': 'y-key',
    'u': 'u-key',
    'o': 'o-key',
    'p': 'p-key'
};

const sound = {
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

let keySequence = [];
const greatOldOneSequence = ['w', 'e', 's', 'e', 'e', 'y', 'o', 'u']; 

let pianoDisable = false;

const piano = document.getElementById('piano');
const greatOldOne = document.getElementById('great-old-one');

document.addEventListener('keydown', (event) => {
    if (pianoDisable){
        return;
    }

    // Removes case sensitivity 
    const key = event.key.toLowerCase();
    const keyElement = document.getElementById(keyMap[key]);

    keySequence.push(key);

    // Checks to make sure sequence doesn't exceed length of target sequence
    if (keySequence.length > greatOldOneSequence.length){
        keySequence.shift();
    }

    // Handles when a key is pressed
    if (keyElement) {
        keyElement.classList.add('pressed');
    }

    // PLays a sound
    if (sound[key]) {
        const audio = new Audio(sound[key]);
        audio.play();
    }

    // Turns arrays to strings to check if they match
    if (keySequence.join('') === greatOldOneSequence.join('')){
        console.log("Sequence matched:", keySequence.join(''));
        awakenTheGreatOldOne();
    }
});

document.addEventListener('keyup', (event) => {
    if (pianoDisable) {
        return;
    }

    const key = event.key.toLowerCase();
    const keyElement = document.getElementById(keyMap[key]);

    if (keyElement) {
        keyElement.classList.remove('pressed');
    }
});

function awakenTheGreatOldOne() {
    //disables the piano and shows the great old one
    piano.classList.add('disabled');
    greatOldOne.classList.add('show'); 

    pianoDisable = true;

    // Change title 
    const greatOldOneTitle = document.querySelector('.title p');
    greatOldOneTitle.textContent = 'I have awoken';

    const greatOldOneSound = new Audio("../static/main/audio/Creepy-piano-sound-effect.mp3");
    greatOldOneSound.play();
}