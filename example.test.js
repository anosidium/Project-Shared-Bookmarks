import assert from "node:assert";
import test from "node:test";
import { getUserIds } from "./storage.js";
import { sortBookmarksByDate, incrementLikeCount } from "./bookmarks.js";

test("User count is correct", () => {
  assert.equal(getUserIds().length, 5);
});

test("Bookmarks are sorted in reverse chronological order", () => {
  const bookmarks = [
    {
      url: "https://www.google.com",
      title: "Example website",
      description: "summary",
      createdAt: 3000,
      likeCount: 0,
    },
    {
      url: "https://www.bbc.co.uk/",
      title: "News website",
      description: "summary",
      createdAt: 2000,
      likeCount: 0,
    },
    {
      url: "https://www.w3schools.com/",
      title: "Learn to Code",
      description: "summary",
      createdAt: 5000,
      likeCount: 1,
    },
  ];

  const result = sortBookmarksByDate(bookmarks);

  assert.deepStrictEqual(
    result.map((b) => b.createdAt),
    [5000, 3000, 2000],
  );
});

test("Like counter increments correctly for matching bookmarks", () => {
  const bookmarks = [
    {
      url: "https://www.google.com",
      title: "Example website",
      description: "summary",
      createdAt: 3000,
      likeCount: 4,
    },
    {
      url: "https://www.bbc.co.uk/",
      title: "News website",
      description: "summary",
      createdAt: 2000,
      likeCount: 1,
    },
    {
      url: "https://www.w3schools.com/",
      title: "Learn to Code",
      description: "summary",
      createdAt: 5000,
      likeCount: 3,
    },
  ];

  const updated = incrementLikeCount(bookmarks, 2000);
  assert.equal(updated[1].likeCount, 2);
  assert.equal(updated[0].likeCount, 4);
  assert.equal(updated[2].likeCount, 3);
});
