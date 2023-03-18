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

// MODAL FUNCTIONS //////////
const openModal = () => modalWindow.classList.toggle('open');
const closeModal = () => modalWindow.classList.toggle('open');

// BOOK FUNCTIONS //////////
function addGlobalEventListener(type, selector, callback) {
  document.addEventListener(type, (e) => {
    if (e.target.matches(selector)) callback(e);
  });
}

// Add a book to the library ----------
function handleBookSubmit(e) {
  e.preventDefault();
  closeModal();

  const newBookObj = createBookObj();
  addBookToStorage(newBookObj);
  addBookToDOM(newBookObj);

  bookForm.reset();
}

function Book(title, author, status) {
  this.title = title;
  this.author = author;
  this.status = status;
}
/* Book.prototype.changeStatus = (status) => (this.status = status); */

function createBookObj() {
  const bookFormData = new FormData(bookForm);
  const bookTitle = bookFormData.get('book-title');
  const bookAuthor = bookFormData.get('book-author');
  const bookStatus = bookFormData.get('book-status');

  const newBookObj = new Book(bookTitle, bookAuthor, bookStatus);

  return newBookObj;
}

function getLibraryFromStorage() {
  let myLibraryArr;

  if (localStorage.getItem('myLibrary') === null) {
    myLibraryArr = [];
  } else {
    myLibraryArr = JSON.parse(localStorage.getItem('myLibrary'));
  }

  return myLibraryArr;
}

function addBookToStorage(bookObj) {
  const myLibraryArr = getLibraryFromStorage();
  myLibraryArr.push(bookObj);
  localStorage.setItem('myLibrary', JSON.stringify(myLibraryArr));
}

function addBookToDOM(bookObj) {
  // Book Wrapper
  const bookWrapper = document.createElement('div');
  bookWrapper.className = 'book-wrapper';

  // Book
  const bookElem = document.createElement('div');
  bookElem.className = 'book';
  const bookInfo = createBookInfo(bookObj);
  const status = createStatus(bookObj);
  bookElem.append(bookInfo, status);

  // Remove Button
  const removeBtn = createRemoveBtn();

  // Append Elements
  bookWrapper.append(bookElem, removeBtn);
  library.append(bookWrapper);
}

// Title and Author Wrapper
function createBookInfo(bookObj) {
  const bookInfo = document.createElement('div');
  bookInfo.className = 'book__info';

  const title = document.createElement('h2');
  title.className = 'book__title';
  title.append(document.createTextNode(bookObj.title));

  const author = document.createElement('p');
  author.className = 'book__author';
  author.append(document.createTextNode(bookObj.author));

  bookInfo.append(title, author);

  return bookInfo;
}

// Read Status Element
function createStatus(bookObj) {
  const bookTitle = bookObj.title.split(' ').join('-').toLowerCase();

  // Div Wrapper
  const status = document.createElement('div');
  status.className = 'status';

  // Input
  const checkbox = document.createElement('input');
  checkbox.className = 'icon';
  checkbox.type = 'checkbox';
  checkbox.name = 'status';
  checkbox.id = `${bookTitle}-status`;

  if (bookObj.status === 'Finished') {
    checkbox.checked = true;
  }

  // Label
  const label = document.createElement('label');
  label.setAttribute('for', `${bookTitle}-status`);
  label.append(document.createTextNode(bookObj.status));

  // Append Elements
  status.append(checkbox, label);

  return status;
}

function createRemoveBtn() {
  const removeBtn = document.createElement('button');
  removeBtn.className = 'remove-btn icon';
  removeBtn.type = 'button';
  removeBtn.ariaLabel = 'remove';

  return removeBtn;
}

// Removing a book --------------------
function handleBookRemove(e) {
  // Get book identifier
  const bookElem = e.target.previousElementSibling;
  const title = bookElem.querySelector('.book__title').innerText;
  const author = bookElem.querySelector('.book__author').innerText;

  if (!confirm(`Remove ${title}?`)) return;

  removeBookFromStorage(title, author);
  // Remove book from DOM
  bookElem.parentElement.remove();
}

function removeBookFromStorage(title, author) {
  let myLibraryArr = getLibraryFromStorage();

  myLibraryArr = myLibraryArr.filter((bookObj) => {
    return !(bookObj.title === title && bookObj.author === author);
  });

  localStorage.setItem('myLibrary', JSON.stringify(myLibraryArr));
}

// Changing a book's read status --------------------
function changeStatus(e) {
  const checkbox = e.target;
  const label = checkbox.nextElementSibling;
  const bookInfo = checkbox.parentElement.previousElementSibling;
  const title = bookInfo.querySelector('.book__title').innerText;
  const author = bookInfo.querySelector('.book__author').innerText;

  let status;
  if (checkbox.checked) {
    status = 'Finished';
  } else {
    status = 'Reading';
  }

  changeStorageBookStatus(title, author, status);
  // Change DOM book status
  label.innerText = status;
}

function changeStorageBookStatus(title, author, status) {
  const myLibraryArr = getLibraryFromStorage();

  myLibraryArr.forEach((bookObj) => {
    if (bookObj.title === title && bookObj.author === author) {
      bookObj.status = status;
    }
  });

  localStorage.setItem('myLibrary', JSON.stringify(myLibraryArr));
}

// EVENT LISTENERS //////////
function initApp() {
  // Show library in DOM
  const myLibraryArr = getLibraryFromStorage();
  myLibraryArr.forEach((bookObj) => addBookToDOM(bookObj));

  // Modal
  addBtn.addEventListener('click', openModal);
  modalWindow.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => e.stopPropagation());
  closeBtn.addEventListener('click', closeModal);

  // Book
  bookForm.addEventListener('submit', handleBookSubmit);
  addGlobalEventListener('click', removeBtn, handleBookRemove);
  addGlobalEventListener('click', statusCheckbox, changeStatus);
}

initApp();
