
(async function () {

  const url = window.location.href;

  if (url.includes("moodle.bfh.ch")) {
    // Step 1: Handle pre-login page

    if (url.includes("moodle.bfh.ch/local/bfh_dual_login/index.php")) {
      const checkbox = document.querySelector("#wayf_remember_checkbox");
      checkbox.click();
    }

    const preSubmit = document.querySelector("#wayf_submit_button");
    if (preSubmit) {
      preSubmit.click();
      return; // Exit and wait for next page to load
    }
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
