// ==========================================
// 1. MOBILE MENU LOGIC
// ==========================================
const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

if (menu) {
    menu.addEventListener('click', function() {
        menu.classList.toggle('is-active');
        menuLinks.classList.toggle('active');
    });
}

// ==========================================
// 2. INSTRUCTIONS PAGE TRACKER
// ==========================================
const instructionsLink = document.getElementById('nav-instructions');
if (instructionsLink) {
    instructionsLink.addEventListener('click', function() {
        sessionStorage.setItem('hasVisitedInstructionsPage', 'true');
    });
}


// ==========================================
// 3. HTML ELEMENT VARIABLES
// ==========================================
var fileInput = document.getElementById("fileInput");
var browseBtn = document.getElementById("browseBtn");
var previewArea = document.getElementById("previewArea");
var previewImg = document.getElementById("previewImg");
var fileName = document.getElementById("fileName");
var submitBtn = document.getElementById("submitBtn");
var removeBtn = document.getElementById("removeBtn");
var dropArea = document.getElementById("dropArea");

// Error Banner Elements 
const topBanner = document.getElementById("top-alert-banner");
const bannerMessage = document.getElementById("banner-message");
const closeBannerBtn = document.getElementById("close-banner-btn");

// Success Banner Elements 
const imageSuccessBanner = document.getElementById("image-upload-success-banner");
const imageSuccessBannerMessage = document.getElementById("success-banner-message");
const closeSuccessBtn = document.getElementById("close-success-btn");

var myFile = null;

// ==========================================
// 4. BANNER ANIMATION FUNCTIONS
// ==========================================
function showBanner(message) {
    bannerMessage.innerText = message;
    topBanner.classList.add("show-banner");
    hideSuccessBanner(); 
}

function hideBanner() {
    topBanner.classList.remove("show-banner");
}

function showSuccessBanner(message) {
    imageSuccessBannerMessage.innerText = message;
    imageSuccessBanner.classList.add("show-banner");
    hideBanner();
}

function hideSuccessBanner() {
    imageSuccessBanner.classList.remove("show-banner");
}

closeSuccessBtn.addEventListener("click", function() {
    hideSuccessBanner();
});

closeBannerBtn.addEventListener("click", function() {
    hideBanner();
});


// ==========================================
// 5. UPLOAD METHOD 1: DRAG AND DROP
// ==========================================
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, function(e) {
        e.preventDefault(); 
        e.stopPropagation(); 
    }, false);
});

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.add('highlight'), false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.remove('highlight'), false);
});

dropArea.addEventListener('drop', function(e) {
    let files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files; 
        // the word 'drag' is added to tell the validation function how this file arrived
        handleFile(files[0], 'drag'); 
    }
}, false);


// ==========================================
// 6. UPLOAD METHOD 2: CLICK TO BROWSE
// ==========================================
dropArea.addEventListener('click', () => {
    fileInput.click();
});

browseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
});

fileInput.addEventListener('change', function() {
    if(this.files.length > 0) {
        // the word 'browse' is added to tell the validation function how this file arrived
        handleFile(this.files[0], 'browse');
    }
});


// ==========================================
// 7. UPLOAD METHOD 3: PASTE (Ctrl+V / Cmd+V)
// ==========================================
document.addEventListener('paste', function(e) {
    const clipboardData = e.clipboardData || window.clipboardData;
    const items = clipboardData.items;

    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;

            //  the word 'paste' is added to tell the validation function how this file arrived
            handleFile(file, 'paste');
            break;
        }
    }
});


// ==========================================
// 8. THE VALIDATION ENGINE (Handles all 3 Methods)
// ==========================================
function handleFile(file, method) {
    
    // Assign the incoming file to the global myFile variable
    myFile = file;

    // Hide both banners on new file select
    hideBanner();
    hideSuccessBanner();

    // Check 1: Is it a PNG or JPEG file?
    if (myFile.type !== "image/png" && myFile.type !== "image/jpeg") {
    showBanner("Invalid file type. Please upload a PNG or JPEG file only.");
    resetUpload();
}
    // Check 2: Is it under 8MB? 
    else if (myFile.size > 8000000) {
         showBanner("File is too large. The maximum allowed size is 8MB.");
        resetUpload();
    }
    // Check 3: If it passes both tests, generate the image preview
    else {
        const read = new FileReader();
        read.onload = function (r) {
            previewImg.src = r.target.result; 
        }
        read.readAsDataURL(myFile); 

        fileName.innerText = myFile.name;
        previewArea.style.display = "block";
        submitBtn.disabled = false;

        // ==========================================
        // CUSTOM NOTIFICATIONS BASED ON UPLOAD METHODS
        // ==========================================
        // Now that the file is safe, we check the 'method' tag we passed in earlier
        if (method === 'drag') {
            showSuccessBanner("Image has been successfully dragged and dropped!");
        } else if (method === 'paste') {
            showSuccessBanner("Image has been successfully pasted from the clipboard!");
        } else if (method === 'browse') {
            showSuccessBanner("Image has been successfully selected!");
        }
    }
}

// A helper function to wipe the form clean when a bad file is given
function resetUpload() {
    fileInput.value = "";
    previewArea.style.display = "none";
    submitBtn.disabled = true;
    myFile = null;
}

// ==========================================
// 9. FINAL ACTION BUTTONS
// ==========================================
removeBtn.onclick = function() {
    resetUpload(); 
    hideBanner(); 
    hideSuccessBanner(); 
}

// Final Submit Action
submitBtn.onclick = async function() {
    // 1. Safety check
    if (!myFile) return; 

    // 2. Set the loading state on buttons
    submitBtn.innerText = "Analyzing Fish Species...";
    submitBtn.disabled = true;
    removeBtn.disabled = true;
    showSuccessBanner("Connecting to the SnapFin Vision Transformer...");

    try {
        // 3. Dynamically import both the Client and handle_file from the Gradio CDN
        const { Client, handle_file } = await import("https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js");

        // 4. Connect securely to your specific Hugging Face space
        const client = await Client.connect("https://pxe123-fyp-fish-classifier-v2.hf.space/");

        // 5. Send the raw image file directly to the model using the exact API structure required
        const result = await client.predict("/predict", {
            image: handle_file(myFile),
        });

        // 6. Extract the AI's response array
        const outputData = result.data[0];
        let bannerContent = "";

        // 7. Map out the full probability list
        if (outputData && outputData.confidences) {
            // Grab the top match
            const topMatch = outputData.confidences[0];
            const topName = topMatch.label;

            const topScore = Math.round(topMatch.confidence * 100);

            // Format ALL probabilities into a single line (e.g., "Rohu (17%) | Silver Carp (16%)")
            const allProbabilities = outputData.confidences
                .slice(1) 
                .map(c => `${c.label} (${Math.round(c.confidence * 100)}%)`)
                .join(", ");

            // 8. Build the simple text layout
            bannerContent = `Identified Species: ${topName} | Confidence: ${topScore}% (Full Breakdown: ${allProbabilities})`;
            
        } else {
            bannerContent = `Identified Species: ${outputData.label || "Unknown Format"}`;
        }

        // 9. Display the full results breakdown in your custom banner
        /* showSuccessBanner(bannerContent); */

        // Store the Data for the Results Page 
        sessionStorage.setItem("fishPredictions", JSON.stringify(outputData.confidences));
        sessionStorage.setItem("fishImage", previewImg.src); 
        
        console.log("SUCCESS! Data saved securely.");
        // Print the saved results to the console to verify that storing part is actually working 
        console.log("SUCCESS! Data saved to sessionStorage:", sessionStorage.getItem("fishResultData"));

        hideSuccessBanner();

        document.getElementById("redirect-popup").style.display = "flex";

        // Wait for 3 seconds, then route to the results page using (No setTimeout string evaluation issues)
        await new Promise(resolve => setTimeout(resolve, 3000));
        window.location.href = "../Website_ResultsPage/results_page.html";

    } catch (error) {
        // Handle errors if the Hugging Face Space is asleep or offline
        console.error("Gradio Prediction Error:", error);
        
        // Convert the error to a lowercase string so we can scan it for keywords
        const errorMsg = error.toString().toLowerCase();

        // Check for specific Hugging Face server states
        if (errorMsg.includes("quota") || errorMsg.includes("limit") || errorMsg.includes("429")) {
            showBanner("GPU Limit Reached: The Hugging Face server has run out of its free GPU quota. Please try again later.");
        } else if (errorMsg.includes("sleeping") || errorMsg.includes("sleep")) {
            showBanner("The AI model is currently waking up from sleep mode. Please wait 60 seconds and try again.");
        } else {
            showBanner("Failed to connect. Ensure your Hugging Face Space is active and online.");
        }
        // Restore the button states so the user can submit again or remove
        submitBtn.innerText = "Submit for Classification";
        submitBtn.disabled = false;
        removeBtn.disabled = false;
    }
};  