
(async function () {

  const url = window.location.href;

  if (url.includes("moodle.bfh.ch")) {
    chrome.storage.sync.get({ loginType: null }, ({ loginType }) => {
      if (loginType) {
        selectOrgByUrl(loginType);
      }
    });
  }

  if (url.includes("login.eduid.ch")) {


    const passwordField = document.querySelector("#password");

    if (passwordField != null) {
      try {
        const passField = document.querySelector("#password");
        passField.setAttribute("autocomplete", "current-password");

        document.addEventListener('click', (event) => {
          const proceed = document.querySelector("#button-proceed");
          proceed.click();
        });
      }
      catch {
        //Do nothing 😎
      }
    }
    else {
      const userField = document.querySelector("#username");
      userField.setAttribute("autocomplete", "username");
      userField.click();

      userField.addEventListener('input', function (event) {
        try {
          const submit = document.querySelector("#button-submit");
          submit.click();

        }
        catch {
          //Do nothing 😎
        }

        const proceed = document.querySelector("#button-proceed");
        proceed.click();

        proceed.click();
      });
    }
  }
})();

function selectOrgByUrl(item) {
  document.querySelector(`.idd_listItem[savedvalue="${CSS.escape(item.url)}"]`)?.click();
}

