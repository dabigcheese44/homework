const keysContainer = document.querySelector('.keys');

function showNotes() {
    // Updates opacity of the notes when hovered over
    const notes = keysContainer.querySelectorAll('.note');
    notes.forEach(note => {
        note.style.opacity = '1';  
    });
}

function hideNotes() {
    const notes = keysContainer.querySelectorAll('.note');
    notes.forEach(note => {
        note.style.opacity = '0';  
    });
}

keysContainer.addEventListener('mouseover', showNotes);
keysContainer.addEventListener('mouseout', hideNotes);


