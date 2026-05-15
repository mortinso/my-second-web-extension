(function () {
	// Protect the script from being injected into a page twice
 	if (window.hasRun) {
		return;
	}
	window.hasRun = true;

	function insertBeast(beastURL) {
		removeExistingBeasts();
		let beastImage = document.createElement("img");
		beastImage.setAttribute("src", beastURL);
		beastImage.style.objectFit = "contain";
		beastImage.style.position = "fixed";
		beastImage.style.height = "100%";
		beastImage.style.width = "100%";
		beastImage.className = "beastify-image";
		document.body.appendChild(beastImage);
	}

	function removeExistingBeasts() {
		let existingBeasts = document.querySelectorAll(".beastify-image");
		for (let beast of existingBeasts) { beast.remove(); }
	}

	browser.runtime.onMessage.addListener((message) => {
		if (message.command === "beastify") {
			insertBeast(message.BeastURL);
		} else if (message.command === "reset") {
			removeExistingBeasts();
		}
	});
})();
