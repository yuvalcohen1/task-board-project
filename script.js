const state = {
    notes: []
};

// set today's date variable
let today = new Date();
let dd = today.getDate();
let mm = today.getMonth() + 1;
const yyyy = today.getFullYear();

if (dd < 10) {
    dd = '0' + dd;
}
if (mm < 10) {
    mm = '0' + mm;
}

today = `${yyyy}-${mm}-${dd}`;

// set current time variable
let currentHour = new Date().getHours();
if (currentHour < 10) {
    currentHour = '0' + currentHour;
}
let currentMinutes = new Date().getMinutes();
if (currentMinutes < 10) {
    currentMinutes = '0' + currentMinutes;
}
const currentTime = `${currentHour}:${currentMinutes}`;


main();


function main() {
    loadFromLocalStorage();
    setMinTimeOfToday();
    setMinDate();
    initNoteForm();
    resetForm();
}


function initNoteForm() {
    const formEl = document.querySelector(".main-form");
    formEl.addEventListener("submit", (e) => {
        e.preventDefault();

        const note = {
            description: formEl.description.value,
            date: formEl.date.value,
            time: formEl.time.value
        };

        const validationError = validateTextInput(note);
        if (validationError) {
            alert(validationError);
            return;
        }
        
        saveNote(note);

        createNoteEl(note);

        formEl.reset();
    });
}


function createNoteEl(note) {
    const noteEl = document.createElement("div");
    noteEl.classList.add("note");

    noteEl.innerHTML = `
    <div class="description-container">
        <p class="description">
            ${note.description}
        </p>
    </div>
    <div class="date-time">
        <div class="date">
            ${note.date}
        </div>
        <div class="time">
            ${note.time}
        </div>
    </div>
    <i class="fas fa-times delete"></i>
    `;
    
    const xBtn = noteEl.querySelector(".delete");
    xBtn.addEventListener("click", () => {
        // remove note from screen
        noteEl.remove();
        // remove note from state
        const indexOfDeletedNote = state.notes.indexOf(note);
        state.notes.splice(indexOfDeletedNote, 1);
        // remove note from localStorage
        const stateNotesAsJsonString = JSON.stringify(state.notes);
        localStorage.setItem('notes', stateNotesAsJsonString);
    });

    renderNotes(noteEl);
}


function renderNotes(noteEl) {
    const notesContainer = document.querySelector(".notes-container");

    notesContainer.appendChild(noteEl);
}


function setMinDate() {
    const dateInput = document.querySelector(".date-input");
    dateInput.setAttribute("min", today);
}


function setMinTimeOfToday() {
    const dateInput = document.querySelector(".date-input");
    dateInput.addEventListener("change", e => {
        if (e.target.value === today) {
            const timeInput = document.querySelector(".time-input");
            timeInput.min = currentTime;
        }
    });
}


function resetForm() {
    const formEl = document.querySelector(".main-form");
    const resetEl = document.querySelector(".reset-btn");
    resetEl.addEventListener("click", () => formEl.reset());
}


function saveNote(note) {
    state.notes.push(note);

    const stateNotesAsJsonString = JSON.stringify(state.notes);
    localStorage.setItem('notes', stateNotesAsJsonString);
}

// load from local storage the updated array of notes after removing the expired notes
function loadFromLocalStorage() {
    const notesAsRegularCode = JSON.parse(localStorage.getItem("notes")) || [];
    const validNotes = notesAsRegularCode.filter(note => (note.date > today) || (note.date === today && note.time >= currentTime));
    const validNotesAsJsonString = JSON.stringify(validNotes);
    localStorage.setItem("notes", validNotesAsJsonString);

    for (const note of validNotes) {
        state.notes.push(note);
        createNoteEl(note);
    }
}

function validateTextInput(note) {
    if (note.description.trim() === "") {
        return "description can't remain empty or contain only spaces. please enter some words...";
    }
    return null;
}