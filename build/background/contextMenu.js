function onClickHandlerImage(info, tab) {
  url = info.srcUrl;
  url = browser.extension.getURL("build/html/image-rightclick.html?url=" + url);

  browser.windows.create(
    { url: url, width: 232, height: 324, type: "popup" },
    function (window) {}
  );
}

function onClickHandlerScreenshot() {
  var id = 100;
  browser.tabs.captureVisibleTab(function (screenshotUrl) {
    var viewTabUrl = browser.extension.getURL(
      "build/html/screenshot.html?id=" + screenshotUrl
    );
    var targetId = null;

    browser.windows.create(
      { url: viewTabUrl, width: 232, height: 282, type: "popup" },
      function (window) {}
    );
  });
}

browser.commands.onCommand.addListener(function (command) {
  if (command === "screenshot") {
    onClickHandlerScreenshot();
  }
});

browser.contextMenus.create({
  title: "Slate",
  id: "parent",
  contexts: ["all"],
});

browser.contextMenus.create({
  title: "Add image",
  contexts: ["image"],
  parentId: "parent",
  id: "image",
  onclick: onClickHandlerImage,
});

browser.contextMenus.create({
  title: "Take screenshot",
  parentId: "parent",
  contexts: ["all"],
  id: "screenshot",
  onclick: onClickHandlerScreenshot,
});
