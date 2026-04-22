// Helper: get element value
function val(id) {
    return document.getElementById(id).value.toUpperCase();
}

// Helper: set value
function setVal(id, value) {
    document.getElementById(id).value = value;
}

// Show loading
function showLoading(show = true) {
    const loader = document.getElementById("loading-indicator");
    loader.classList.toggle("show", show);
}

// MRZ formatting helper
function formatMRZ(text, length) {
    text = text.replace(/[^A-Z0-9<]/g, "").toUpperCase();
    return (text + "<".repeat(length)).substring(0, length);
}

// Generate MRZ
function generate() {
    showLoading(true);

    setTimeout(() => {
        const docType = val("document_type_txt") || "P";
        const country = val("country_code_txt") || "GBR";
        const surname = val("surname_txt");
        const given = val("given_names_txt");
        const passport = val("document_number_txt");
        const nationality = val("nationality_txt");
        const birth = val("birth_date_txt");
        const sex = val("sex_txt") || "M";
        const expiry = val("expiry_date_txt");
        const optional1 = val("optional_data1_txt");

        // Line 1
        let name = surname + "<<" + given.replace(/ /g, "<");
        let line1 = formatMRZ(docType + "<" + country + name, 44);

        // Line 2
        let line2 =
            formatMRZ(passport, 9) +
            "<" +
            nationality +
            formatMRZ(birth, 6) +
            "0" + // fake check digit
            sex +
            formatMRZ(expiry, 6) +
            "0" +
            formatMRZ(optional1, 14) +
            "0";

        line2 = formatMRZ(line2, 44);

        const mrz = line1 + "\n" + line2;

        document.getElementById("outputMRZ").value = mrz;

        drawCanvas(mrz);
        showLoading(false);
    }, 500);
}

// Random data generator
function randomize() {
    const names = ["AZIZ", "JOHN", "EMMA", "DAVID", "FATIMA"];
    const surnames = ["LODDO", "SMITH", "DOE", "ALI", "IBRAHIM"];
    const countries = ["GBR", "USA", "NGA", "FRA", "CAN"];

    function rand(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function randNum(len) {
        let str = "";
        for (let i = 0; i < len; i++) {
            str += Math.floor(Math.random() * 10);
        }
        return str;
    }

    setVal("document_type_txt", "P");
    setVal("country_code_txt", rand(countries));
    setVal("nationality_txt", rand(countries));
    setVal("surname_txt", rand(surnames));
    setVal("given_names_txt", rand(names));
    setVal("document_number_txt", Math.random().toString(36).substring(2, 11).toUpperCase());
    setVal("sex_txt", Math.random() > 0.5 ? "M" : "F");
    setVal("birth_date_txt", randNum(6));
    setVal("expiry_date_txt", randNum(6));
    setVal("optional_data1_txt", Math.random().toString(36).substring(2, 10).toUpperCase());
    setVal("optional_data2_txt", "OPTIONAL");
}

// Dropdown change handler
function selectChanged() {
    const value = document.getElementById("dropdown").value;

    if (value.includes("Passport")) {
        setVal("document_type_txt", "P");
    } else {
        setVal("document_type_txt", "I");
    }
}

// Canvas preview
function drawCanvas(mrz) {
    const canvas = document.getElementById("overlay");
    const ctx = canvas.getContext("2d");

    canvas.width = 500;
    canvas.height = 300;

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = "#000";
    ctx.font = "bold 20px Arial";
    ctx.fillText("Mock Travel Document", 120, 40);

    // MRZ text
    ctx.font = "16px monospace";
    const lines = mrz.split("\n");

    ctx.fillText(lines[0], 20, 220);
    ctx.fillText(lines[1], 20, 250);
}

// Init defaults
window.onload = () => {
    selectChanged();
};
