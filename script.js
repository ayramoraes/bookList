let searchTerm = '';
let pageOffset = 0;
const limitPerPage = 12;
let totalResults = 0;

const searchInput = document.getElementById('search-input');
const loadingScreen = document.getElementById('loading-screen');
const bookList = document.getElementById('book-list');
const previousButton = document.getElementById('previous-button');
const nextButton = document.getElementById('next-button');
const paginationInfo = document.createElement('p');
paginationInfo.className = 'pagination-info';

hideButtons();

function searchBooks() {
  searchTerm = searchInput.value.trim();
  if (searchTerm === '') {
    alert('Please enter a search term.');
    return;
  }
  pageOffset = 0;
  fetchBooks();
}

function fetchBooks() {
  loadingScreen.style.display = 'block';
  const apiUrl = `https://openlibrary.org/search.json?q=${searchTerm}&limit=${limitPerPage}&offset=${pageOffset}`;
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      totalResults = data.numFound;
      displayBooks(data.docs);
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      loadingScreen.style.display = 'none';
    });
}

function previousPage() {
  if (pageOffset >= limitPerPage) {
    pageOffset -= limitPerPage;
    fetchBooks();
  }
}

function nextPage() {
  pageOffset += limitPerPage;
  fetchBooks();
}

function displayBooks(books) {
  bookList.innerHTML = '';

  if (books.length === 0) {
    const noBooksText = document.createElement('p');
    noBooksText.className = 'no-books-found';
    noBooksText.innerText = 'No books found 😢';
    bookList.appendChild(noBooksText);
    paginationInfo.innerText = '';
    hideButtons();
    return;
  }

  const cardRows = [];
  let currentRow = document.createElement('div');
  currentRow.className = 'row';

  books.forEach((book, index) => {
    const card = createCardElement(book);
    currentRow.appendChild(card);

    if ((index + 1) % 3 === 0) {
      cardRows.push(currentRow);
      currentRow = document.createElement('div');
      currentRow.className = 'row';
    }
  });

  if (currentRow.childElementCount > 0) {
    cardRows.push(currentRow);
  }

  cardRows.forEach(row => {
    bookList.appendChild(row);
  });

  if (totalResults > 0) {
    const totalPages = Math.ceil(totalResults / limitPerPage);
    const currentPage = Math.floor(pageOffset / limitPerPage) + 1;
    paginationInfo.innerText = `Page ${currentPage} of ${totalPages}`;
    bookList.appendChild(paginationInfo);

    previousButton.disabled = pageOffset === 0;
    previousButton.onclick = previousPage;

    nextButton.disabled = pageOffset + limitPerPage >= totalResults;
    nextButton.onclick = nextPage;
  } else {
    paginationInfo.innerText = '';
    hideButtons();
  }

  showButtons();
}

function hideButtons() {
  previousButton.style.display = 'none';
  nextButton.style.display = 'none';
}

function showButtons() {
  previousButton.style.display = 'inline-block';
  nextButton.style.display = 'inline-block';
}


function createCardElement(book) {
  const { title, author_name, cover_i, key } = book;

  const col = createElement('div', 'col-md-4');
  const card = createElement('div', 'card mb-3');

  const row = createElement('div', 'row g-0');
  const colImage = createElement('div', 'col-md-4');
  const colContent = createElement('div', 'col-md-8');
  const cardBody = createElement('div', 'card-body');

  const coverImage = createImageElement(cover_i, title);
  colImage.appendChild(coverImage);

  const link = createElement('a');
  link.href = `https://openlibrary.org${key}`;
  link.target = '_blank'; // Open link in a new tab

  const titleElement = createElement('h5', 'card-title');
  titleElement.textContent = limitTitleLines(title);
  titleElement.style.overflow = 'hidden';
  titleElement.style.textOverflow = 'ellipsis';
  titleElement.style.display = '-webkit-box';
  titleElement.style.webkitBoxOrient = 'vertical';
  titleElement.style.webkitLineClamp = '3';

  const firstAuthorName = getFirstAuthorName(author_name);
  const authorsElement = createElement('p', 'card-text');
  authorsElement.textContent = 'Author(s): ' + firstAuthorName;
 
  cardBody.appendChild(titleElement);
  cardBody.appendChild(authorsElement);

  colContent.appendChild(cardBody);
  row.appendChild(colImage);
  row.appendChild(colContent);
  card.appendChild(row);
  link.appendChild(card);
  col.appendChild(link);

  return col;
}


function getFirstAuthorName(authors) {
  if (!authors || authors.length === 0) {
    return 'Author\'s name not available';
  }

  return authors[0];
}

function limitTitleLines(title) {
  const maxTitleLines = 3;
  const maxTitleLength = 50;

  if (title.length > maxTitleLength * maxTitleLines) {
    title = title.substring(0, maxTitleLength * maxTitleLines) + '...';
  }

  return title;
}

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (text) {
    element.innerText = text;
  }
  return element;
}

function createImageElement(coverId, altText) {
  const img = document.createElement('img');
  if (coverId) {
    img.src = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
    img.alt = altText;
  } else {
    img.src = 'data:image/png;base64,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'; 
    img.alt = 'Cover not available';
    img.className = 'card-img-top';
  }
  img.className = 'card-img';
  return img;
}

searchInput.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    searchBooks();
  }
});
