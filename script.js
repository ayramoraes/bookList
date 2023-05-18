function searchBooks() {
    const searchTerm = document.querySelector('input[type="text"]').value;
    const apiUrl = `https://openlibrary.org/search.json?q=${searchTerm}&limit=12&offset=0`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const bookList = document.getElementById('book-list');
        bookList.innerHTML = '';

        data.docs.forEach(book => {
          const bookTitle = book.title ? book.title : 'Unknown Title';
          const authorName = book.author_name ? book.author_name[0] : 'Unknown Author';
          const coverImageId = book.cover_i ? book.cover_i : '';
          const coverImageUrl = `https://covers.openlibrary.org/b/id/${coverImageId}-S.jpg`;

          const listItem = document.createElement('li');

          const titleElement = document.createElement('h3');
          titleElement.textContent = bookTitle;
          listItem.appendChild(titleElement);

          const authorElement = document.createElement('p');
          authorElement.textContent = `Author: ${authorName}`;
          listItem.appendChild(authorElement);

          if (coverImageId) {
            const coverImageElement = document.createElement('img');
            coverImageElement.src = coverImageUrl;
            coverImageElement.alt = bookTitle;
            listItem.appendChild(coverImageElement);
          }

          bookList.appendChild(listItem);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }