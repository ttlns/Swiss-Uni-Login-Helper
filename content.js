(async function () {



  const url = window.location.href;

  if (url.includes("moodle.bfh.ch") || url.includes("https://wayf.switch.ch") || url.includes("https://moodle.fhgr.ch")) {
    chrome.storage.sync.get({ loginType: null }, ({ loginType }) => {
      if (loginType) {
        document.querySelector(`.idd_listItem[savedvalue="${CSS.escape(loginType.url)}"]`)?.click();

        chrome.storage.sync.get(["autoForward"], (result) => {
          if (result.autoForward) { //Autoforward on
            document.getElementById("wayf_submit_button").click();
          }
        });
      }
    });
  }

  if (url.includes("ilias.unibe.ch")) {
    chrome.storage.sync.get({ loginType: null }, ({ loginType }) => {
      if (loginType) {
        const select = document.getElementById("user_idp");
        select.value = loginType.url;
        select.dispatchEvent(new Event("change", { bubbles: true }));

        chrome.storage.sync.get(["autoForward"], (result) => {
          if (result.autoForward) { //Autoforward on
            document.getElementById("wayf_submit_button").click();
          }
        });
      }
    });
  }

  if (url.includes("moodle-app2.let.ethz.ch") || url.includes("moodle-app6.let.ethz.ch")) {

    chrome.storage.sync.get({ loginType: null }, ({ loginType }) => {
      if (loginType) {
        const select = document.getElementById("idp");
        if(select != null){ // idp element exists
          select.value = loginType.url;
          select.dispatchEvent(new Event("change", { bubbles: true }));

          chrome.storage.sync.get(["autoForward"], (result) => {
            if (result.autoForward) { //Autoforward on
              const btn = document.querySelector('button[type="submit"].btn.btn-primary');
              btn?.closest("form")?.requestSubmit(btn);
            }
          });
        }
      }
    });
  }

})();
