// Modal
const addBtn = document.querySelector('.add-btn');
const modalWindow = document.querySelector('.modal-window');
const modal = document.querySelector('.modal');
const closeBtn = document.querySelector('.modal .close-btn');
const bookForm = document.querySelector('.book-form');
// Book
const library = document.querySelector('.library > .container');
const statusCheckbox = '.status input[type="checkbox"]';
const removeBtn = '.book-wrapper .remove-btn';

let myLibrary = [];

// Modal
// Disable background element keyboard interactivity
const closeModal = () => modalWindow.classList.toggle('open');
const openModal = () => modalWindow.classList.toggle('open');

// Book
function createRemoveBtn() {
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn icon';
  removeBtn.type = 'button';
  removeBtn.ariaLabel = 'remove';

  return removeBtn;
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

  label.innerText = myLibrary[index].status;
}

function createStatus(book, index) {
  // Div Wrapper
  const status = document.createElement('div');
  status.className = 'status';

  // Input
  const checkbox = document.createElement('input');
  checkbox.className = 'icon';
  checkbox.type = 'checkbox';
  checkbox.name = 'status';
  checkbox.id = `book${index}-status`;

  if (book.status === 'Finished') {
    checkbox.checked = true;
  }

  // Label
  const label = document.createElement('label');
  label.setAttribute('for', `book${index}-status`);
  label.append(document.createTextNode(book.status));

  // Append Elements
  status.append(checkbox, label);

  return status;
}

function createBookElement(book, index) {
  const newBook = document.createElement('div');
  newBook.className = 'book';

  // Title and Author Wrapper
  const bookInfo = document.createElement('div');
  bookInfo.className = 'book__info';

  const title = document.createElement('h2');
  title.className = 'book__title';
  title.append(document.createTextNode(book.title));

  const author = document.createElement('p');
  author.className = 'book__author';
  author.append(document.createTextNode(book.author));

  // Read Status
  const status = createStatus(book, index);

  // Append Elements
  bookInfo.append(title, author);
  newBook.append(bookInfo, status);

  return newBook;
}

function resetLibrary() {
  const bookWrappers = library.querySelectorAll('.book-wrapper');
  bookWrappers.forEach((wrapper) => wrapper.remove());
}

// Loop through array and display on page
function displayBooks() {
  resetLibrary();

  myLibrary.forEach((book, index) => {
    const bookWrapper = document.createElement('article');
    bookWrapper.className = 'book-wrapper';
    bookWrapper.dataset.index = `${index}`;

    const newBook = createBookElement(book, index);
    const removeBtn = createRemoveBtn();

    bookWrapper.append(newBook, removeBtn);
    library.appendChild(bookWrapper);
  });
}

// Button on each book to remove book from library (data attribute corresponding to index)
function removeBook(e) {
  const bookWrapper = e.target.parentElement;
  const index = bookWrapper.dataset.index;

  myLibrary.splice(index, 1);
  displayBooks();
}

function Book(title, author, status) {
  this.title = title;
  this.author = author;
  this.status = status;
}
/* Book.prototype.changeStatus = (status) => (this.status = status); */

// Take user input, store new books into array
function addBookToLibrary(e) {
  const title = bookForm.querySelector('input[name="book-title"]').value;
  const author = bookForm.querySelector('input[name="book-author"]').value;
  const status = bookForm.querySelector('select[name="book-status"]').value;

  const book = new Book(title, author, status);
  myLibrary.push(book);
}

function addGlobalEventListener(type, selector, callback) {
  document.addEventListener(type, (e) => {
    if (e.target.matches(selector)) callback(e);
  });
}

// Modal
addBtn.addEventListener('click', openModal);
modalWindow.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => e.stopPropagation());
closeBtn.addEventListener('click', closeModal);

// 'Add a new book button' that brings up a form allowing users to input details for new book (preventDefault)
bookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  addBookToLibrary(e);
  bookForm.reset();
  closeModal();
  displayBooks();
});

// Book
addGlobalEventListener('click', statusCheckbox, changeStatus);
addGlobalEventListener('click', removeBtn, removeBook);
