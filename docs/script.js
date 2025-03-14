document.getElementById("generate").addEventListener("click", async function () {
    let scenario = document.getElementById("scenario").value.trim();
    let category = document.getElementById("category").value.trim();

    if (!scenario && !category) {
        alert("Please enter a scenario OR select a category.");
        return;
    }

    let requestData = {};
    if (scenario) requestData.scenario = scenario;
    if (category) requestData.category = category;

    console.log("Generating new story with:", requestData); 

    try {
        let response = await fetch("https://nahbro-nahlib.onrender.com/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestData)
        });

        console.log("API Response Status:", response.status);
        let result = await response.json();
        console.log("Generated Story:", result);

        if (result.story) {
            displayStoryWithInputs(result.story);
            document.getElementById("regenerate").textContent = "New NAH-LIB"; 
            document.getElementById("regenerate").classList.remove("hidden");
        } else {
            document.getElementById("output").innerText = "Something went wrong. Try again!";
        }
    } catch (error) {
        console.error("Error fetching story:", error);
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

    console.log("Generating new AI story with:", requestData);

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
    let placeholders = story.match(/\[(.*?)\]/g) || [];

    if (placeholders.length === 0) {
        document.getElementById("output").innerHTML = `<p>${story}</p>`;
        return;
    }

    let formHtml = story;
    let placeholderMap = {};

    const exampleHints = {
        "Noun": "Example: dog, house, beach, pizza",
        "Verb": "Example: run, jump, swim, laugh",
        "Verb-ing": "Example: running, jumping, swimming",
        "Verb-past": "Example: ran, jumped, swam",
        "Adjective": "Example: happy, blue, gigantic, slimy",
        "Plural-Noun": "Example: dogs, houses, beaches",
        "Proper-Noun": "Example: New York, Beyonce, McDonald's",
        "Color": "Example: red, blue, green",
        "Family Member": "Example: mom, dad, sister, uncle",
        "Time of Day": "Example: morning, afternoon, evening",
        "Item": "Example: book, phone, wallet",
        "Body Part": "Example: arm, leg, nose"
    };

    placeholders.forEach((placeholder) => {
        let wordType = placeholder.replace(/\[|\]/g, '');

        if (!placeholderMap[wordType]) {
            placeholderMap[wordType] = 1;
        } else {
            placeholderMap[wordType]++;
        }

        let uniquePlaceholder = `${wordType}${placeholderMap[wordType]}`;
        let inputHint = exampleHints[wordType] ? exampleHints[wordType] : `Example: ${wordType.toLowerCase()}`;

        let inputField = `
            <input type="text" class="user-word" id="${uniquePlaceholder}" name="${uniquePlaceholder}" 
            data-placeholder="${uniquePlaceholder}" placeholder="${wordType}" required title="${inputHint}">
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

        let regex = new RegExp(placeholder.replace(/[\[\]]/g, '\\['), 'g');
        finalStory = finalStory.replace(regex, `<strong>${userWord}</strong>`); 
    });

    document.getElementById("output").innerHTML = `<p>${finalStory}</p>`;
}

function copyToClipboard() {
    let text = document.getElementById("output").innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("Story copied to clipboard!");
    });
}
