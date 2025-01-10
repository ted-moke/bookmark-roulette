// Import functions from other modules
import { traverseBookmarks } from './scripts/bookmarkUtils.js';
import { populateDropdown } from './scripts/uiUtils.js';
import { handleRollButtonClick, handleListAllButtonClick } from './scripts/eventHandlers.js';

document.addEventListener("DOMContentLoaded", function () {
  const categorySelect = document.getElementById("categorySelect");
  const rollButton = document.getElementById("rollButton");
  const resultElement = document.getElementById("result");
  const listAllButton = document.getElementById("listAllButton");


  // Get all bookmarks and populate the dropdown
  chrome.bookmarks.getTree(function (bookmarks) {
    const tags = traverseBookmarks(bookmarks);
    populateDropdown(tags, categorySelect);
  });

  // Set up event listeners
  rollButton.addEventListener("click", () => handleRollButtonClick(categorySelect, resultElement));
  listAllButton.addEventListener("click", () => handleListAllButtonClick(categorySelect, resultElement));
});
