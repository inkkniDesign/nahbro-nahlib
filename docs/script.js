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
        ret
