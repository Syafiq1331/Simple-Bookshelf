// DOM Manipulation
const books = [];
const customEvent = 'custom-event';

// Storage
const eventSaved = 'saved-Books';
const storageKey = 'Books';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBooks();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }

});

function saveData() {
    if (isStorageExist()) {
        const parsedBooks = JSON.stringify(books);
        localStorage.setItem(storageKey, parsedBooks);
        document.dispatchEvent(new Event(customEvent));
    }
}

function isStorageExist() {
    if (typeof (Storage) === 'undefined') {
        alert('Browser tidak support local storage');
        return false;
    }
    return true;
}

function loadDataFromStorage() {
    const dataSaved = localStorage.getItem(storageKey);
    let data = JSON.parse(dataSaved);

    if (data !== null) {
        for (const book of data) {
            books.push(book)
        }
    }
    document.dispatchEvent(new Event(customEvent));
}

// get a book value
function addBooks() {
    let titleBook = document.getElementById('inputBookTitle').value;
    let authorBook = document.getElementById('inputBookAuthor').value;
    let yearBook = document.getElementById('inputBookYear').value;

    const makeUniqId = generateId();
    const bookObject = makeBookObject(makeUniqId, titleBook, authorBook, yearBook, false);

    books.push(bookObject);

    document.dispatchEvent(new Event(customEvent));
    saveData();
};

function generateId() {
    return +new Date();
};

function makeBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
};

// Make unCompletedBookshelf
function makeUncompletedBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = bookObject.year;

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(textTitle, textAuthor, textYear);

    // div action
    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');
    container.append(actionContainer);

    if (bookObject.isCompleted) {
        const unReadBookButton = document.createElement('button');
        unReadBookButton.innerText = 'Belum selesai di baca'
        unReadBookButton.classList.add('unReadBookButton');

        unReadBookButton.addEventListener('click', function () {
            unReadBookButtonFunction(bookObject.id);
        });

        const removeBookButton = document.createElement('button');
        removeBookButton.innerText = 'Hapus Buku';
        removeBookButton.classList.add('removeBookButton');

        removeBookButton.addEventListener('click', function () {
            removeBookButtonFunction(bookObject.id);
        });

        actionContainer.append(unReadBookButton, removeBookButton);
    } else {
        const readBookButton = document.createElement('button');
        readBookButton.innerText = 'Selesai di baca'
        readBookButton.classList.add('unReadBookButton');

        readBookButton.addEventListener('click', function () {
            readBookButtonFunction(bookObject.id);
        });

        const removeBookButton = document.createElement('button');
        removeBookButton.innerText = 'Hapus Buku';
        removeBookButton.classList.add('removeBookButton');

        removeBookButton.addEventListener('click', function () {
            removeBookButtonFunction(bookObject.id);
        });

        actionContainer.append(readBookButton, removeBookButton);
    }

    return container;
};

function unReadBookButtonFunction(booksId) {
    const bookTarget = findBook(booksId);
    if (bookTarget == null) return;

    alert('Yakin ingin kamu pindahkan ?')

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(customEvent));
    saveData();
};

function findBook(booksId) {
    for (const booksItem of books) {
        if (booksItem.id == booksId) {
            return booksItem;
        }
    }
}

function removeBookButtonFunction(booksId) {
    const bookTarget = findBook(booksId);

    if (bookTarget === -1) return;

    alert('Yakin ingin kamu hapus ?')

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(customEvent));
    saveData();
}

function readBookButtonFunction(booksId) {
    const bookTarget = findBook(booksId);

    alert('Yakin ingin kamu pindahkan ?')

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(customEvent))
    saveData();
}

document.addEventListener(customEvent, function () {
    const inCompletedBookList = document.getElementById('unBookList');
    inCompletedBookList.innerHTML = '';

    const completedBookList = document.getElementById('bookList');
    completedBookList.innerHTML = '';

    for (const booksItem of books) {
        const bookElement = makeUncompletedBook(booksItem);
        if (!booksItem.isCompleted) {
            inCompletedBookList.append(bookElement)
        } else {
            completedBookList.appendChild(bookElement)
        }
    }
});

