// HTML Elements
const resultImg = document.getElementById("resultsImg");
const speciesName = document.getElementById("speciesName");
const accText = document.getElementById("accText");
const lowWarning = document.getElementById("lowWarning");

// Grid Element
const probabilitiesGrid = document.getElementById("probabilitiesGrid");

// Buttons
const anotherB = document.getElementById("anotherB");
const backB = document.getElementById("backB");

// 1. Fetch Data from sessionStorage
const savedPredictions = sessionStorage.getItem("fishPredictions");
const savedImg = sessionStorage.getItem("fishImage");

if (!savedPredictions) {
    // Failsafe if accessed directly without uploading
    speciesName.innerText = "No Result Found";
    accText.innerText = "Please upload an image first.";
} else {
    // 2. Parse the JSON Array 
    const preds = JSON.parse(savedPredictions);
    
    // 3. Process the Top Match (Index 0)
    const best = preds[0];
    const topScore = Math.round(best.confidence * 100);

    speciesName.innerText = best.label;
    accText.innerText = `Confidence: ${topScore}%`;

    // Show Image
    if (savedImg) {
        resultImg.src = savedImg;
        resultImg.style.display = "block";
    }

    // Show low confidence warning if under 40%
    if (topScore < 40) {
        lowWarning.style.display = "block";
    }

    // ==========================================
    // 4. GENERATE INDIVIDUAL PROBABILITY CARDS
    // ==========================================
    // Loop through the rest of the array (skipping the winner at index 0)
    for (let i = 1; i < preds.length; i++) {
        let pName = preds[i].label;
        let pScore = Math.round(preds[i].confidence * 100);

        // Only show cards for probabilities higher than 0%
        if (pScore > 0) {
            // Create the card container
            let card = document.createElement("div");
            card.className = "prob-card";

            // Add the Fish Name
            let nameTag = document.createElement("h4");
            nameTag.innerText = pName;

            // Add the Progress Bar Background
            let barBack = document.createElement("div");
            barBack.className = "barBack";

            // Add the Progress Bar Fill (The orange/yellow gradient)
            let barFill = document.createElement("div");
            barFill.className = "barFill";
            // Set the width based on the confidence score!
            barFill.style.width = pScore + "%";

            // Add the text percentage
            let percentTag = document.createElement("div");
            percentTag.className = "prob-percent";
            percentTag.innerText = pScore + "%";

            // Construct the card
            barBack.appendChild(barFill);
            card.appendChild(nameTag);
            card.appendChild(barBack);
            card.appendChild(percentTag);

            // Inject the card into the grid on the webpage
            probabilitiesGrid.appendChild(card);
        }
    }
}

// ==========================================
// 5. BUTTON ROUTING
// ==========================================
anotherB.onclick = function() {
    window.location.href = "../Website_ImageUploadingPage/image_uploading_page.html";
}

backB.onclick = function () {
    window.location.href = "../Website_HomePage/homepage_index.html";
}

// ==========================================
// 6. MOBILE MENU LOGIC
// ==========================================
const mobileMenu = document.getElementById("mobile-menu");
const menuList = document.querySelector(".navbar__menu");

if (mobileMenu) {
    mobileMenu.onclick = function() {
        mobileMenu.classList.toggle("is-active");
        menuList.classList.toggle("active");
    }
}