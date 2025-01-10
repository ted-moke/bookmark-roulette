import { findBookmarksWithTag, deleteBookmark } from './bookmarkUtils.js';
import { createBookmarkListItem } from './uiUtils.js';

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Handle roll button click
export function handleRollButtonClick(selectedTag, resultElement) {
  if (!selectedTag) {
    resultElement.textContent = "Please select a tag or enter a keyword first";
    return;
  }

  chrome.bookmarks.getTree((bookmarks) => {
    const matchingBookmarks = findBookmarksWithTag(bookmarks, selectedTag);
    
    if (matchingBookmarks.length === 0) {
      resultElement.textContent = "No bookmarks found with this tag";
      return;
    }

    // Shuffle the array of matching bookmarks
    shuffleArray(matchingBookmarks);

    // Pick the first bookmark after shuffling
    const chosenBookmark = matchingBookmarks[0];
    
    // Use the utility function to create the list item
    resultElement.innerHTML = createBookmarkListItem(chosenBookmark);
  });
}

// Handle list all button click
export function handleListAllButtonClick(selectedTag, resultElement) {
  if (!selectedTag) {
    resultElement.textContent = "Please select a tag or enter a keyword first";
    return;
  }

  chrome.bookmarks.getTree((bookmarks) => {
    const matchingBookmarks = findBookmarksWithTag(bookmarks, selectedTag);
    
    if (matchingBookmarks.length === 0) {
      resultElement.textContent = "No bookmarks found with this tag";
      return;
    }

    // Sort bookmarks by creation date (assuming you have a way to access it)
    matchingBookmarks.sort((a, b) => a.dateAdded - b.dateAdded);

    // Create a list of all matching bookmarks with delete buttons
    const bookmarksList = matchingBookmarks
      .map(createBookmarkListItem)
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
        handleListAllButtonClick(selectedTag, resultElement);
      });
    });
  });
} 