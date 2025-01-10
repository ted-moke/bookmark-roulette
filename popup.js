// Import functions from other modules
import { traverseBookmarks } from './scripts/bookmarkUtils.js';
import { populateDropdown } from './scripts/uiUtils.js';
import { handleRollButtonClick, handleListAllButtonClick } from './scripts/eventHandlers.js';

document.addEventListener("DOMContentLoaded", function () {
  const categorySelect = document.getElementById("categorySelect");
  const categoryInput = document.getElementById("categoryInput");
  const rollButton = document.getElementById("rollButton");
  const resultElement = document.getElementById("result");
  const listAllButton = document.getElementById("listAllButton");

  let lastUsedInput = 'dropdown'; // Default to dropdown

  // Get all bookmarks and populate the dropdown
  chrome.bookmarks.getTree(function (bookmarks) {
    const tags = traverseBookmarks(bookmarks);
    populateDropdown(tags, categorySelect);
  });

  // Track last used input
  categorySelect.addEventListener('change', () => {
    lastUsedInput = 'dropdown';
  });

  categoryInput.addEventListener('input', () => {
    lastUsedInput = 'input';
  });

  // Set up event listeners
  rollButton.addEventListener("click", () => {
    const selectedTag = lastUsedInput === 'input' ? categoryInput.value.trim() : categorySelect.value;
    handleRollButtonClick(selectedTag, resultElement);
  });

  listAllButton.addEventListener("click", () => {
    const selectedTag = lastUsedInput === 'input' ? categoryInput.value.trim() : categorySelect.value;
    handleListAllButtonClick(selectedTag, resultElement);
  });
});
