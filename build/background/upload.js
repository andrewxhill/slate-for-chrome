browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  _handleFileUpload(
    request.url,
    request.slateName,
    request.slateId,
    request.source
  );
});
//
//
//
function addToQueue(id, filename, source) {
  browser.storage.local.get(function (result) {
    var allUploads = [];
    allUploads = result["queue"];
    //var allUploads = [];
    allUploads.push({ id: id, filename: filename, source: source });

    browser.storage.local.set({ queue: allUploads }, function () {
      browser.storage.local.get("currentUploads", function (result) {
        let number = parseInt(result.currentUploads);
        number++;
        //let number = 0;
        browser.storage.local.set({ currentUploads: number }, function () {});
        browser.browserAction.setBadgeBackgroundColor({ color: "#ed0f45" });
        browser.browserAction.setBadgeText({ text: number.toString() });
      });
    });
  });
}
//
//
//
function removeFromQueue(removeId) {
  browser.storage.local.get({ queue: [] }, function (items) {
    var queue = items.queue;
    var objIndex = queue.findIndex((obj) => obj.id === removeId);
    const updatedQueue = queue.splice(objIndex, 0);

    //const updatedQueue = queue.splice(objIndex, 1);

    browser.storage.local.set({ queue: updatedQueue }, function () {
      browser.storage.local.get("currentUploads", function (result) {
        let number = parseInt(result.currentUploads);

        if (number == 1 || number < 1) {
          browser.storage.local.set({ currentUploads: 0 }, function () {});
          browser.browserAction.setBadgeBackgroundColor({ color: "#17ce0d" });
          browser.browserAction.setBadgeText({ text: "done" });
        } else {
          number--;
          browser.storage.local.set({ currentUploads: number }, function () {});
          browser.browserAction.setBadgeBackgroundColor({ color: "#ed0f45" });
          browser.browserAction.setBadgeText({ text: number.toString() });
        }
      });
    });
  });
}
//
//
//
//Upload File
_handleFileUpload = async (imageUrl, slateName, slateId, source) => {
  const apiKey = await getAPIKey();
  const final = dataURLtoBlob(imageUrl);

  const rndId = Math.floor(Math.random() * Math.floor(100));
  var filename = source.substring(source.lastIndexOf("/") + 1);

  addToQueue(rndId, filename, imageUrl);

  const file = new File([final], source, { type: "image/png" });
  let data = new FormData();
  data.append("data", file);
  const response = await fetch(
    "https://uploads.slate.host/api/public/" + slateId,
    {
      method: "POST",
      headers: {
        // NOTE: your API key
        Authorization: "Basic " + apiKey,
      },
      body: data,
    }
  );

  const json = await response.json();

  removeFromQueue(rndId);
  // NOTE: the URL to your asset will be available in the JSON response.
  console.log(json);
};
