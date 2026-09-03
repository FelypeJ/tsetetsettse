/*
    QUANTUM PASS
    Gerador de senhas client-side

    A geração utiliza crypto.getRandomValues(),
    fornecido pelo navegador, para obter aleatoriedade
    criptograficamente segura.
*/

const output = document.getElementById("passwordOutput");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");

const lengthInput = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");

const uppercase = document.getElementById("uppercase");
const lowercase = document.getElementById("lowercase");
const numbers = document.getElementById("numbers");
const symbols = document.getElementById("symbols");

const ambiguous = document.getElementById("ambiguous");
const guarantee = document.getElementById("guarantee");

const strengthText = document.getElementById("strengthText");
const strengthFill = document.getElementById("strengthFill");

const entropyText = document.getElementById("entropyText");
const crackText = document.getElementById("crackText");

const entropyElement = document.getElementById("entropy");
const combinationsElement = document.getElementById("combinations");
const qualityElement = document.getElementById("quality");
const scoreElement = document.getElementById("score");

const modes = document.querySelectorAll(".mode");

let currentMode = "password";

const CHARSETS = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()-_=+[]{};:,.?/<>~"
};

const AMBIGUOUS = "l1I0Oo";

const WORDS = [
    "aurora", "nuvem", "cobalto", "pixel", "radar",
    "neon", "cometa", "orbit", "laser", "quantum",
    "vento", "oceano", "tigre", "foguete", "cristal",
    "codigo", "matrix", "galaxia", "energia", "sol",
    "lua", "montanha", "rio", "floresta", "tempestade",
    "prisma", "saturno", "cosmos", "diamante", "esfera",
    "vortex", "portal", "hacker", "escudo", "firewall"
];


/* =========================================================
   RANDOM CRIPTOGRAFICAMENTE SEGURO
========================================================= */

function secureRandom(max) {

    if (max <= 0) {
        throw new Error("Valor inválido.");
    }

    const array = new Uint32Array(1);

    /*
        Rejection sampling evita viés de módulo.
    */

    const maxUint = 0xFFFFFFFF;
    const limit = maxUint - (maxUint % max);

    let random;

    do {
        crypto.getRandomValues(array);
        random = array[0];
    } while (random >= limit);

    return random % max;
}


function randomCharacter(charset) {

    if (!charset.length) {
        return "";
    }

    return charset[secureRandom(charset.length)];
}


/* =========================================================
   CONFIGURAÇÃO
========================================================= */

function getCharset() {

    let charset = "";

    if (uppercase.checked) {
        charset += CHARSETS.uppercase;
    }

    if (lowercase.checked) {
        charset += CHARSETS.lowercase;
    }

    if (numbers.checked) {
        charset += CHARSETS.numbers;
    }

    if (symbols.checked) {
        charset += CHARSETS.symbols;
    }

    if (ambiguous.checked) {

        charset = [...charset]
            .filter(char => !AMBIGUOUS.includes(char))
            .join("");
    }

    return charset;
}


/* =========================================================
   SHUFFLE SEGURO
========================================================= */

function secureShuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = secureRandom(i + 1);

        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}


/* =========================================================
   SENHA
========================================================= */

function generatePassword() {

    const length = Number(lengthInput.value);
    const charset = getCharset();

    if (!charset.length) {

        alert("Selecione pelo menos um conjunto de caracteres.");

        return "";
    }

    let chars = [];

    /*
        Garante pelo menos um caractere de cada
        conjunto selecionado.
    */

    if (guarantee.checked) {

        const selectedSets = [];

        if (uppercase.checked)
            selectedSets.push(CHARSETS.uppercase);

        if (lowercase.checked)
            selectedSets.push(CHARSETS.lowercase);

        if (numbers.checked)
            selectedSets.push(CHARSETS.numbers);

        if (symbols.checked)
            selectedSets.push(CHARSETS.symbols);

        for (const set of selectedSets) {

            let cleanSet = set;

            if (ambiguous.checked) {

                cleanSet = [...set]
                    .filter(c => !AMBIGUOUS.includes(c))
                    .join("");
            }

            if (cleanSet.length) {
                chars.push(randomCharacter(cleanSet));
            }
        }
    }

    while (chars.length < length) {
        chars.push(randomCharacter(charset));
    }

    secureShuffle(chars);

    return chars.slice(0, length).join("");
}


/* =========================================================
   PASSPHRASE
========================================================= */

function generatePassphrase() {

    const wordCount = Math.max(
        4,
        Math.min(10, Math.floor(Number(lengthInput.value) / 5))
    );

    const words = [];

    for (let i = 0; i < wordCount; i++) {

        const word = WORDS[
            secureRandom(WORDS.length)
        ];

        words.push(word);
    }

    const separatorOptions = [
        "-",
        "_",
        ".",
        "@",
        "#"
    ];

    const separator =
        separatorOptions[
            secureRandom(separatorOptions.length)
        ];

    return words.join(separator);
}


/* =========================================================
   PIN
========================================================= */

function generatePIN() {

    const length = Math.max(
        4,
        Math.min(20, Number(lengthInput.value))
    );

    let pin = "";

    for (let i = 0; i < length; i++) {

        pin += randomCharacter("0123456789");
    }

    return pin;
}


/* =========================================================
   GERADOR PRINCIPAL
========================================================= */

function generate() {

    let password = "";

    if (currentMode === "password") {
        password = generatePassword();
    }

    if (currentMode === "passphrase") {
        password = generatePassphrase();
    }

    if (currentMode === "pin") {
        password = generatePIN();
    }

    if (!password) {
        return;
    }

    output.value = password;

    output.style.transform = "scale(.97)";
    output.style.opacity = ".3";

    setTimeout(() => {

        output.style.transform = "scale(1)";
        output.style.opacity = "1";

    }, 80);

    analyze(password);
}


/* =========================================================
   ANÁLISE
========================================================= */

function calculateEntropy(password) {

    if (!password) {
        return 0;
    }

    let pool = 0;

    if (currentMode === "pin") {
        pool = 10;
    }

    else if (currentMode === "passphrase") {
        pool = WORDS.length;
    }

    else {
        pool = getCharset().length;
    }

    if (!pool) {
        return 0;
    }

    return password.length * Math.log2(pool);
}


function formatLargeNumber(number) {

    if (number < 1000) {
        return Math.round(number).toString();
    }

    if (number < 1e6) {
        return (number / 1e3).toFixed(1) + "K";
    }

    if (number < 1e9) {
        return (number / 1e6).toFixed(1) + "M";
    }

    if (number < 1e12) {
        return (number / 1e9).toFixed(1) + "B";
    }

    if (number < 1e15) {
        return (number / 1e12).toFixed(1) + "T";
    }

    return number.toExponential(2);
}


function analyze(password) {

    const entropy = calculateEntropy(password);

    /*
        Esta é uma estimativa baseada no espaço de busca.
        Não representa uma previsão real de tempo para
        quebrar uma senha em todos os cenários.
    */

    let score = Math.min(
        100,
        Math.round((entropy / 128) * 100)
    );

    let strength;

    if (entropy < 40) {
        strength = "FRACA";
    }

    else if (entropy < 60) {
        strength = "MODERADA";
    }

    else if (entropy < 80) {
        strength = "FORTE";
    }

    else if (entropy < 100) {
        strength = "MUITO FORTE";
    }

    else {
        strength = "EXCELENTE";
    }

    strengthText.textContent = strength;

    strengthText.style.color =
        entropy < 40
            ? "#ff304f"
            : entropy < 60
                ? "#ffc400"
                : "#00ff9d";

    strengthFill.style.width =
        Math.max(3, score) + "%";

    entropyText.textContent =
        `Entropia: ${entropy.toFixed(1)} bits`;

    entropyElement.textContent =
        entropy.toFixed(1) + " bits";

    scoreElement.textContent =
        String(score).padStart(2, "0");

    qualityElement.textContent =
        strength;

    /*
        Número aproximado de possibilidades.
    */

    let pool;

    if (currentMode === "pin") {
        pool = 10;
    }

    else if (currentMode === "passphrase") {
        pool = WORDS.length;
    }

    else {
        pool = getCharset().length;
    }

    const combinations =
        Math.pow(pool, password.length);

    combinationsElement.textContent =
        formatLargeNumber(combinations);

    /*
        Texto qualitativo.
    */

    if (entropy < 40) {
        crackText.textContent = "Resistência: baixa";
    }

    else if (entropy < 60) {
        crackText.textContent = "Resistência: média";
    }

    else if (entropy < 80) {
        crackText.textContent = "Resistência: alta";
    }

    else {
        crackText.textContent = "Resistência: extrema";
    }

    updateCore(score);
}


/* =========================================================
   SLIDER
========================================================= */

lengthInput.addEventListener("input", () => {

    lengthValue.textContent = lengthInput.value;

    const percent =
        ((lengthInput.value - lengthInput.min) /
        (lengthInput.max - lengthInput.min)) * 100;

    lengthInput.style.background =
        `linear-gradient(
            90deg,
            var(--cyan) ${percent}%,
            #172136 ${percent}%
        )`;
});


/* =========================================================
   MODOS
========================================================= */

modes.forEach(mode => {

    mode.addEventListener("click", () => {

        modes.forEach(m => {
            m.classList.remove("active");
        });

        mode.classList.add("active");

        currentMode =
            mode.dataset.mode;

        const characterOptions =
            document.querySelector(".character-options");

        const advanced =
            document.querySelector(".advanced-options");

        const lengthGroup =
            document.getElementById("lengthGroup");

        if (currentMode === "password") {

            characterOptions.style.display = "grid";
            advanced.style.display = "block";

            lengthInput.min = 8;
            lengthInput.max = 64;

            if (Number(lengthInput.value) < 8) {
                lengthInput.value = 20;
            }

            lengthValue.textContent =
                lengthInput.value;
        }

        else if (currentMode === "passphrase") {

            characterOptions.style.display = "none";
            advanced.style.display = "none";

            lengthInput.min = 20;
            lengthInput.max = 50;

            if (Number(lengthInput.value) < 20) {
                lengthInput.value = 25;
            }

            lengthValue.textContent =
                lengthInput.value;
        }

        else {

            characterOptions.style.display = "none";
            advanced.style.display = "none";

            lengthInput.min = 4;
            lengthInput.max = 20;

            if (Number(lengthInput.value) > 20) {
                lengthInput.value = 12;
            }

            lengthValue.textContent =
                lengthInput.value;
        }

        generate();
    });
});


/* =========================================================
   COPY
========================================================= */

copyBtn.addEventListener("click", async () => {

    if (!output.value || output.value === "Clique em GERAR") {
        return;
    }

    try {

        await navigator.clipboard.writeText(
            output.value
        );

        copyBtn.textContent = "COPIADO!";

        setTimeout(() => {
            copyBtn.textContent = "COPIAR";
        }, 1500);

    } catch {

        output.select();

        document.execCommand("copy");

        copyBtn.textContent = "COPIADO!";

        setTimeout(() => {
            copyBtn.textContent = "COPIAR";
        }, 1500);
    }
});


/* =========================================================
   BOTÃO GERAR
========================================================= */

generateBtn.addEventListener("click", generate);


/* =========================================================
   THREE.JS — NÚCLEO 3D
========================================================= */

const container =
    document.getElementById("three-container");

const scene =
    new THREE.Scene();

const camera =
    new THREE.PerspectiveCamera(
        45,
        container.clientWidth /
        container.clientHeight,
        0.1,
        1000
    );

camera.position.z = 5;

const renderer =
    new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
    container.clientWidth,
    container.clientHeight
);

container.appendChild(renderer.domElement);


/* Grupo principal */

const core =
    new THREE.Group();

scene.add(core);


/* Esfera */

const sphereGeometry =
    new THREE.IcosahedronGeometry(
        1.15,
        3
    );

const sphereMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x00f6ff,
        wireframe: true,
        transparent: true,
        opacity: .55
    });

const sphere =
    new THREE.Mesh(
        sphereGeometry,
        sphereMaterial
    );

core.add(sphere);


/* Segunda esfera */

const innerGeometry =
    new THREE.IcosahedronGeometry(
        .72,
        2
    );

const innerMaterial =
    new THREE.MeshBasicMaterial({
        color: 0x8a2be2,
        wireframe: true,
        transparent: true,
        opacity: .35
    });

const inner =
    new THREE.Mesh(
        innerGeometry,
        innerMaterial
    );

core.add(inner);


/* Anéis */

const rings = [];

for (let i = 0; i < 3; i++) {

    const geometry =
        new THREE.TorusGeometry(
            1.45 + i * .18,
            .008,
            8,
            100
        );

    const material =
        new THREE.MeshBasicMaterial({
            color:
                i === 1
                    ? 0xff2bd6
                    : 0