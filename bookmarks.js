export function sortBookmarksByDate(bookmark) {
  return [...bookmark].sort((a, b) => b.createdAt - a.createdAt);
}

export function incrementLikeCount(bookmarks, createdAt) {
  return bookmarks.map((bookmark) => {
    if (bookmark.createdAt === createdAt) {
      return {
        ...bookmark,
        likeCount: (bookmark.likeCount || 0) + 1,
      };
    }
    return bookmark;
  });
}
