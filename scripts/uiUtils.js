// Function to populate the dropdown with sorted tags
export function populateDropdown(tags, categorySelect) {
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

// Function to create a bookmark list item with a delete button
export function createBookmarkListItem(bookmark) {
  return `
    <li>
      <a href="${bookmark.url}" target="_blank" title="${bookmark.title}">${bookmark.title.substring(0, 50)}${bookmark.title.length > 50 ? '...' : ''}</a>
      <button class="delete-button" data-id="${bookmark.id}">Delete</button>
    </li>
  `;
} 