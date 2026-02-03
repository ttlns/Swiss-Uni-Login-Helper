console.log("extension content script active on:", location.href);

(async function () {

  const url = window.location.href;

  if (url.includes("moodle.bfh.ch") || url.includes("https://wayf.switch.ch/")) {
    chrome.storage.sync.get({ loginType: null }, ({ loginType }) => {
      if (loginType) {
        document.querySelector(`.idd_listItem[savedvalue="${CSS.escape(loginType.url)}"]`)?.click();
      }
    });
  }

  if (url.includes("ilias.unibe.ch")){
    chrome.storage.sync.get({ loginType: null }, ({ loginType }) => {
      if (loginType) {
        const select = document.getElementById("user_idp");
        select.value = loginType.url;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
  }

  if (url.includes("moodle-app2.let.ethz.ch")) {

    chrome.storage.sync.get({ loginType: null }, ({ loginType }) => {
      if (loginType) {
        const select = document.getElementById("idp");
        select.value = loginType.url;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
  }

})();
