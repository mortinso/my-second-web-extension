// CSS to hide everything thats not the beast
const hidePage = `body > :not(.beastify_image) {
                   display: none !important;
                  }`;


// Listens for a click on a popup-content button and acts accordingly
function listenForClicks() {
  document.addEventListener("click", async (e) => {
    function beastNameToURL(beastName) {
      switch (beastName) {
        case "Option1":
          return browser.runtime.getURL("beasts/option1.jpg");
	case "Option2":
          return browser.runtime.getURL("beasts/option2.jpg");
        case "Option3":
          return browser.runtime.getURL("beasts/option3.jpg");
      }
    }

    async function beastify(tab) {
      await browser.scritpting.insertCSS({
        target: { tabId: tab.id },
        css: hidePage,
      });
      const url = beastNameToURL(e.target.textContent);
      await browser.tabs.sendMessage(tab.id, {
        command: "beastify",
        beastURL: url,
      });
    }

    async function reset(tab) {
      await browser.scripting.removeCSS({
        target: { tabId: tab.id },
        css: hidePage,
      });
      await browser.tabs.sendMessage(tab.id, { command: "reset" });
    }

    // Log error to console
    function reportError(error) {
      console.error(`Could not beastify: ${error}`);
    }

    // Ignore clicks not in a button within popup-content
    if (e.target.tagName !== "BUTTON" || ! e.target.closest("#popup-content")) {
      return;
    }

    try {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (e.target.type === "reset") {
        await reset(tab);
      } else {
        await beastify(tab);
      }
    } catch (error) {
      reportError(error);
    }
  });
}

// Show error message in popup
function reportExecuteScriptingError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute beastify content script: ${error.message}`);
}

// Inject script into tab and add click listener/handler
(async function runOnPopupOpened() {
  try {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });

    await browser.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["/content_scripts/beastify.js"],
    });
    listenForClicks();
  } catch (e) {
    reportExecuteScriptError(e);
  }
})();
