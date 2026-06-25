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
const productOrder = document.querySelector("#productOrder");
const productImage = document.querySelector("#productImage");
const productAvailable = document.querySelector("#productAvailable");
const productStatus = document.querySelector("#productStatus");
const productsList = document.querySelector("#productsList");
const imagePreview = document.querySelector("#imagePreview");
const resetFormButton = document.querySelector("#resetFormButton");
const refreshButton = document.querySelector("#refreshButton");
const seedButton = document.querySelector("#seedButton");
const formTitle = document.querySelector("#formTitle");
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

function setStatus(element, message, isError = false) {
    element.textContent = message;
    element.style.color = isError ? "#9a2f2f" : "";
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

function resetForm() {
    productForm.reset();
    productId.value = "";
    currentImageUrl.value = "";
    productSection.value = "stock";
    productPriceLabel.value = "";
    productTags.value = "";
    productOrder.value = "0";
    productAvailable.checked = true;
    formTitle.textContent = "Agregar contenido";
    showPreview("");
    setStatus(productStatus, "");
}

async function uploadImage(file, name) {
    if (!file) return currentImageUrl.value || "";

    const extension = file.name.split(".").pop().toLowerCase() || "jpg";
    const path = `${Date.now()}-${slugify(name)}.${extension}`;
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
    await loadProducts();
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

    if (!data.length) {
        productsList.innerHTML = "<p>Aun no hay contenido guardado en la base de datos.</p>";
        return;
    }

    productsList.innerHTML = data.map((product) => `
      <article class="product-row" data-id="${product.id}">
        <img src="${product.image_url || "assets/web/stock/01-ballena-morada.webp"}" alt="${product.name}">
        <div>
          <h3>${product.name}</h3>
          <p>${sectionLabel(product.section)} / ${displayPrice(product)} / ${product.category || "Sin categoria"} / Orden ${product.sort_order || 0}</p>
          <p>${product.available ? "Visible" : "Oculto"} / ${product.description || ""}</p>
        </div>
        <div class="row-actions">
          <button class="btn ghost" type="button" data-edit="${product.id}">Editar</button>
          <button class="btn ghost" type="button" data-delete="${product.id}">Borrar</button>
        </div>
      </article>
    `).join("");

    productsList.querySelectorAll("[data-edit]").forEach((button) => {
        button.addEventListener("click", () => {
            const product = data.find((item) => item.id === button.dataset.edit);
            if (!product) return;
            productId.value = product.id;
            currentImageUrl.value = product.image_url || "";
            productSection.value = product.section || "stock";
            productName.value = product.name || "";
            productDescription.value = product.description || "";
            productPrice.value = product.price ?? "";
            productPriceLabel.value = product.price_label || "";
            productCategory.value = product.category || "";
            productTags.value = Array.isArray(product.tags) ? product.tags.join(", ") : "";
            productOrder.value = product.sort_order ?? 0;
            productAvailable.checked = Boolean(product.available);
            formTitle.textContent = "Editar contenido";
            showPreview(product.image_url || "");
            productForm.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

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

productForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus(productStatus, "Guardando contenido...");

    try {
        const imageUrl = await uploadImage(productImage.files[0], productName.value);
        const payload = {
            name: productName.value.trim(),
            description: productDescription.value.trim() || null,
            price: productPrice.value === "" ? null : Number(productPrice.value),
            price_label: productPriceLabel.value.trim() || null,
            category: productCategory.value.trim() || null,
            section: productSection.value,
            tags: parseTags(productTags.value),
            sort_order: Number(productOrder.value || 0),
            available: productAvailable.checked,
            image_url: imageUrl || null,
        };

        const id = productId.value;
        const query = id ?
            client.from("products").update(payload).eq("id", id) :
            client.from("products").insert(payload);

        const { error } = await query;
        if (error) throw error;

        setStatus(productStatus, "Contenido guardado.");
        resetForm();
        await loadProducts();
    } catch (error) {
        setStatus(productStatus, `No se pudo guardar: ${error.message}`, true);
    }
});

resetFormButton.addEventListener("click", resetForm);
refreshButton.addEventListener("click", loadProducts);
seedButton.addEventListener("click", importCurrentSiteContent);
loadSession();
