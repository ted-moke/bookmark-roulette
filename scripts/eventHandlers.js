import { findBookmarksWithTag, deleteBookmark } from './bookmarkUtils.js';

// Handle roll button click
export function handleRollButtonClick(categorySelect, resultElement) {
  const selectedTag = categorySelect.value;
  if (!selectedTag) {
    resultElement.textContent = "Please select a tag first";
    return;
  }

  chrome.bookmarks.getTree((bookmarks) => {
    const matchingBookmarks = findBookmarksWithTag(bookmarks, selectedTag);
    
    if (matchingBookmarks.length === 0) {
      resultElement.textContent = "No bookmarks found with this tag";
      return;
    }

    // Pick a random bookmark
    const randomIndex = Math.floor(Math.random() * matchingBookmarks.length);
    const chosenBookmark = matchingBookmarks[randomIndex];
    
    // Create a clickable link
    resultElement.innerHTML = `<a href="${chosenBookmark.url}" target="_blank">${chosenBookmark.title}</a>`;
  });
}

// Handle list all button click
export function handleListAllButtonClick(categorySelect, resultElement) {
  const selectedTag = categorySelect.value;
  if (!selectedTag) {
    resultElement.textContent = "Please select a tag first";
    return;
  }

  chrome.bookmarks.getTree((bookmarks) => {
    const matchingBookmarks = findBookmarksWithTag(bookmarks, selectedTag);
    
    if (matchingBookmarks.length === 0) {
      resultElement.textContent = "No bookmarks found with this tag";
      return;
    }

    // Create a list of all matching bookmarks with delete buttons
    const bookmarksList = matchingBookmarks
      .map(bookmark => `
        <li>
          <a href="${bookmark.url}" target="_blank">${bookmark.title}</a>
          <button class="delete-button" data-id="${bookmark.id}">Delete</button>
        </li>
      `)
      .join('');
    
    resultElement.innerHTML = `
      <p>Found ${matchingBookmarks.length} bookmark${matchingBookmarks.length === 1 ? '' : 's'}:</p>
      <ul>${bookmarksList}</ul>
    `;

    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', function() {
        const bookmarkId = this.getAttribute('data-id');
        deleteBookmark(bookmarkId);
        // Refresh the list after deletion
        handleListAllButtonClick(categorySelect, resultElement);
      });
    });
  });
} 