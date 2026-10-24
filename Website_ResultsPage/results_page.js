// HTML Elements
const resultImg = document.getElementById("resultsImg");
const speciesName = document.getElementById("speciesName");
const sciName = document.getElementById("sciName");
const accText = document.getElementById("accText");
const lowWarning = document.getElementById("lowWarning");

// Slider Grid
const top4List = document.getElementById("top4List");

// Buttons
const anotherB = document.getElementById("anotherB");
const backB = document.getElementById("backB");

// 1. Fetch Data from sessionStorage
const savedPredictions = sessionStorage.getItem("fishPredictions");
const savedImg = sessionStorage.getItem("fishImage");

if (!savedPredictions) {
    speciesName.innerText = "No Result Found";
    accText.innerText = "Please upload an image first.";
} else {
    // 2. Parse the JSON Array
    const preds = JSON.parse(savedPredictions);
    const best = preds[0];
    const topScore = Math.round(best.confidence * 100);

    // Populate Hero Card
    speciesName.innerText = best.label;
    accText.innerText = `Confidence: ${topScore}%`;

    // Show Image
    if (savedImg) {
        resultImg.src = savedImg;
        resultImg.style.display = "block";
    }

    if (topScore < 40 && lowWarning) {
        lowWarning.style.display = "block";
    }

    // ==========================================
    // 3. SCIENTIFIC NAMES (from Table 1 of the Fish-Pak dataset paper)
    // ==========================================
    const scientificNames = {
        "Rohu": "Labeo rohita",
        "Catla": "Catla catla",
        "Mrigal": "Cirrhinus mrigala",
        "Grass Carp": "Ctenopharyngodon idella",
        "Silver Carp": "Hypophthalmichthys molitrix",
        "Common Carp": "Cyprinus carpio"
    };

    if (sciName) {
        sciName.innerText = scientificNames[best.label] || "Scientific name unavailable";
    }

    // ==========================================
    // 4. GENERATE SLIDER PROGRESS BARS
    // ==========================================
    if (top4List) {
        for (let i = 1; i < preds.length && i < 5; i++) {
            let pScore = Math.round(preds[i].confidence * 100);

            if (pScore > 0) {
                let row = document.createElement("div");
                row.className = "barRow";

                row.innerHTML = `
                    <div style="display: flex; justify-content: space-between; font-weight: 600;">
                        <span>${preds[i].label}</span>
                        <span style="color: #44ecff;">${pScore}%</span>
                    </div>
                    <div class="barBack">
                        <div class="barFill" style="width: ${pScore}%;"></div>
                    </div>
                `;

                top4List.appendChild(row);
            }
        }
    }
}

// ==========================================
// 5. BUTTON ROUTING
// ==========================================
if (anotherB) {
    anotherB.onclick = function() {
        window.location.href = "../Website_ImageUploadingPage/image_uploading_page.html";
    }
}

if (backB) {
    backB.onclick = function () {
        window.location.href = "index.html";
    }
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
