// This is a placeholder file which shows how you can access functions defined in other files.
// It can be loaded into index.html.
// You can delete the contents of the file once you have understood how it works.
// Note that when running locally, in order to open a web page which uses modules, you must serve the directory over HTTP e.g. with https://www.npmjs.com/package/http-server
// You can't open the index.html file using a file:// URL.

import { getData, getUserIds, setData } from "./storage.js";

window.onload = function () {
  const users = getUserIds();
  const select = document.getElementById("select-user");
  const rowsContainer = document.getElementById("bookmark-rows");
  const template = this.document.getElementById("bookmark-row-template");

  let currentUserId = null;

  select.innerHTML = '<option value="">Select a user</option>';
  function populateSelectMenu() {
    users.forEach((id) => {
      const options = document.createElement("option");
      options.value = id;
      options.textContent = `User ${id}`;
      select.appendChild(options);
    });
  }
  populateSelectMenu();
  select.addEventListener("change", () => {
    currentUserId = select.value;
    rowsContainer.innerHTML = "";
    if (!currentUserId) return;
    renderBookmarkForUser(currentUserId);
  });

  const form = document.querySelector(".add-bookmark-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!currentUserId) {
      alert("please select a user");
      return;
    }

    const bookmark = {
      url: document.getElementById("bookmark-url").value,
      title: document.getElementById("bookmark-title").value,
      description: document.getElementById("bookmark-description").value,
      date: new Date().toLocaleDateString(),
    };

    const bookmarks = getData(currentUserId) || [];
    bookmarks.push(bookmark);
    setData(currentUserId, bookmarks);

    renderBookmarkForUser(currentUserId);

    form.reset();
  });

  function renderBookmark(bookmark, container, template) {
    const clone = template.content.cloneNode(true);

    clone.querySelector(".cell.title").textContent = bookmark.title;
    clone.querySelector(".cell.description").textContent = bookmark.description;
    clone.querySelector(".cell.date").textContent = bookmark.date;

    const copyButton = clone.querySelector(".cell.action button");
    copyButton.addEventListener("click", () => {
      navigator.clipboard
        .writeText(bookmark.url)
        .then(() => alert("URL copied to clipboard!"))
        .catch((err) => console.error("Failed to copy URL", err));
    });

    container.appendChild(clone);
  }

  function renderBookmarkForUser(userId) {
    const bookmarks = getData(userId) || [];
    rowsContainer.innerHTML = "";
    bookmarks.forEach((bookmark) => {
      renderBookmark(bookmark, rowsContainer, template);
    });
  }
};
