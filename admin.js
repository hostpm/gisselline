const config = window.STOCK_SUPABASE;
const client = window.supabase.createClient(config.url, config.publishableKey);

const authPanel = document.querySelector("#authPanel");
const dashboard = document.querySelector("#dashboard");
const loginForm = document.querySelector("#loginForm");
const loginEmail = document.querySelector("#loginEmail");
const loginPassword = document.querySelector("#loginPassword");
const loginStatus = document.querySelector("#loginStatus");
const sessionEmail = document.querySelector("#sessionEmail");
const logoutButton = document.querySelector("#logoutButton");
const productForm = document.querySelector("#productForm");
const productId = document.querySelector("#productId");
const currentImageUrl = document.querySelector("#currentImageUrl");
const productSection = document.querySelector("#productSection");
const productName = document.querySelector("#productName");
const productDescription = document.querySelector("#productDescription");
const productPrice = document.querySelector("#productPrice");
const productPriceLabel = document.querySelector("#productPriceLabel");
const productCategory = document.querySelector("#productCategory");
const productTags = document.querySelector("#productTags");
const tagOptions = document.querySelector("#tagOptions");
const productImage = document.querySelector("#productImage");
const productGalleryImages = document.querySelector("#productGalleryImages");
const productAvailable = document.querySelector("#productAvailable");
const productStatus = document.querySelector("#productStatus");
const productsList = document.querySelector("#productsList");
const imagePreview = document.querySelector("#imagePreview");
const galleryPreview = document.querySelector("#galleryPreview");
const resetFormButton = document.querySelector("#resetFormButton");
const refreshButton = document.querySelector("#refreshButton");
const seedButton = document.querySelector("#seedButton");
const saveButton = document.querySelector("#saveButton");
const formTitle = document.querySelector("#formTitle");
const listSectionFilter = document.querySelector("#listSectionFilter");
const listCategoryFilter = document.querySelector("#listCategoryFilter");
const listSearch = document.querySelector("#listSearch");
const openCreateButton = document.querySelector("#openCreateButton");
const sectionTabButtons = document.querySelectorAll("[data-section-tab]");
const activeSectionEyebrow = document.querySelector("#activeSectionEyebrow");
const activeSectionTitle = document.querySelector("#activeSectionTitle");
const activeSectionText = document.querySelector("#activeSectionText");
let allProducts = [];
let draggedProductId = "";
let pointerDropTargetId = "";
let currentGalleryUrls = [];
let selectedGalleryFiles = [];
let galleryColumnAvailable = true;
const initialStockProducts = [
    ["Ballena morada", "Amigurumi tejido.", "Amigurumi", 4, "assets/web/stock/01-ballena-morada.webp"],
    ["Llaveros tejidos", "Modelos variados.", "Llaveros", 1.5, "assets/web/stock/02-llaveros-varios-precios.webp"],
    ["Colgante buhito", "Tejido celeste.", "Colgantes", 4, "assets/web/stock/03-colgante-buhito-celeste.webp"],
    ["Tortuguitas rosa y morada", "Par tejido.", "Amigurumi", 3, "assets/web/stock/04-tortuguitas-rosa-morada.webp"],
    ["Tortuguitas duo", "Par de tortuguitas tejidas.", "Amigurumi", 3, "assets/web/stock/05-tortuguitas-duo.webp"],
    ["Llaveros fantasma", "Colgantes tejidos.", "Llaveros", 2, "assets/web/stock/06-llaveros-fantasma.webp"],
    ["Monedero rana", "Redondo tejido.", "Accesorios", 5, "assets/web/stock/07-monedero-redondo-rana.webp"],
    ["Bolsitos malla collage", "Modelos tejidos variados.", "Bolsitos", 6, "assets/web/stock/08-bolsitos-malla-collage.webp"],
    ["Llaveros caracol", "Colgantes tejidos.", "Llaveros", 2, "assets/web/stock/09-llaveros-caracol.webp"],
    ["Bolsitos malla duo", "Par tejido.", "Bolsitos", 6, "assets/web/stock/10-bolsitos-malla-duo.webp"],
    ["Bolsitos malla par", "Par tejido.", "Bolsitos", 6, "assets/web/stock/11-bolsitos-malla-par.webp"],
    ["Bolsito malla verde", "Bolsito tejido.", "Bolsitos", 5, "assets/web/stock/12-bolsito-malla-verde.webp"],
    ["Mini bolsitos colores", "Colores variados.", "Bolsitos", 3, "assets/web/stock/13-mini-bolsitos-colores.webp"],
    ["Flores tejidas azul y roja", "Par tejido.", "Flores", 2.5, "assets/web/stock/14-flor-azul-roja.webp"],
    ["Flor azul", "Flor tejida.", "Flores", 2.5, "assets/web/stock/15-flor-azul.webp"],
    ["Flores collage", "Modelos tejidos variados.", "Flores", 2.5, "assets/web/stock/16-flor-collage.webp"],
    ["Mini bolsito azul", "Bolsito tejido.", "Bolsitos", 3, "assets/web/stock/17-mini-bolsito-azul.webp"],
    ["Mini bolsitos tres", "Trio tejido.", "Bolsitos", 3, "assets/web/stock/18-mini-bolsitos-tres.webp"],
    ["Tortuguitas naranja y azul", "Par tejido.", "Amigurumi", 3, "assets/web/stock/19-tortuguitas-naranja-azul.webp"],
    ["Llaveros varios", "Modelos tejidos variados.", "Llaveros", 1.5, "assets/web/stock/20-llaveros-varios.webp"],
    ["Llaveros hoja y sandia", "Hoja y sandia tejidas.", "Llaveros", 1.5, "assets/web/stock/21-llaveros-hoja-sandia.webp"],
    ["Tortuguita naranja", "Amigurumi tejido.", "Amigurumi", 2, "assets/web/stock/22-tortuguita-naranja.webp"],
    ["Tortuguita azul", "Amigurumi tejido.", "Amigurumi", 2, "assets/web/stock/23-tortuguita-azul.webp"],
    ["Fresas colgantes", "Par tejido.", "Colgantes", 4, "assets/web/stock/24-fresas-colgantes.webp"],
    ["Colgante oso collage", "Modelo tejido.", "Colgantes", 5, "assets/web/stock/25-colgante-oso-collage.webp"],
    ["Colgante oso", "Tejido artesanal.", "Colgantes", 5, "assets/web/stock/26-colgante-oso.webp"],
];

const sectionSettings = {
    stock: {
        categories: ["Amigurumi", "Llaveros", "Colgantes", "Accesorios", "Bolsitos", "Flores"],
        tags: [
            ["Amigurumi", "Amigurumi"],
            ["Llaveros", "Llaveros"],
            ["Colgantes", "Colgantes"],
            ["Accesorios", "Accesorios"],
            ["Bolsitos", "Bolsitos"],
            ["Flores", "Flores"],
        ],
    },
    catalogo: {
        categories: ["Grabado", "Crochet", "Amigurumi", "Flores", "Accesorios", "Catalogo"],
        tags: [
            ["corte-grabado", "Corte y grabado"],
            ["llaveros", "Llaveros"],
            ["colgantes", "Colgantes"],
            ["mdf-acrilico", "MDF / acrilico"],
            ["placas-trofeos", "Placas / trofeos"],
            ["tejidos-crochet", "Tejidos crochet"],
            ["amigurumis", "Amigurumis"],
            ["flores-crochet", "Flores crochet"],
            ["accesorios-crochet", "Accesorios crochet"],
        ],
    },
    trabajos: {
        categories: ["Crochet", "Flores", "Personajes", "Llaveros"],
        tags: [
            ["crochet", "Crochet"],
            ["flores", "Flores"],
            ["personajes", "Personajes"],
            ["llaveros", "Llaveros"],
        ],
    },
    clientes: {
        categories: ["Clientes"],
        tags: [["clientes", "Clientes"]],
    },
};

const sectionLabels = {
    stock: {
        eyebrow: "Stock",
        title: "Productos disponibles",
        text: "Edita lo que aparece en Stock. Arrastra las tarjetas para cambiar el orden.",
        add: "Agregar stock",
    },
    catalogo: {
        eyebrow: "Catalogo",
        title: "Catalogo editable",
        text: "Edita productos del catalogo, precios, filtros y fotos desde esta seccion.",
        add: "Agregar catalogo",
    },
    trabajos: {
        eyebrow: "Trabajos",
        title: "Trabajos realizados",
        text: "Agrega, edita, elimina y ordena las fotos que aparecen en Trabajos.",
        add: "Agregar trabajo",
    },
    clientes: {
        eyebrow: "Clientes",
        title: "Entregas y clientes",
        text: "Administra las fotos de entregas reales y clientes.",
        add: "Agregar cliente",
    },
};

function setStatus(element, message, isError = false) {
    element.textContent = message;
    element.style.color = isError ? "#9a2f2f" : "";
}

function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#039;",
    }[character]));
}

function slugify(value) {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 70) || "producto";
}

function moneyLabel(price) {
    if (price === null || price === undefined || price === "") return "Sin precio";
    const value = Number(price);
    if (!Number.isFinite(value)) return "Sin precio";
    return `$${value % 1 === 0 ? value.toFixed(0) : value.toFixed(2)}`;
}

function displayPrice(product) {
    return product.price_label || moneyLabel(product.price);
}

function normalizeImageList(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) return parsed.filter(Boolean);
        } catch {
            return value.split(",").map((item) => item.trim()).filter(Boolean);
        }
    }
    return [];
}

function productImageList(product) {
    const images = [
        product?.image_url,
        ...normalizeImageList(product?.gallery_urls),
    ].filter(Boolean);

    return Array.from(new Set(images));
}

function galleryColumnMessage() {
    return "Falta crear la columna gallery_urls en Supabase. Ejecuta: alter table public.products add column if not exists gallery_urls text[] default '{}';";
}

function isMissingGalleryColumn(error) {
    return String(error?.message || "").includes("gallery_urls");
}

function priceNumberFromLabel(value) {
    const match = String(value || "").replace(",", ".").match(/\d+(?:\.\d+)?/);
    return match ? Number(match[0]) : null;
}

function parseTags(value) {
    return value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
}

function selectedTags() {
    return Array.from(tagOptions.querySelectorAll("input:checked")).map((input) => input.value);
}

function syncTagsInput() {
    productTags.value = selectedTags().join(", ");
}

function categoryOptionsFor(section) {
    return sectionSettings[section]?.categories || sectionSettings.stock.categories;
}

function tagOptionsFor(section, selected = []) {
    const baseOptions = sectionSettings[section]?.tags || sectionSettings.stock.tags;
    const values = new Set(baseOptions.map(([value]) => value));
    const customOptions = selected
        .filter((tag) => tag && !values.has(tag))
        .map((tag) => [tag, tag]);

    return [...baseOptions, ...customOptions];
}

function renderCategoryOptions(selectedCategory = "") {
    const section = productSection.value || "stock";
    const categories = categoryOptionsFor(section);
    const value = selectedCategory || categories[0] || "";
    const options = categories.includes(value) ? categories : [value, ...categories];

    productCategory.innerHTML = options
        .filter(Boolean)
        .map((category) => `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`)
        .join("");
    productCategory.value = value;
}

function renderTagOptions(selected = []) {
    const section = productSection.value || "stock";
    const options = tagOptionsFor(section, selected);

    tagOptions.innerHTML = options.map(([value, label]) => `
      <label class="tag-option">
        <input type="checkbox" value="${escapeHTML(value)}" ${selected.includes(value) ? "checked" : ""}>
        <span>${escapeHTML(label)}</span>
      </label>
    `).join("");

    tagOptions.querySelectorAll("input").forEach((input) => {
        input.addEventListener("change", syncTagsInput);
    });
    syncTagsInput();
}

function updateFormChoices(selectedCategory = "", selected = []) {
    renderCategoryOptions(selectedCategory);
    renderTagOptions(selected);
}

function currentSection() {
    return listSectionFilter.value || "stock";
}

function updateSectionHeader() {
    const section = currentSection();
    const copy = sectionLabels[section] || sectionLabels.stock;

    activeSectionEyebrow.textContent = copy.eyebrow;
    activeSectionTitle.textContent = copy.title;
    activeSectionText.textContent = copy.text;
    openCreateButton.textContent = copy.add;

    sectionTabButtons.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.sectionTab === section);
    });
}

function openProductForm(product = null) {
    const section = product?.section || currentSection();

    productForm.classList.remove("is-hidden");
    productSection.value = section;

    if (!product) {
        productId.value = "";
        currentImageUrl.value = "";
        currentGalleryUrls = [];
        selectedGalleryFiles = [];
        productName.value = "";
        productDescription.value = "";
        productPrice.value = "";
        productPriceLabel.value = "";
        productAvailable.checked = true;
        updateFormChoices();
        formTitle.textContent = sectionLabels[section]?.add || "Agregar contenido";
        showPreview("");
        showGalleryPreview();
    } else {
        productId.value = product.id;
        currentImageUrl.value = product.image_url || "";
        currentGalleryUrls = normalizeImageList(product.gallery_urls);
        selectedGalleryFiles = [];
        productName.value = product.name || "";
        productDescription.value = product.description || "";
        productPrice.value = product.price ?? "";
        productPriceLabel.value = product.price_label || "";
        updateFormChoices(product.category || "", Array.isArray(product.tags) ? product.tags : []);
        productAvailable.checked = Boolean(product.available);
        formTitle.textContent = "Editar contenido";
        showPreview(product.image_url || "");
        showGalleryPreview();
    }

    saveButton.textContent = "Guardar cambios";
    setStatus(productStatus, "");
    productForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

function selectEditorSection(section) {
    listSectionFilter.value = section;
    listCategoryFilter.value = "all";
    listSearch.value = "";
    resetForm();
    updateSectionHeader();
    renderProducts();
}

function sectionLabel(section) {
    return {
        stock: "Stock",
        catalogo: "Catálogo",
        trabajos: "Trabajos",
        clientes: "Clientes",
    }[section] || "Stock";
}

function showPreview(url) {
    imagePreview.innerHTML = url ? `<img src="${url}" alt="Vista previa">` : "Sin foto";
}

function syncGalleryFileInput() {
    if (!window.DataTransfer || !productGalleryImages) return;

    const dataTransfer = new DataTransfer();
    selectedGalleryFiles.forEach((file) => dataTransfer.items.add(file));
    productGalleryImages.files = dataTransfer.files;
}

function showGalleryPreview() {
    const existingThumbs = currentGalleryUrls.map((url, index) => `
      <div class="gallery-thumb">
        <img src="${escapeHTML(url)}" alt="Foto adicional ${index + 1}">
        <button type="button" data-remove-gallery-url="${index}">Quitar</button>
      </div>
    `);
    const newThumbs = selectedGalleryFiles.map((file, index) => `
      <div class="gallery-thumb">
        <img src="${escapeHTML(URL.createObjectURL(file))}" alt="Foto nueva ${index + 1}">
        <button type="button" data-remove-gallery-file="${index}">Quitar</button>
      </div>
    `);

    galleryPreview.innerHTML = [...existingThumbs, ...newThumbs].join("") ||
        "<p>No hay fotos adicionales.</p>";

    galleryPreview.querySelectorAll("[data-remove-gallery-url]").forEach((button) => {
        button.addEventListener("click", () => {
            currentGalleryUrls.splice(Number(button.dataset.removeGalleryUrl), 1);
            showGalleryPreview();
        });
    });

    galleryPreview.querySelectorAll("[data-remove-gallery-file]").forEach((button) => {
        button.addEventListener("click", () => {
            selectedGalleryFiles.splice(Number(button.dataset.removeGalleryFile), 1);
            syncGalleryFileInput();
            showGalleryPreview();
        });
    });
}

function resetForm() {
    productForm.reset();
    productId.value = "";
    currentImageUrl.value = "";
    currentGalleryUrls = [];
    selectedGalleryFiles = [];
    productSection.value = currentSection();
    productPriceLabel.value = "";
    updateFormChoices();
    productAvailable.checked = true;
    formTitle.textContent = "Agregar contenido";
    saveButton.textContent = "Guardar cambios";
    showPreview("");
    showGalleryPreview();
    setStatus(productStatus, "");
    productForm.classList.add("is-hidden");
}

async function uploadImage(file, name, section = "stock") {
    if (!file) return currentImageUrl.value || "";

    const extension = file.name.split(".").pop().toLowerCase() || "jpg";
    const folder = slugify(section || "stock");
    const path = `${folder}/${Date.now()}-${slugify(name)}.${extension}`;
    const { error } = await client.storage
        .from(config.stockBucket)
        .upload(path, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type || undefined,
        });

    if (error) throw error;

    const { data } = client.storage.from(config.stockBucket).getPublicUrl(path);
    return data.publicUrl;
}

async function uploadGalleryImages(files, name, section = "stock") {
    const uploads = [];

    for (const [index, file] of files.entries()) {
        const extension = file.name.split(".").pop().toLowerCase() || "jpg";
        const folder = slugify(section || "stock");
        const path = `${folder}/${Date.now()}-${index + 1}-${slugify(name)}.${extension}`;
        const { error } = await client.storage
            .from(config.stockBucket)
            .upload(path, file, {
                cacheControl: "3600",
                upsert: false,
                contentType: file.type || undefined,
            });

        if (error) throw error;

        const { data } = client.storage.from(config.stockBucket).getPublicUrl(path);
        uploads.push(data.publicUrl);
    }

    return uploads;
}

async function uploadSeedImage(sourcePath, name, folder = "inicial") {
    const response = await fetch(sourcePath);
    if (!response.ok) throw new Error(`No se pudo leer ${sourcePath}`);
    const blob = await response.blob();
    const extension = sourcePath.split(".").pop().toLowerCase() || "webp";
    const path = `${folder}/${slugify(name)}.${extension}`;
    const { error } = await client.storage
        .from(config.stockBucket)
        .upload(path, blob, {
            cacheControl: "3600",
            upsert: true,
            contentType: blob.type || "image/webp",
        });

    if (error) throw error;

    const { data } = client.storage.from(config.stockBucket).getPublicUrl(path);
    return data.publicUrl;
}

function extractScriptArray(source, variableName) {
    const marker = `const ${variableName} =`;
    const markerIndex = source.indexOf(marker);
    if (markerIndex < 0) throw new Error(`No se encontro ${variableName} en script.js`);

    const start = source.indexOf("[", markerIndex);
    let depth = 0;
    let quote = "";
    let escaped = false;

    for (let index = start; index < source.length; index += 1) {
        const character = source[index];

        if (quote) {
            if (escaped) {
                escaped = false;
            } else if (character === "\\") {
                escaped = true;
            } else if (character === quote) {
                quote = "";
            }
            continue;
        }

        if (character === "\"" || character === "'" || character === "`") {
            quote = character;
            continue;
        }

        if (character === "[") depth += 1;
        if (character === "]") {
            depth -= 1;
            if (depth === 0) {
                const literal = source.slice(start, index + 1);
                return Function(`"use strict"; return (${literal});`)();
            }
        }
    }

    throw new Error(`No se pudo leer ${variableName}`);
}

async function readCurrentSiteData() {
    const response = await fetch(`script.js?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error("No se pudo leer el catalogo actual de la web.");
    const source = await response.text();

    return {
        catalog: extractScriptArray(source, "catalogItems"),
        gallery: extractScriptArray(source, "galleryItems"),
        clients: extractScriptArray(source, "deliveryItems"),
    };
}

function catalogCategory(tags = []) {
    if (tags.includes("corte-grabado")) return "Grabado";
    if (tags.includes("flores-crochet")) return "Flores";
    if (tags.includes("amigurumis")) return "Amigurumi";
    if (tags.includes("accesorios-crochet")) return "Accesorios";
    if (tags.includes("tejidos-crochet")) return "Crochet";
    return "Catalogo";
}

function readableSeedName(fileName) {
    const baseName = fileName.replace(/\.[^.]+$/, "").toLowerCase();
    if (baseName.startsWith("porta")) return "Portalapicero";

    return fileName
        .replace(/\.[^.]+$/, "")
        .replace(/-/g, " ")
        .replace(/\d+$/g, "")
        .trim()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function gallerySeedCategory(fileName) {
    const name = fileName.toLowerCase();
    const flowerWords = ["flor", "girasol", "ramo", "tulipanes", "fresa", "maceta"];
    const characterWords = ["goku", "luffy", "zoro", "coraline", "messi", "kurt", "joji", "kaneki", "karl", "billie", "ponyo", "skye", "eevee"];
    const keychainWords = ["llavero", "abejita", "pulpo", "calamar"];

    if (flowerWords.some((word) => name.includes(word))) return "flores";
    if (characterWords.some((word) => name.includes(word))) return "personajes";
    if (keychainWords.some((word) => name.includes(word))) return "llaveros";
    return "crochet";
}

function galleryCategoryLabel(category) {
    return {
        flores: "Flores",
        personajes: "Personajes",
        llaveros: "Llaveros",
        crochet: "Crochet",
    }[category] || "Trabajos";
}

function stockSeedRows() {
    return initialStockProducts.map(([name, description, category, price, sourcePath], index) => ({
        name,
        description,
        price,
        price_label: null,
        category,
        section: "stock",
        tags: [category],
        sort_order: index + 1,
        available: true,
        sourcePath,
    }));
}

function catalogSeedRows(items) {
    return items.map((item, index) => ({
        name: item.name,
        description: item.detail,
        price: priceNumberFromLabel(item.price),
        price_label: item.price,
        category: catalogCategory(item.tags || []),
        section: "catalogo",
        tags: item.tags || [],
        sort_order: index + 1,
        available: true,
        sourcePath: item.image,
    }));
}

function gallerySeedRows(items) {
    return items.map((fileName, index) => {
        const category = gallerySeedCategory(fileName);
        return {
            name: `Trabajo ${String(index + 1).padStart(2, "0")} - ${readableSeedName(fileName)}`,
            description: "Trabajo realizado por Gissel.line.",
            price: null,
            price_label: null,
            category: galleryCategoryLabel(category),
            section: "trabajos",
            tags: [category],
            sort_order: index + 1,
            available: true,
            sourcePath: `assets/web/gallery/${fileName}`,
        };
    });
}

function clientSeedRows(items) {
    return items.map((fileName, index) => ({
        name: `Entrega cliente ${String(index + 1).padStart(2, "0")}`,
        description: "Entrega real de cliente.",
        price: null,
        price_label: null,
        category: "Clientes",
        section: "clientes",
        tags: ["clientes"],
        sort_order: index + 1,
        available: true,
        sourcePath: `assets/web/clients/${fileName}`,
    }));
}

function contentKey(item) {
    return `${item.section || "stock"}::${item.name}`;
}

async function insertRowsInChunks(rows) {
    for (let index = 0; index < rows.length; index += 35) {
        const chunk = rows.slice(index, index + 35);
        const { error } = await client.from("products").insert(chunk);
        if (error) throw error;
    }
}

async function importCurrentSiteContent() {
    if (!confirm("Esto subira a Supabase el stock, catalogo, trabajos y clientes actuales de la web. No duplica lo que ya exista con el mismo nombre y seccion. Continuar?")) return;

    setStatus(productStatus, "Leyendo contenido actual...");
    seedButton.disabled = true;

    try {
        const siteData = await readCurrentSiteData();
        const seedRows = [
            ...stockSeedRows(),
            ...catalogSeedRows(siteData.catalog),
            ...gallerySeedRows(siteData.gallery),
            ...clientSeedRows(siteData.clients),
        ];

        const { data: existing, error: existingError } = await client
            .from("products")
            .select("id, name, description, price, price_label, category, section, tags, sort_order, available, image_url");
        if (existingError) {
            if (String(existingError.message).includes("price_label")) {
                throw new Error("Falta crear la columna price_label en Supabase. Ejecuta el SQL que te paso y vuelve a intentar.");
            }
            throw existingError;
        }

        const existingByKey = new Map((existing || []).map((product) => [contentKey(product), product]));
        const rows = [];
        let completed = 0;

        for (const [index, item] of seedRows.entries()) {
            const existingProduct = existingByKey.get(contentKey(item));

            setStatus(productStatus, `Importando ${index + 1}/${seedRows.length}: ${item.name}`);

            if (existingProduct) {
                const patch = {};
                if (!existingProduct.description) patch.description = item.description;
                if (!existingProduct.category) patch.category = item.category;
                if (!existingProduct.section) patch.section = item.section;
                if (!Array.isArray(existingProduct.tags) || !existingProduct.tags.length) patch.tags = item.tags;
                if (existingProduct.price === null || existingProduct.price === undefined) patch.price = item.price;
                if (!existingProduct.price_label && item.price_label) patch.price_label = item.price_label;
                if (existingProduct.sort_order === null || existingProduct.sort_order === undefined) patch.sort_order = item.sort_order;
                if (existingProduct.available === null || existingProduct.available === undefined) patch.available = true;
                if (!existingProduct.image_url) patch.image_url = await uploadSeedImage(item.sourcePath, item.name, item.section);

                if (Object.keys(patch).length) {
                    const { error } = await client.from("products").update(patch).eq("id", existingProduct.id);
                    if (error) throw error;
                    completed += 1;
                }
                continue;
            }

            const imageUrl = await uploadSeedImage(item.sourcePath, item.name, item.section);
            const { sourcePath, ...row } = item;
            rows.push({
                ...row,
                image_url: imageUrl,
            });
        }

        if (rows.length) await insertRowsInChunks(rows);

        const summary = [
            rows.length ? `${rows.length} contenidos importados` : "",
            completed ? `${completed} contenidos completados` : "",
        ].filter(Boolean).join(" y ");
        setStatus(productStatus, summary ? `Listo: ${summary}.` : "No habia contenido nuevo ni datos vacios para completar.");
        await loadProducts();
    } catch (error) {
        setStatus(productStatus, `No se pudo importar: ${error.message}`, true);
    } finally {
        seedButton.disabled = false;
    }
}

async function loadSession() {
    const { data } = await client.auth.getSession();
    const user = data.session?.user || null;

    if (!user) {
        authPanel.classList.remove("is-hidden");
        dashboard.classList.add("is-hidden");
        return;
    }

    if (user.email !== config.adminEmail) {
        await client.auth.signOut();
        authPanel.classList.remove("is-hidden");
        dashboard.classList.add("is-hidden");
        setStatus(loginStatus, "Este correo no tiene acceso al panel.", true);
        return;
    }

    sessionEmail.textContent = user.email;
    authPanel.classList.add("is-hidden");
    dashboard.classList.remove("is-hidden");
    await checkGalleryColumn();
    await loadProducts();
}

async function checkGalleryColumn() {
    const { error } = await client
        .from("products")
        .select("gallery_urls")
        .limit(1);

    galleryColumnAvailable = !error;
    if (error && isMissingGalleryColumn(error)) {
        setStatus(productStatus, galleryColumnMessage(), true);
    }
}

function syncListCategoryOptions() {
    const section = listSectionFilter.value;
    const currentValue = listCategoryFilter.value || "all";
    const categories = Array.from(new Set(allProducts
        .filter((product) => section === "all" || product.section === section)
        .map((product) => product.category)
        .filter(Boolean)))
        .sort((a, b) => a.localeCompare(b));

    listCategoryFilter.innerHTML = [
        `<option value="all">Todas</option>`,
        ...categories.map((category) => `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`),
    ].join("");
    listCategoryFilter.value = categories.includes(currentValue) ? currentValue : "all";
}

function filteredProducts() {
    const section = listSectionFilter.value;
    const category = listCategoryFilter.value;
    const search = listSearch.value.trim().toLowerCase();

    return allProducts.filter((product) => {
        if (section !== "all" && product.section !== section) return false;
        if (category !== "all" && product.category !== category) return false;
        if (!search) return true;

        return [
            product.name,
            product.description,
            product.category,
            sectionLabel(product.section),
        ].some((value) => String(value || "").toLowerCase().includes(search));
    });
}

function canDragCurrentList() {
    return listSectionFilter.value !== "all" &&
        listCategoryFilter.value === "all" &&
        !listSearch.value.trim();
}

function orderedSectionProducts(section) {
    return allProducts.filter((product) => (product.section || "stock") === (section || "stock"));
}

async function updateSortOrders(products) {
    const updates = products.map((product, index) => client
        .from("products")
        .update({ sort_order: (index + 1) * 10 })
        .eq("id", product.id));

    const results = await Promise.all(updates);
    const failed = results.find((result) => result.error);
    if (failed) throw failed.error;
}

async function reorderProductByDrop(sourceId, targetId) {
    if (!sourceId || !targetId || sourceId === targetId) return;

    const sectionProducts = orderedSectionProducts(listSectionFilter.value);
    const sourceIndex = sectionProducts.findIndex((item) => item.id === sourceId);
    const targetIndex = sectionProducts.findIndex((item) => item.id === targetId);

    if (sourceIndex < 0 || targetIndex < 0) return;

    const reordered = [...sectionProducts];
    const [movedProduct] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, movedProduct);

    setStatus(productStatus, "Actualizando orden...");
    try {
        await updateSortOrders(reordered);
        setStatus(productStatus, "Orden actualizado.");
        await loadProducts();
    } catch (error) {
        setStatus(productStatus, `No se pudo ordenar: ${error.message}`, true);
    }
}

function clearDragState() {
    draggedProductId = "";
    pointerDropTargetId = "";
    productsList.querySelectorAll(".product-row").forEach((row) => {
        row.classList.remove("is-dragging", "drag-over");
    });
}

function highlightDropTarget(targetRow) {
    productsList.querySelectorAll(".product-row").forEach((row) => {
        row.classList.toggle("drag-over", targetRow && row === targetRow);
    });
}

function renderProducts() {
    syncListCategoryOptions();
    updateSectionHeader();
    const dragEnabled = canDragCurrentList();
    const addCard = `
      <button class="add-product-card" type="button" id="inlineAddProduct">
        <span>+</span>
        <strong>${escapeHTML(sectionLabels[currentSection()]?.add || "Agregar")}</strong>
      </button>
    `;

    if (!allProducts.length) {
        productsList.innerHTML = `${addCard}<p class="empty-state">Aun no hay contenido guardado en esta base de datos.</p>`;
        productsList.querySelector("#inlineAddProduct")?.addEventListener("click", () => openProductForm());
        return;
    }

    const data = filteredProducts();
    if (!data.length) {
        productsList.innerHTML = `${addCard}<p class="empty-state">No hay contenido con esos filtros.</p>`;
        productsList.querySelector("#inlineAddProduct")?.addEventListener("click", () => openProductForm());
        return;
    }

    productsList.innerHTML = addCard + data.map((product) => {
        const images = productImageList(product);
        const image = escapeHTML(images[0] || "assets/web/stock/01-ballena-morada.webp");
        const name = escapeHTML(product.name || "Sin nombre");
        const description = escapeHTML(product.description || "");
        const category = escapeHTML(product.category || "Sin categoria");
        const section = escapeHTML(sectionLabel(product.section));
        const price = escapeHTML(displayPrice(product));
        const status = product.available ? "Visible" : "Oculto";
        const photoCount = images.length > 1 ? `<span class="product-photo-count">${images.length} fotos</span>` : "";

        return `
      <article class="product-row ${dragEnabled ? "is-draggable" : ""}" data-id="${escapeHTML(product.id)}" draggable="${dragEnabled ? "true" : "false"}">
        <span class="drag-handle" title="Arrastrar para ordenar">::</span>
        <img src="${image}" alt="${name}">
        ${photoCount}
        <div>
          <h3>${name}</h3>
          <p><strong>${section}</strong> / ${price} / ${category}</p>
          <p>${status} / ${description}</p>
        </div>
        <div class="row-actions">
          <button class="btn ghost" type="button" data-edit="${escapeHTML(product.id)}">Editar</button>
          <button class="btn ghost" type="button" data-delete="${escapeHTML(product.id)}">Borrar</button>
        </div>
      </article>
    `;
    }).join("");

    productsList.querySelector("#inlineAddProduct")?.addEventListener("click", () => openProductForm());

    productsList.querySelectorAll("[data-edit]").forEach((button) => {
        button.addEventListener("click", () => {
            const product = allProducts.find((item) => item.id === button.dataset.edit);
            if (!product) return;
            openProductForm(product);
        });
    });

    if (dragEnabled) {
        productsList.querySelectorAll(".product-row").forEach((row) => {
            const handle = row.querySelector(".drag-handle");

            row.addEventListener("dragstart", (event) => {
                draggedProductId = row.dataset.id;
                row.classList.add("is-dragging");
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", draggedProductId);
            });

            row.addEventListener("dragover", (event) => {
                event.preventDefault();
                if (row.dataset.id !== draggedProductId) row.classList.add("drag-over");
            });

            row.addEventListener("dragleave", () => {
                row.classList.remove("drag-over");
            });

            row.addEventListener("drop", async (event) => {
                event.preventDefault();
                const sourceId = event.dataTransfer.getData("text/plain") || draggedProductId;
                const targetId = row.dataset.id;
                clearDragState();
                await reorderProductByDrop(sourceId, targetId);
            });

            row.addEventListener("dragend", clearDragState);

            handle.addEventListener("pointerdown", (event) => {
                draggedProductId = row.dataset.id;
                pointerDropTargetId = "";
                row.classList.add("is-dragging");
                handle.setPointerCapture?.(event.pointerId);
                event.preventDefault();
            });

            handle.addEventListener("pointermove", (event) => {
                if (!draggedProductId) return;

                const targetRow = document
                    .elementFromPoint(event.clientX, event.clientY)
                    ?.closest(".product-row");

                if (targetRow && targetRow.dataset.id !== draggedProductId) {
                    pointerDropTargetId = targetRow.dataset.id;
                    highlightDropTarget(targetRow);
                    return;
                }

                pointerDropTargetId = "";
                highlightDropTarget(null);
            });

            handle.addEventListener("pointerup", async () => {
                if (!draggedProductId) return;
                const sourceId = draggedProductId;
                const targetId = pointerDropTargetId;
                clearDragState();
                if (targetId) await reorderProductByDrop(sourceId, targetId);
            });

            handle.addEventListener("pointercancel", clearDragState);
        });
    }

    productsList.querySelectorAll("[data-delete]").forEach((button) => {
        button.addEventListener("click", async () => {
            if (!confirm("Borrar este contenido?")) return;
            const { error } = await client.from("products").delete().eq("id", button.dataset.delete);
            if (error) {
                alert(`No se pudo borrar: ${error.message}`);
                return;
            }
            await loadProducts();
        });
    });
}

async function loadProducts() {
    productsList.innerHTML = "<p>Cargando productos...</p>";
    const { data, error } = await client
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

    if (error) {
        productsList.innerHTML = `<p>No se pudo cargar el contenido: ${error.message}</p>`;
        return;
    }

    allProducts = data || [];
    renderProducts();
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus(loginStatus, "Entrando...");

    const { error } = await client.auth.signInWithPassword({
        email: loginEmail.value.trim(),
        password: loginPassword.value,
    });

    if (error) {
        setStatus(loginStatus, `No se pudo iniciar sesión: ${error.message}`, true);
        return;
    }

    loginForm.reset();
    setStatus(loginStatus, "");
    await loadSession();
});

logoutButton.addEventListener("click", async () => {
    await client.auth.signOut();
    resetForm();
    await loadSession();
});

productImage.addEventListener("change", () => {
    const file = productImage.files[0];
    if (!file) {
        showPreview(currentImageUrl.value);
        return;
    }
    showPreview(URL.createObjectURL(file));
});

productGalleryImages.addEventListener("change", () => {
    selectedGalleryFiles = Array.from(productGalleryImages.files || []);
    showGalleryPreview();
});

productForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus(productStatus, "Guardando contenido...");

    try {
        if (!galleryColumnAvailable && (currentGalleryUrls.length || selectedGalleryFiles.length)) {
            await checkGalleryColumn();
        }

        if (!galleryColumnAvailable && (currentGalleryUrls.length || selectedGalleryFiles.length)) {
            throw new Error(galleryColumnMessage());
        }

        const imageUrl = await uploadImage(productImage.files[0], productName.value, productSection.value);
        const uploadedGalleryUrls = galleryColumnAvailable ?
            await uploadGalleryImages(selectedGalleryFiles, productName.value, productSection.value) :
            [];
        const galleryUrls = Array.from(new Set([...currentGalleryUrls, ...uploadedGalleryUrls]));
        const payload = {
            name: productName.value.trim(),
            description: productDescription.value.trim() || null,
            price: productPrice.value === "" ? null : Number(productPrice.value),
            price_label: productPriceLabel.value.trim() || null,
            category: productCategory.value.trim() || null,
            section: productSection.value,
            tags: selectedTags(),
            sort_order: productId.value ?
                allProducts.find((product) => product.id === productId.value)?.sort_order || 0 :
                orderedSectionProducts(productSection.value).length * 10 + 10,
            available: productAvailable.checked,
            image_url: imageUrl || null,
        };

        if (galleryColumnAvailable) {
            payload.gallery_urls = galleryUrls;
        }

        const id = productId.value;
        const query = id ?
            client.from("products").update(payload).eq("id", id) :
            client.from("products").insert(payload);

        const { error } = await query;
        if (error) throw error;

        setStatus(productStatus, "Cambios guardados.");
        resetForm();
        await loadProducts();
    } catch (error) {
        if (isMissingGalleryColumn(error)) {
            galleryColumnAvailable = false;
            setStatus(productStatus, galleryColumnMessage(), true);
            return;
        }
        setStatus(productStatus, `No se pudo guardar: ${error.message}`, true);
    }
});

resetFormButton.addEventListener("click", resetForm);
refreshButton.addEventListener("click", loadProducts);
seedButton.addEventListener("click", importCurrentSiteContent);
productSection.addEventListener("change", () => updateFormChoices());
openCreateButton.addEventListener("click", () => openProductForm());
sectionTabButtons.forEach((button) => {
    button.addEventListener("click", () => selectEditorSection(button.dataset.sectionTab));
});
listSectionFilter.addEventListener("change", () => {
    listCategoryFilter.value = "all";
    resetForm();
    renderProducts();
});
listCategoryFilter.addEventListener("change", renderProducts);
listSearch.addEventListener("input", renderProducts);
listSectionFilter.value = "stock";
updateFormChoices();
updateSectionHeader();
loadSession();
