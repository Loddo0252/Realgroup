// =========================
// DOM ELEMENTS
// =========================
const dropdown = document.getElementById("dropdown");
const docTypeTxt = document.getElementById("document_type_txt");
const countryTxt = document.getElementById("country_code_txt");
const nationalityTxt = document.getElementById("nationality_txt");
const surnameTxt = document.getElementById("surname_txt");
const givenTxt = document.getElementById("given_names_txt");
const docNumberTxt = document.getElementById("document_number_txt");
const sexTxt = document.getElementById("sex_txt");
const birthTxt = document.getElementById("birth_date_txt");
const expiryTxt = document.getElementById("expiry_date_txt");
const opt1Txt = document.getElementById("optional_data1_txt");
const opt2Txt = document.getElementById("optional_data2_txt");

const output = document.getElementById("outputMRZ");
const canvas = document.getElementById("overlay");
const ctx = canvas.getContext("2d");

// =========================
// ICAO MRZ CHECK DIGIT
// =========================
static calculateCheckDigit(data) {
    const weights = [7, 3, 1];

    const charValues = {
        '<': 0, '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5,
        '6': 6, '7': 7, '8': 8, '9': 9,
        'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15,
        'G': 16, 'H': 17, 'I': 18, 'J': 19, 'K': 20, 'L': 21,
        'M': 22, 'N': 23, 'O': 24, 'P': 25, 'Q': 26, 'R': 27,
        'S': 28, 'T': 29, 'U': 30, 'V': 31, 'W': 32, 'X': 33,
        'Y': 34, 'Z': 35
    };

    let sum = 0;

    for (let i = 0; i < data.length; i++) {
        const char = data[i];
        const value = charValues[char] ?? 0;

        sum += value * weights[i % 3];
    }

    return (sum % 10).toString();

}

// =========================
// FORMAT HELPERS
// =========================
function pad(str, len) {
    return (str + "<".repeat(len)).substring(0, len);
}

function clean(str) {
    return str.toUpperCase().replace(/[^A-Z0-9]/g, "<");
}

// =========================
// RANDOM DATA
// =========================
function randomize() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    function randLetter() {
        return letters[Math.floor(Math.random() * letters.length)];
    }

    function randNum(len) {
        let n = "";
        for (let i = 0; i < len; i++) n += Math.floor(Math.random() * 10);
        return n;
    }

    surnameTxt.value = "DOE";
    givenTxt.value = "JOHN";
    docNumberTxt.value = randLetter() + randNum(7);
    countryTxt.value = "NGA";
    nationalityTxt.value = "NGA";
    sexTxt.value = Math.random() > 0.5 ? "M" : "F";
    birthTxt.value = "900101";
    expiryTxt.value = "300101";
    opt1Txt.value = randNum(9);
    opt2Txt.value = "";
}

// =========================
// DOCUMENT TYPE SWITCH
// =========================
function selectChanged() {
    const type = dropdown.value;

    if (type.includes("Passport")) {
        docTypeTxt.value = "P";
    } else {
        docTypeTxt.value = "I";
    }
}

// =========================
// MRZ GENERATOR (MAIN)
// =========================
function generate() {
    const type = dropdown.value;

    const docType = clean(docTypeTxt.value || "P");
    const country = clean(countryTxt.value || "NGA");
    const nationality = clean(nationalityTxt.value || "NGA");

    const surname = clean(surnameTxt.value || "DOE");
    const given = clean(givenTxt.value || "JOHN");

    const docNumber = clean(docNumberTxt.value || "A1234567");
    const sex = clean(sexTxt.value || "M");

    const birth = clean(birthTxt.value || "900101");
    const expiry = clean(expiryTxt.value || "300101");

    const opt1 = clean(opt1Txt.value || "");
    const opt2 = clean(opt2Txt.value || "");

    let mrz = "";

    // =========================
    // TD3 PASSPORT (2 lines 44 chars)
    // =========================
    if (type.includes("Passport")) {
        const docNumCD = checkDigit(docNumber);
        const birthCD = checkDigit(birth);
        const expiryCD = checkDigit(expiry);

        const line1 = pad(docType + "<" + country + surname + "<<" + given, 44);
        const line2 =
            pad(docNumber + docNumCD + country + birth + birthCD + expiry + expiryCD + sex + opt1, 44);

        mrz = line1 + "\n" + line2;
    }

    // =========================
    // TD1 ID CARD (3 lines 30 chars)
    // =========================
    else {
        const docNumCD = checkDigit(docNumber);
        const birthCD = checkDigit(birth);
        const expiryCD = checkDigit(expiry);

        const line1 = pad(docType + country + docNumber + docNumCD, 30);
        const line2 = pad(birth + birthCD + sex + expiry + expiryCD + nationality, 30);
        const line3 = pad(surname + "<<" + given, 30);

        mrz = line1 + "\n" + line2 + "\n" + line3;
    }

    output.value = mrz;

    drawPreview(mrz);
}

// =========================
// CANVAS PREVIEW
// =========================
function drawPreview(text) {
    canvas.width = 500;
    canvas.height = 200;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ffcc";
    ctx.font = "16px monospace";

    const lines = text.split("\n");

    lines.forEach((line, i) => {
        ctx.fillText(line, 20, 50 + i * 30);
    });
}

// =========================
// LOADING INDICATOR (optional safety)
// =========================
display: none
document.getElementById("loading-indicator").classList.add("active"); // show
document.getElementById("loading-indicator").classList.remove("active"); // hide
};
