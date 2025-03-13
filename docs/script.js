document.getElementById("generate").addEventListener("click", async function () {
    let scenario = document.getElementById("scenario").value;
    let category = document.getElementById("category").value;

    // Validate input: scenario or category must be provided
    let requestData = {};
    if (scenario.trim()) {
        requestData.scenario = scenario.trim();
    } else if (category.trim()) {
        requestData.category = category.trim();
    } else {
        alert("Please enter a scenario or select a category.");
        return;
    }

    let response = await fetch("https://nahbro-nahlib.onrender.com/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData)
    });

    let result = await response.json();
    if (result.story) {
        displayStoryWithInputs(result.story);
        document.getElementById("regenerate").classList.remove("hidden");
    } else {
        document.getElementById("output").innerText = "Something went wrong. Try again!";
    }
});

document.getElementById("regenerate").addEventListener("click", async function () {
    let category = document.getElementById("category").value;
    if (!category.trim()) {
        alert("Regeneration only works for category-based stories.");
        return;
    }

    let response = await fetch("https://nahbro-nahlib.onrender.com/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category })
    });

    let result = await response.json();
    if (result.story) {
        displayStoryWithInputs(result.story);
    }
});

function displayStoryWithInputs(story) {
    let placeholders = story.match(/\[(.*?)\]/g) || []; // Extract placeholders like [Noun], [Verb], etc.

    // If no placeholders are found, show the story as-is
    if (placeholders.length === 0) {
        document.getElementById("output").innerHTML = `<p>${story}</p>`;
        return;
    }

    let formHtml = story;
    let placeholderCount = {}; // Track occurrences of each placeholder type

    placeholders.forEach((placeholder) => {
        let wordType = placeholder.replace(/\[|\]/g, ''); // Remove brackets

        // Ensure each placeholder type gets a unique ID
        if (!placeholderCount[wordType]) {
            placeholderCount[wordType] = 0;
        }
        let uniqueInputId = `${wordType}${placeholderCount[wordType]}`;
        placeholderCount[wordType]++;

        let inputField = `<input type="text" id="${uniqueInputId}" class="user-word" data-placeholder="${placeholder}" placeholder="${wordType}" required>`;
        formHtml = formHtml.replace(placeholder, inputField); // Replace only the first occurrence
    });

    document.getElementById("output").innerHTML = `
        <p>Fill in the blanks:</p>
        <div id="story-form">${formHtml}</div>
        <button onclick="finalizeStory()">Submit Words</button>
    `;
    document.getElementById("output").dataset.story = story;
}

function finalizeStory() {
    let inputs = document.querySelectorAll("#story-form input");
    let finalStory = document.getElementById("output").dataset.story;

    inputs.forEach(input => {
        let userWord = input.value.trim() || input.placeholder;
        let placeholder = input.dataset.placeholder;
        finalStory = finalStory.replace(placeholder, `<strong>${userWord}</strong>`); // Ensure correct replacement
    });

    document.getElementById("output").innerHTML = `<p>${finalStory}</p>`;
    document.getElementById("share-buttons").classList.remove("hidden");
}

// Social Sharing
function shareStory(platform) {
    let story = document.getElementById("output").innerText;
    let url = "https://nahbro.xyz";
    let text = encodeURIComponent(story + " #NahBroXYZ");

    if (platform === "twitter") {
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
    } else if (platform === "facebook") {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
    }
}

// Clipboard Copy
function copyToClipboard() {
    let text = document.getElementById("output").innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Story copied to clipboard!");
    });
}
