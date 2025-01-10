document.addEventListener("DOMContentLoaded", function () {
  const categorySelect = document.getElementById("categorySelect");
  const rollButton = document.getElementById("rollButton");
  const resultElement = document.getElementById("result");
  const listAllButton = document.getElementById("listAllButton");

  // Function to extract tags from a bookmark's URL or title
  function extractTags(bookmark) {
    const tags = [];
    const regex = /tags=([^,]+)/gi;
    let match;
    while ((match = regex.exec(bookmark.title)) !== null) {
      tags.push(...match[1].toLowerCase().split(","));
    }
    return tags;
  }

  // Function to traverse bookmarks and extract tags
  function traverseBookmarks(bookmarks, tagsSet = new Set()) {
    bookmarks.forEach((bookmark) => {
      if (bookmark.children) {
        traverseBookmarks(bookmark.children, tagsSet);
      } else if (bookmark.title.includes("tags=")) {
        const tags = extractTags(bookmark);
        tags.forEach((tag) => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet);
  }

  // Function to populate the dropdown with sorted tags
  function populateDropdown(tags) {
    // Sort tags into two groups: "to verb" and others
    const toVerbTags = tags.filter(tag => /^to\s+\w+/.test(tag));
    const otherTags = tags.filter(tag => !/^to\s+\w+/.test(tag));

    // Sort both arrays alphabetically
    toVerbTags.sort();
    otherTags.sort();

    // Combine the arrays with "to verb" tags first
    const sortedTags = [...toVerbTags, ...otherTags];

    // Clear existing options
    categorySelect.innerHTML = '';

    // Add sorted tags to dropdown
    sortedTags.forEach((tag) => {
      const option = document.createElement("option");
      option.value = tag;
      option.textContent = tag;
      categorySelect.appendChild(option);
    });
  }

  // Get all bookmarks and populate the dropdown
  chrome.bookmarks.getTree(function (bookmarks) {
    const tags = traverseBookmarks(bookmarks);
    populateDropdown(tags);
  });

  // Function to find bookmarks with selected tag
  function findBookmarksWithTag(bookmarks, tag, results = []) {
    bookmarks.forEach((bookmark) => {
      if (bookmark.children) {
        findBookmarksWithTag(bookmark.children, tag, results);
      } else if (bookmark.title.includes(`tags=${tag}`)) {
        results.push(bookmark);
      }
    });
    return results;
  }

  // Handle roll button click
  rollButton.addEventListener("click", () => {
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
  });

  // Handle list all button click
  listAllButton.addEventListener("click", () => {
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
        });
      });
    });
  });

  // Function to delete a bookmark
  function deleteBookmark(bookmarkId) {
    chrome.bookmarks.remove(bookmarkId, () => {
      alert('Bookmark deleted');
      // Refresh the list after deletion
      listAllButton.click();
    });
  }
});
