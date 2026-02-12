// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getData, getUserIds, setData } from "./storage.js";

function populateUserSelect(select, userIds) {
  select.replaceChildren(new Option("Select a user", ""));

  userIds.forEach((id) => {
    select.add(new Option(`User ${id}`, id));
  });
}

function readBookmarkFromForm() {
  return {
    url: document.getElementById("bookmark-url").value.trim(),
    title: document.getElementById("bookmark-title").value.trim(),
    description: document.getElementById("bookmark-description").value.trim(),
    date: new Date().toLocaleDateString(),
  };
}

function addBookmark(userId, bookmark) {
  const bookmarks = getData(userId) || [];
  setData(userId, [...bookmarks, bookmark]);
}

function renderBookmarksForUser(userId, rowsContainer, rowTemplate) {
  const bookmarks = getData(userId) || [];
  rowsContainer.replaceChildren();

  bookmarks.forEach((bookmark) => {
    rowsContainer.appendChild(createBookmarkRow(bookmark, rowTemplate));
  });
}

function createBookmarkRow(bookmark, rowTemplate) {
  const fragment = rowTemplate.content.cloneNode(true);

  fragment.querySelector(".cell.title").textContent = bookmark.title;
  fragment.querySelector(".cell.description").textContent = bookmark.description;
  fragment.querySelector(".cell.date").textContent = bookmark.date;

  const copyButton = fragment.querySelector(".cell.action button");
  copyButton.addEventListener("click", () => copyUrlToClipboard(bookmark.url));

  return fragment;
}

async function copyUrlToClipboard(url) {
  try {
    await navigator.clipboard.writeText(url);
    alert("URL copied to clipboard!");
  } catch (error) {
    console.error("Failed to copy URL", error);
  }
}

window.onload = function () {
  const userIds = getUserIds();
  const userSelect = document.getElementById("select-user");
  const rowsContainer = document.getElementById("bookmark-rows");
  const rowTemplate = document.getElementById("bookmark-row-template");
  const form = document.querySelector(".add-bookmark-form");

  let currentUserId = null;

  populateUserSelect(userSelect, userIds);

  populateUserSelect();

  userSelect.addEventListener("change", () => {
    currentUserId = userSelect.value;
    rowsContainer.replaceChildren();

    if (!currentUserId) return;

    renderBookmarksForUser(currentUserId, rowsContainer, rowTemplate);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!currentUserId) {
      alert("Please select a user");
      return;
    }

    const bookmark = readBookmarkFromForm();
    addBookmark(currentUserId, bookmark);

    renderBookmarksForUser(currentUserId, rowsContainer, rowTemplate);
    form.reset();
  });
};
