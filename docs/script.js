document.getElementById("generate").addEventListener("click", async function () {
    let scenario = document.getElementById("scenario").value.trim();

    // Ensure user enters a scenario
    if (!scenario) {
        alert("Please enter a scenario.");
        return;
    }

    console.log("Generating new story with scenario:", scenario); // Debug log

    let response = await fetch("https://nahbro-nahlib.onrender.com/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario }) // Only keeping user scenario
    });

    let result = await response.json();
    console.log("Generated story:", result); // Debug log

    if (result.story) {
        displayStoryWithInputs(result.story);
        document.getElementById("regenerate").classList.remove("hidden");
    } else {
        document.getElementById("output").innerText = "Something went wrong. Try again!";
    }
});

document.getElementById("regenerate").addEventListener("click", async function () {
    let scenario = document.getElementById("scenario").value.trim();

    if (!scenario) {
        alert("Please enter a scenario.");
        return;
    }

    console.log("Creating a completely new story with scenario:", scenario); // Debug log

    let response = await fetch("https://nahbro-nahlib.onrender.com/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario }) // Only keeping user scenario
    });

    let result = await response.json();
    console.log("New story generated:", result); // Debug log

    if (result.story) {
        displayStoryWithInputs(result.story);
    }
});

function displayStoryWithInputs(story) {
    let placeholders = story.match(/\[(.*?)\]/g) || []; // Extract placeholders like [Noun], [Verb]

    // If no placeholders are found, show the story as-is
    if (placeholders.length === 0) {
        document.getElementById("output").innerHTML = `<p>${story}</p>`;
        return;
    }

    let formHtml = story;
    let placeholderCount = {}; // Track occurrences of each placeholder type

    placeholders.forEach((placeholder) => {
        let wordType = placeholder.replace(/\[|\]/g, ''); // Remove brackets

        if (!placeholderCount[wordType]) {
            placeholderCount[wordType] = 1;
        } else {
            placeholderCount[wordType]++;
        }

        let uniquePlaceholder = `${wordType}${placeholderCount[wordType]}`;
        let inputField = `<input type="text" id="${uniquePlaceholder}" class="user-word" data-placeholder="${placeholder}" placeholder="${wordType}" required>`;
        
        formHtml = formHtml.replace(placeholder, inputField);
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
        finalStory = finalStory.replace(placeholder, `<strong>${userWord}</strong>`);
    });

    document.getElementById("output").innerHTML = `<p>${finalStory}</p>`;
}

// Clipboard Copy
function copyToClipboard() {
    let text = document.getElementById("output").innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Story copied to clipboard!");
    });
}
