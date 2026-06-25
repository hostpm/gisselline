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
const productName = document.querySelector("#productName");
const productDescription = document.querySelector("#productDescription");
const productPrice = document.querySelector("#productPrice");
const productCategory = document.querySelector("#productCategory");
const productOrder = document.querySelector("#productOrder");
const productImage = document.querySelector("#productImage");
const productAvailable = document.querySelector("#productAvailable");
const productStatus = document.querySelector("#productStatus");
const productsList = document.querySelector("#productsList");
const imagePreview = document.querySelector("#imagePreview");
const resetFormButton = document.querySelector("#resetFormButton");
const refreshButton = document.querySelector("#refreshButton");
const formTitle = document.querySelector("#formTitle");

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

function showPreview(url) {
    imagePreview.innerHTML = url ? `<img src="${url}" alt="Vista previa">` : "Sin foto";
}

function resetForm() {
    productForm.reset();
    productId.value = "";
    currentImageUrl.value = "";
    productOrder.value = "0";
    productAvailable.checked = true;
    formTitle.textContent = "Agregar producto";
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
        productsList.innerHTML = `<p>No se pudo cargar el stock: ${error.message}</p>`;
        return;
    }

    if (!data.length) {
        productsList.innerHTML = "<p>Aún no hay productos guardados en la base de datos.</p>";
        return;
    }

    productsList.innerHTML = data.map((product) => `
      <article class="product-row" data-id="${product.id}">
        <img src="${product.image_url || "assets/web/stock/01-ballena-morada.webp"}" alt="${product.name}">
        <div>
          <h3>${product.name}</h3>
          <p>${moneyLabel(product.price)} · ${product.category || "Sin categoría"} · Orden ${product.sort_order || 0}</p>
          <p>${product.available ? "Visible" : "Oculto"} · ${product.description || ""}</p>
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
            productName.value = product.name || "";
            productDescription.value = product.description || "";
            productPrice.value = product.price ?? "";
            productCategory.value = product.category || "";
            productOrder.value = product.sort_order ?? 0;
            productAvailable.checked = Boolean(product.available);
            formTitle.textContent = "Editar producto";
            showPreview(product.image_url || "");
            productForm.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    productsList.querySelectorAll("[data-delete]").forEach((button) => {
        button.addEventListener("click", async () => {
            if (!confirm("¿Borrar este producto del stock?")) return;
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
    setStatus(productStatus, "Guardando producto...");

    try {
        const imageUrl = await uploadImage(productImage.files[0], productName.value);
        const payload = {
            name: productName.value.trim(),
            description: productDescription.value.trim() || null,
            price: productPrice.value === "" ? null : Number(productPrice.value),
            category: productCategory.value.trim() || null,
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

        setStatus(productStatus, "Producto guardado.");
        resetForm();
        await loadProducts();
    } catch (error) {
        setStatus(productStatus, `No se pudo guardar: ${error.message}`, true);
    }
});

resetFormButton.addEventListener("click", resetForm);
refreshButton.addEventListener("click", loadProducts);
loadSession();
