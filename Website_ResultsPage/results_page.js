// HTML Elements
const resultImg = document.getElementById("resultsImg");
const speciesName = document.getElementById("speciesName");
const sciName = document.getElementById("sciName");
const accText = document.getElementById("accText");
const lowWarning = document.getElementById("lowWarning");

// API Elements
const apiSummary = document.getElementById("apiSummary");
const apiLink = document.getElementById("apiLink");

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
    if (apiSummary) apiSummary.innerText = "Data unavailable.";
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
    // 3. GUARANTEED SCIENTIFIC NAMES
    // ==========================================
    // A local dictionary guarantees the scientific name is NEVER wrong or replaced by a simmilar type of other names 
    const speciesDict = {
        "Rohu": "Labeo rohita",
        "Catla": "Labeo catla",
        "Mrigal": "Cirrhinus mrigala",
        "Grass Carp": "Ctenopharyngodon idella",
        "Silver Carp": "Hypophthalmichthys molitrix",
        "Common Carp": "Cyprinus carpio"
    };

    const exactSciName = speciesDict[best.label] || "Scientific name unavailable";
    if (sciName) sciName.innerText = exactSciName;

    // ==========================================
    // WIKIPEDIA API 
    // ==========================================
    if (apiSummary && exactSciName !== "Scientific name unavailable") {
        // Search Wikipedia using the EXACT scientific name
        const searchQuery = encodeURIComponent(exactSciName); 
        
        fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${searchQuery}`)
            .then(response => {
                // Failsafe: If Wikipedia uses the common name for the page title instead of the scientific name
                if (!response.ok) {
                    return fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(best.label + " fish")}`).then(res => res.json());
                }
                return response.json();
            })
            .then(data => {
                let summaryText = data.extract || "No extended biological summary available for this species.";
                
                // Truncate to 250 characters so it fits perfectly in your dark blue card
                if (summaryText.length > 250) {
                    summaryText = summaryText.substring(0, 250) + "...";
                }
                apiSummary.innerText = summaryText;

                if (data.content_urls && data.content_urls.desktop) {
                    apiLink.href = data.content_urls.desktop.page;
                }
            })
            .catch(error => {
                console.error("API Error:", error);
                apiSummary.innerText = "Could not retrieve live encyclopedia data. Ensure you have an active internet connection.";
            });
    }

    // ==========================================
    // 5. GENERATE SLIDER PROGRESS BARS
    // ==========================================
    if (top4List) {
        // Start at index 1 to skip the winner, and loop through the next 4 possibilities
        for (let i = 1; i < preds.length && i < 5; i++) {
            let pScore = Math.round(preds[i].confidence * 100);
            
            if (pScore > 0) {
                let row = document.createElement("div");
                row.className = "barRow";
                
                // Securely build the text and slider bar formatting
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
// 6. BUTTON ROUTING
// ==========================================
if (anotherB) {
    anotherB.onclick = function() {
        window.location.href = "../Website_ImageUploadingPage/image_uploading_page.html";
    }
}

if (backB) {
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