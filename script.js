'use strict';


const title = document.getElementById('title');
const noteText = document.getElementById('note-text');
const saveButton = document.getElementById('save-button');
let modal = document.getElementById('modal');
let deletedModal = document.getElementById('deleted-modal');
let notes = document.getElementById('notes');
let trash = document.getElementById('trash');

let noteList = [];
let trashList = [];

class Note {
    constructor(title, note) {
        this.title = title;
        this.note = note;
    }
}


saveButton.onclick = () => {
    const titleValue = title.value;
    const noteValue = noteText.value;

    if (titleValue && noteValue) {
        let newNote = new Note (titleValue, noteValue);
        noteList.push(newNote);
        localStorage.setItem('note', JSON.stringify(noteList));
        title.value = '';
        noteText.value = '';
    } else {
        document.getElementById('tooltiptext').style.visibility = 'visible';

        setTimeout(() => {
            document.getElementById('tooltiptext').style.visibility = 'hidden';
        }, 3_000);
    }

    displayNotes();
};


const displayNotes = () => {
    let index = 0;
    notes.innerHTML = '';
    noteList.forEach(note => {
        notes.innerHTML += /*html*/ `
            <article class="saved-note">
                <input type="text" class="saved-title" disabled value="${note.title}">
                <textarea class="saved-text" cols="30" rows="10" disabled>${note.note}</textarea>
                <div>
                    <button class="delete-button" onclick="deleteNote(${index})">Delete</button>
                    <button class="edit-button" onclick="editNote(${index})">Edit</button>
                    <button class="save-edit-button" onclick="saveNote(${index})">Save</button>
                    <img class="note-menu" id="note-menu" src="img/icons/dots.png" alt="dots" onclick="openMenu(${index})">
                </div>
            </article>
        `;

        index++;
    });
};


const displayTrash = () => {
    let index = 0;
    trash.innerHTML = '';
    trashList.forEach(note => {
        trash.innerHTML += /*html*/ `
            <article>
                <input type="text" class="saved-title" disabled value="${note.title}">
                <textarea class="saved-text" cols="30" rows="10" disabled>${note.note}</textarea>
                <div>
                    <button class="finally-delete-note" onclick="openDeleteModal(${index})">Delete</button>
                    <button class="restore-note" onclick="restoreNote(${index})">Restore</button>
                    <img class="note-menu" id="trash-menu" src="img/icons/dots.png" alt="dots" onclick="openTrashMenu(${index})">
                </div>
            </article>
        `;

        index++;
    });
};


const openMenu = (index) => {
    let editButton = document.getElementsByClassName('edit-button')[index];
    let deleteButton = document.getElementsByClassName('delete-button')[index];
    let saveButton = document.getElementsByClassName('save-edit-button')[index];

    if (editButton.style.visibility === 'visible') {
        editButton.style.visibility = 'hidden';
        deleteButton.style.visibility = 'hidden';
        saveButton.style.visibility = 'hidden';
    } else {
        editButton.style.visibility = 'visible';
        deleteButton.style.visibility = 'visible';
    }
};


const openTrashMenu = (index) => {
    let restoreButton = document.getElementsByClassName('restore-note')[index];
    let deleteButton = document.getElementsByClassName('finally-delete-note')[index];
    if (restoreButton.style.visibility === 'visible') {
        restoreButton.style.visibility = 'hidden';
        deleteButton.style.visibility = 'hidden';
    } else {
        restoreButton.style.visibility = 'visible';
        deleteButton.style.visibility = 'visible';
    }
};


const restoreNote = (index) => {
    noteList.push(trashList[index]);
    localStorage.setItem('note', JSON.stringify(noteList));
    trashList.splice(index, 1);
    localStorage.setItem('trash', JSON.stringify(trashList));
    displayTrash();
    displayNotes();
};


const openDeleteModal = (index) => {
    let finallyDeleteNote = document.getElementById('finally-delete-note');
    modal.style.display = 'block';
    finallyDeleteNote.setAttribute('onclick', `deleteFinally(${index})`);
};


const deleteFinally = (index) => {
    trashList.splice(index, 1);
    localStorage.setItem('trash', JSON.stringify(trashList));
    displayTrash();
    modal.style.display = 'none';
};


const deleteNote = (index) => {
    trashList.push(noteList[index]);
    localStorage.setItem('trash', JSON.stringify(trashList));
    noteList.splice(index, 1);
    displayTrash();
    localStorage.setItem('note', JSON.stringify(noteList));
    displayNotes();
    deletedModal.style.display = 'block';

    setTimeout(() => {
        deletedModal.style.display = 'none';
    }, 3_000);

};


const editNote = (index) => {
    let note = document.getElementsByClassName('saved-text')[index];
    let title = document.getElementsByClassName('saved-title')[index];
    let saveButton = document.getElementsByClassName('save-edit-button')[index];

    saveButton.style.visibility = 'visible';
    note.removeAttribute('disabled');
    title.removeAttribute("disabled");
    note.focus();
    title.focus();
}


const saveNote = (index) => {
    let note = document.getElementsByClassName('saved-text')[index];
    let title = document.getElementsByClassName('saved-title')[index];
    let saveButton = document.getElementsByClassName('save-edit-button')[index];
    let savedNote = document.getElementsByClassName('saved-note')[index];

    validateInput(index, note, title, savedNote);

    saveButton.style.visibility = 'hidden';
    note.setAttribute('disabled', true);
    title.setAttribute('disabled', true);

    noteList[index].note = note.value;
    noteList[index].title = title.value;

    localStorage.setItem('note', JSON.stringify(noteList));
};


const validateInput = (index, note, title, savedNote) => {
    let isEmpty = false;

    if (title.value === '') {
        title.value = noteList[index].title;
        isEmpty = true;
    }

    if (note.value === '') {
        note.value = noteList[index].note;
        isEmpty = true;
    }

    if (isEmpty) {
        savedNote.innerHTML += /*html*/`
            <span class="notestooltiptext" on>both field must be filled</span>
        `;
        let tooltip = savedNote.lastElementChild;
        setTimeout(() => {
            tooltip.style.visibility = 'hidden';
        }, 3_000);
    }
};

const loadNotes = () => {
    if (!localStorage.getItem('note')) {
        return;
    }

    const storageNotes = JSON.parse(localStorage.getItem('note'));
    noteList = storageNotes;

    displayNotes();
};


const loadTrash = () => {
    if (!localStorage.getItem('trash')) {
        return;
    }

    const storageTrash = JSON.parse(localStorage.getItem('trash'));
    trashList = storageTrash;

    displayTrash();
};


loadNotes();
loadTrash();


window.onclick = (event) => {
    if (event.target === document.getElementById('modal')) {
        modal.style.display = 'none';
    }
};


let url = document.URL,
    index = url.indexOf("#"),
    hash = index !== -1 ? url.substring(index + 1) : "";

if (hash === '') {
    location.hash = '#main-note';
}
