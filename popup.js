// Import functions from other modules
import { traverseBookmarks } from './scripts/bookmarkUtils.js';
import { populateDropdown } from './scripts/uiUtils.js';
import { handleRollButtonClick, handleListAllButtonClick } from './scripts/eventHandlers.js';

document.addEventListener("DOMContentLoaded", function () {
  const categorySelect = document.getElementById("categorySelect");
  const categoryInput = document.getElementById("categoryInput");
  const rollButton = document.getElementById("rollButton");
  const resultElement = document.getElementById("result");
  const listAllLink = document.getElementById("listAllLink");
  const randomTagButton = document.getElementById("randomTagButton");

  let lastUsedInput = 'dropdown'; // Default to dropdown

  // Get all bookmarks and populate the dropdown
  chrome.bookmarks.getTree(function (bookmarks) {
    const { tags, folderNames } = traverseBookmarks(bookmarks);
    const combinedSet = new Set(['',...tags, ...folderNames]); // Use a Set to ensure uniqueness
    const combinedList = Array.from(combinedSet); // Convert back to an array
    populateDropdown(combinedList, categorySelect);
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

  listAllLink.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default link behavior
    const selectedTag = lastUsedInput === 'input' ? categoryInput.value.trim() : categorySelect.value;
    handleListAllButtonClick(selectedTag, resultElement);
  });

  // Add event listener for random tag button
  randomTagButton.addEventListener("click", () => {
    const options = Array.from(categorySelect.options).filter(option => option.value);
    if (options.length > 0) {
      const randomOption = options[Math.floor(Math.random() * options.length)];
      categorySelect.value = randomOption.value;
      lastUsedInput = 'dropdown';
    }
  });
});
