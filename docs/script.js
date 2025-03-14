document.getElementById("generate").addEventListener("click", async function () {
    let scenario = document.getElementById("scenario").value.trim();
    let category = document.getElementById("category").value.trim();

    if (!scenario && !category) {
        alert("Please enter a scenario OR select a category.");
        return;
    }

    // ✅ Fix: If only category is selected, requestData will still be valid
    let requestData = {};
    if (scenario) requestData.scenario = scenario;
    if (category) requestData.category = category;

    console.log("Generating new story with:", requestData); // ✅ Debug log

    try {
        let response = await fetch("https://nahbro-nahlib.onrender.com/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        });

        console.log("API Response Status:", response.status); // ✅ Debug log
        let result = await response.json();
        console.log("Generated Story:", result); // ✅ Debug log

        if (result.story) {
            displayStoryWithInputs(result.story);
            document.getElementById("regenerate").classList.remove("hidden");
        } else {
            document.getElementById("output").innerText = "Something went wrong. Try again!";
        }
    } catch (error) {
        console.error("Error fetching story:", error); // ✅ Debug log
        document.getElementById("output").innerText = "Error fetching story. Check console.";
    }
});

document.getElementById("regenerate").addEventListener("click", async function () {
    let scenario = document.getElementById("scenario").value.trim();
    let category = document.getElementById("category").value.trim();

    if (!scenario && !category) {
        alert("Please enter a scenario OR select a category.");
        return;
    }

    let requestData = {};
    if (scenario) requestData.scenario = scenario;
    if (category) requestData.category = category;

    console.log("Generating new AI story with:", requestData); // ✅ Debug log

    try {
        let response = await fetch("https://nahbro-nahlib.onrender.com/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        });

        let result = await response.json();
        if (result.story) {
            displayStoryWithInputs(result.story);
        }
    } catch (error) {
        console.error("Error generating new AI story:", error);
        document.getElementById("output").innerText = "Error fetching new story.";
    }
});

function displayStoryWithInputs(story) {
    let placeholders = story.match(/\[(.*?)\]/g) || []; // Extract placeholders like [Noun], [Verb]

    if (placeholders.length === 0) {
        document.getElementById("output").innerHTML = `<p>${story}</p>`;
        return;
    }

    let formHtml = story;
    let placeholderMap = {}; // Track occurrences of each placeholder type

    const exampleHints = {
        "Noun": "(e.g., dog, house, beach, pizza)",
        "Verb": "(e.g., run, jump, swim, laugh)",
        "Verb-ing": "(e.g., running, jumping, swimming)",
        "Verb-past": "(e.g., ran, jumped, swam)",
        "Adjective": "(e.g., happy, blue, gigantic, slimy)",
        "Plural-Noun": "(e.g., dogs, houses, beaches)",
        "Proper-Noun": "(e.g., New York, Beyonce, McDonald's)",
        "Color": "(e.g., red, blue, green)"
    };

    placeholders.forEach((placeholder) => {
        let wordType = placeholder.replace(/\[|\]/g, ''); 

        if (!placeholderMap[wordType]) {
            placeholderMap[wordType] = 1;
        } else {
            placeholderMap[wordType]++;
        }

        let uniquePlaceholder = `[${wordType}${placeholderMap[wordType]}]`;
        let inputHint = exampleHints[wordType] || "(e.g., enter a word)";
        let inputField = `
            <input type="text" class="user-word" data-placeholder="${uniquePlaceholder}" placeholder="${wordType}" required>
            <small class="input-hint">${inputHint}</small>
        `;

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
        finalStory = finalStory.replaceAll(placeholder, `<strong>${userWord}</strong>`); 
    });

    document.getElementById("output").innerHTML = `<p>${finalStory}</p>`;
}

function copyToClipboard() {
    let text = document.getElementById("output").innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Story copied to clipboard!");
    });
}
