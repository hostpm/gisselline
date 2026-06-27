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
