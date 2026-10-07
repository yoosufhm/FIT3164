var resultImg = document.getElementById("resultImg");
var speciesName = document.getElementById("speciesName");
var sciName = document.getElementById("sciName");
var accText = document.getElementById("accText");
var lowWarning = document.getElementById("lowWarning");
var familyText = document.getElementById("familyText");
var habitatText = document.getElementById("habitatText");
var regionText = document.getElementById("regionText");
var top4List = document.getElementById("top4List");
var anotherB = document.getElementById("anotherB");
var backB = document.getElementById("backB");

var speciesInfo = {
    "Rohu": {
        sci: "Labeo rohita",
        family: "Cyprinidae",
        habitat: "Freshwater",
        region: "South Asia"
    }
};

var saved = sessionStorage.getItem("fishResult");
var savedImg = sessionStorage.getItem("fishImage");

if (saved === null) {
    speciesName.innerText = "No result found";
    sciName.innerText = "Please upload an image first";
}   else {
    var data = JSON.parse(saved);
    var preds = data.predictions;
    var best = preds[0];
    var percent = (best.confidence * 100).toFixed(1);

    speciesName.innerText = best.species;
    accText.innerText = percent + "% accuracy";

    if (savedImg !==null) {
        resultImg.src = savedImg;
        resultImg.style.display = "block";
    }

    var info = speciesInfo[best.species];
    if (info ===undefined)  {
        sciName.innerText = "";
        familyText.innerText = "Details not available yet";
    } else {
        sciName.innerText = info.sci;
        familyText.innerText = "Family: " + info.family;
        habitatText.innerText = "Habitat: " + info.habitat;
        regionText.innerText = "Native region: " + info.region;
    }

    if (best.confidence < 0.6) {
        lowWarning.style.display = "block";
    }

    for (var i = 0; i < preds.length && i < 4; i++) {
        var p = (preds[i].confidence * 100).toFixed(1);
        var row = document.createElement("div");
        row.className = "barRow";
        row.innerText = preds[i].species + "-" + p + "%";
        var back = document.createElement("div");
        back.className = "barBack";
        var fill = document.createElement("div");
        fill.className = "barFill";
        fill.style.width = p + "%";
        back.appendChild(fill);
        row.appendChild(back);
        top4List.appendChild(row);
    }
}


anotherB.onclick = function() {
    window.location.href = "../Website_ImageUploadingPage/image_uploading_page.html";
}

backB.onclick = function () {
    window.location.href = "../Website_HomePage/homepage_index.html";
}

var mobileMenu = document.getElementById("mobile-menu");
var menuList = document.querySelector(".navbar__menu");

mobileMenu.onclick = function() {
    mobileMenu.classList.toggle("is-active");
    menuList.classList.toggle("active");
}