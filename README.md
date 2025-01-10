# Bookmarks Roulette

Bookmarks Roulette is a Chrome extension that allows users to manage and explore their bookmarks in a fun and interactive way. Users can roll a random bookmark from a selected category or list all bookmarks with a specific tag or keyword.

## Features

- Extract tags from bookmark titles or URLs.
- Traverse bookmarks to collect tags and folder names.
- Roll a random bookmark from a selected category.
- List all bookmarks with a specific tag or keyword.
- Delete bookmarks directly from the list.
- Exclude bookmarks under folders titled "archive" from search results.
- Display bookmarks in the order of oldest to newest.

## Installation

1. Clone or download this repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory where you downloaded the extension.

## Usage

1. Click the extension icon in the Chrome toolbar to open the popup.
2. Select a category from the dropdown or enter a keyword manually.
3. Click "Roll" to open a random bookmark from the selected category.
4. Click "List All" to display all bookmarks with the selected tag or keyword.
5. Use the "Rand" button to select a random tag or folder name from the dropdown.
6. Delete bookmarks directly from the list using the "Delete" button.

## Development

### File Structure

- `popup.html`: The HTML file for the extension's popup interface.
- `styles.css`: The CSS file for styling the popup.
- `popup.js`: The main JavaScript file for handling UI interactions.
- `scripts/bookmarkUtils.js`: Utility functions for managing bookmarks.
- `scripts/eventHandlers.js`: Event handlers for button clicks and interactions.
- `scripts/uiUtils.js`: Utility functions for UI components.
- `manifest.json`: The manifest file for the Chrome extension.

### Key Functions

- `extractTags(bookmark)`: Extracts tags from a bookmark's title or URL.
- `traverseBookmarks(bookmarks)`: Collects tags and folder names from bookmarks.
- `findBookmarksWithTag(bookmarks, searchString)`: Finds bookmarks with a specific tag or keyword.
- `deleteBookmark(bookmarkId)`: Deletes a bookmark by its ID.
- `populateDropdown(tags, categorySelect)`: Populates the dropdown with sorted tags and folder names.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details. 