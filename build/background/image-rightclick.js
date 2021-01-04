//File Upload onclick listener
document.addEventListener("DOMContentLoaded", function () {
  image = getUrlVars()["url"];
  image_preview.style.backgroundImage = "url('"+image+"')"; 
  _handleGetSlates();

  upload_button.addEventListener("click", _handleClick);
});

//handle upload after submit
_handleClick = () => {
  const image_source = getUrlVars()["url"];
  const slate_name = slates_select.options[slates_select.selectedIndex].text;
  const slate_id = slates_select.options[slates_select.selectedIndex].value;

  browser.runtime.sendMessage(
    {
      msg: "image",
      url: image_preview.src,
      slateName: slate_name,
      slateId: slate_id,
      source: image_source,
    },
    (response) => {
      console.log(response);
    }
  );
  window.close();
};

//Getting all user Slates
_handleGetSlates = async () => {
  const apiKey = await getAPIKey();

  const response = await fetch("https://slate.host/api/v1/get", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + apiKey,
    },
    body: JSON.stringify({
      data: {
        // NOTE: optional, if you want your private slates too.
        private: true,
      },
    }),
  });
  const json = await response.json();
  for (var i = 0; i < json.slates.length; i++) {
    var slates = json.slates[i];
    var addOption = document.createElement("option");
    addOption.value = slates.id;
    addOption.innerHTML = slates.slatename;
    slates_select.appendChild(addOption);
  }
};
