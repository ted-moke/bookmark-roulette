// Function to extract tags from a bookmark's URL or title
export function extractTags(bookmark) {
  const tags = [];
  const regex = /tags=([^,]+)/gi;
  let match;
  while ((match = regex.exec(bookmark.title)) !== null) {
    tags.push(...match[1].toLowerCase().split(","));
  }
  return tags;
}

// Function to traverse bookmarks and extract tags
export function traverseBookmarks(bookmarks, tagsSet = new Set()) {
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

// Function to find bookmarks with selected tag or matching string
export function findBookmarksWithTag(bookmarks, searchString, results = []) {
  const lowerCaseSearchString = searchString.toLowerCase();
  bookmarks.forEach((bookmark) => {
    if (bookmark.children) {
      findBookmarksWithTag(bookmark.children, searchString, results);
    } else {
      const tags = extractTags(bookmark);
      const titleLowerCase = bookmark.title.toLowerCase();
      if (tags.includes(lowerCaseSearchString) || titleLowerCase.includes(lowerCaseSearchString)) {
        results.push(bookmark);
      }
    }
  });
  return results;
}

// Function to delete a bookmark
export function deleteBookmark(bookmarkId) {
  chrome.bookmarks.remove(bookmarkId, () => {
    alert('Bookmark deleted');
  });
} 