document.getElementById("generate").addEventListener("click", async function() {
    let scenario = document.getElementById("scenario").value;
    let category = document.getElementById("category").value;
    
    let requestData = {};
    if (scenario) {
        requestData.scenario = scenario;
    } else if (category) {
        requestData.category = category;
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
        document.getElementById("output").innerText = result.story;
        document.getElementById("share-buttons").classList.remove("hidden");
        document.getElementById("regenerate").classList.remove("hidden");
    } else {
        document.getElementById("output").innerText = "Something went wrong. Try again!";
    }
});

document.getElementById("regenerate").addEventListener("click", async function() {
    let category = document.getElementById("category").value;
    if (!category) {
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
        document.getElementById("output").innerText = result.story;
    }
});

// Social sharing
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
