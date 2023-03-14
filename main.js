// Modal
const addBtn = document.querySelector('.add-btn');
const modalWindow = document.querySelector('.modal-window');
const modal = document.querySelector('.modal');
const closeBtn = document.querySelector('.modal .close-btn');
const bookForm = document.querySelector('.book-form');
// Book
const statusCheckbox = '.status input[type="checkbox"]';
const removeBtn = '.book-wrapper .remove-btn';

let myLibrary = [];

// || EVENT LISTENERS -------------------
// Modal
addBtn.addEventListener('click', openModal);
modal.addEventListener('click', (e) => e.stopPropagation());
modalWindow.addEventListener('click', closeModal);
closeBtn.addEventListener('click', closeModal);

// 'Add a new book button' that brings up a form allowing users to input details for new book (preventDefault)
bookForm.addEventListener('submit', (e) => {
  addBookToLibrary(e);
  bookForm.reset();
  closeModal();
  displayBooks();
});

// Book
addGlobalEventListener('click', statusCheckbox, changeStatus);
addGlobalEventListener('click', removeBtn, removeBook);

// || HELPER FUNCTIONS -------------------
function addGlobalEventListener(type, selector, callback) {
  document.addEventListener(type, (e) => {
    if (e.target.matches(selector)) callback(e);
  });
}

// Modal
function openModal(e) {
  // Disable background element keyboard interactivity
  modalWindow.classList.toggle('open');
}

function closeModal(e) {
  modalWindow.classList.toggle('open');
}

// Book
function Book(title, author, status) {
  this.title = title;
  this.author = author;
  this.status = status;
}
/* Book.prototype.changeStatus = function(status) {
  this.status = status;
} */

// Take user input, store new books into array
function addBookToLibrary(e) {
  e.preventDefault();
  const bookTitle = bookForm.querySelector('input[name="book-title"]').value;
  const bookAuthor = bookForm.querySelector('input[name="book-author"]').value;
  const bookStatus = bookForm.querySelector('select[name="book-status"]').value;

  const book = new Book(bookTitle, bookAuthor, bookStatus);
  myLibrary.push(book);
}

// Loop through array and display on page
function displayBooks() {
  resetLibrary();
  myLibrary.forEach((book, index) => {
    const libraryContainer = document.querySelector('.library > .container');
    const bookWrapper = document.createElement('article');
    bookWrapper.classList.add('book-wrapper');
    bookWrapper.setAttribute('data-index', `${index}`);

    // Book Div
    const newBook = document.createElement('div');
    newBook.classList.add('book');

    // Book Info Div
    const bookInfo = document.createElement('div');
    bookInfo.classList.add('book__info');

    const bookTitle = document.createElement('h2');
    bookTitle.classList.add('book__title');
    bookTitle.textContent = book.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.classList.add('book__author');
    bookAuthor.textContent = book.author;
    bookInfo.append(bookTitle, bookAuthor);

    // Book Status Div
    const status = document.createElement('div');
    status.classList.add('status');

    const checkbox = document.createElement('input');
    checkbox.classList.add('icon');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('name', 'status');
    checkbox.setAttribute('id', `book${index}-status`);

    if (book.status === 'Finished') {
      checkbox.checked = true;
    }

    const label = document.createElement('label');
    label.setAttribute('for', `book${index}-status`);
    label.textContent = book.status;
    status.append(checkbox, label);

    // Remove Button
    const removeBtn = document.createElement('button');
    removeBtn.classList.add('remove-btn', 'icon');
    removeBtn.setAttribute('type', 'button');
    removeBtn.setAttribute('aria-label', 'remove');

    // Append Elements
    newBook.append(bookInfo, status);
    bookWrapper.append(newBook, removeBtn);
    libraryContainer.append(bookWrapper);
  });
}

// Button on each book to change read status (on Book prototype)
function changeStatus(e) {
  const checkbox = e.target;
  const bookWrapper = checkbox.closest('.book-wrapper');
  const index = bookWrapper.dataset.index;
  const label = checkbox.nextElementSibling;

  if (checkbox.checked) {
    myLibrary[index].status = 'Finished';
  } else {
    myLibrary[index].status = 'Reading';
  }

  label.textContent = myLibrary[index].status;
}

// Button on each book to remove book from library (data attribute corresponding to index)
function removeBook(e) {
  const bookWrapper = e.target.parentNode;
  const index = bookWrapper.dataset.index;

  myLibrary.splice(index, 1);
  displayBooks();
}

function resetLibrary() {
  const libraryContainer = document.querySelector('.library > .container');
  const bookWrappers = libraryContainer.querySelectorAll('.book-wrapper');
  bookWrappers.forEach((bookWrapper) => bookWrapper.remove());
}
