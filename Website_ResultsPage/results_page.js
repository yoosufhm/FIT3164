// HTML Elements
const resultImg = document.getElementById("resultsImg");
const speciesName = document.getElementById("speciesName");
const accText = document.getElementById("accText");
const lowWarning = document.getElementById("lowWarning");

// Grid Element
const top4List = document.getElementById("top4List");

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

    if (top4List) {
        // Start at index 1 to skip the winner, and loop through the next 4 possibilities
        for (let i = 1; i < preds.length && i < 5; i++) {
            let pScore = Math.round(preds[i].confidence * 100);
            
            // Only show slider if probability is higher than 0%
            if (pScore > 0) {
                let row = document.createElement("div");
                row.className = "barRow";
                row.innerText = preds[i].label + " - " + pScore + "%";
                
                let back = document.createElement("div");
                back.className = "barBack";
                
                let fill = document.createElement("div");
                fill.className = "barFill";
                fill.style.width = pScore + "%";
                
                back.appendChild(fill);
                row.appendChild(back);
                
                // Inject the slider into the top4List div!
                top4List.appendChild(row);
            }
        }
    }
}

// ==========================================
// 6. BUTTON ROUTING
// ==========================================
if(anotherB) {
    anotherB.onclick = function() {
        window.location.href = "../Website_ImageUploadingPage/image_uploading_page.html";
    }
}

if(backB) {
    backB.onclick = function () {
        window.location.href = "../Website_HomePage/homepage_index.html";
    }
}

// ==========================================
// 7. MOBILE MENU LOGIC
// ==========================================
const mobileMenu = document.getElementById("mobile-menu");
const menuList = document.querySelector(".navbar__menu");

if (mobileMenu) {
    mobileMenu.onclick = function() {
        mobileMenu.classList.toggle("is-active");
        menuList.classList.toggle("active");
    }
}