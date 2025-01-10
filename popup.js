document.addEventListener("DOMContentLoaded", function () {
  const categorySelect = document.getElementById("categorySelect");

  // Function to extract tags from a bookmark's URL or title
  function extractTags(bookmark) {
    const tags = [];
    const regex = /tags=([^,]+)/gi;
    let match;
    while ((match = regex.exec(bookmark.title)) !== null) {
      console.log("match", match);
      tags.push(...match[1].toLowerCase().split(","));
    }
    console.log("tags in extractTags", tags);
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
    console.log("bookmarks", bookmarks);
    const tags = traverseBookmarks(bookmarks);
    console.log("tags", tags);
    populateDropdown(tags);
  });
});
