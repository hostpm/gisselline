const WHATSAPP_NUMBER = "5939891495950";

const menuToggle = document.querySelector("#menuToggle");
const mainMenu = document.querySelector("#mainMenu");
const navLinks = document.querySelectorAll(".nav-links a");
const viewLinks = document.querySelectorAll("[data-view-link]");
const views = document.querySelectorAll("[data-view]");
const whatsappLinks = document.querySelectorAll(".whatsapp-link");
const askButtons = document.querySelectorAll(".ask-product");
const quickForm = document.querySelector("#quickForm");
const carousel = document.querySelector("[data-carousel]");
const galleryGrid = document.querySelector("#galleryGrid");
const deliveryGrid = document.querySelector("#deliveryGrid");
const galleryFilterButtons = document.querySelectorAll("[data-gallery-filter]");
const workTabButtons = document.querySelectorAll("[data-work-tab]");
const workPanels = document.querySelectorAll("[data-work-panel]");
const catalogList = document.querySelector("#catalogList");
const catalogCount = document.querySelector("#catalogCount");
const catalogFilterButtons = document.querySelectorAll("[data-catalog-filter]");
const catalogFilterGroups = document.querySelectorAll("[data-catalog-filter-group]");
const catalogModal = document.querySelector("#catalogModal");
const catalogModalImage = document.querySelector("#catalogModalImage");
const catalogModalTitle = document.querySelector("#catalogModalTitle");
const catalogModalDetail = document.querySelector("#catalogModalDetail");
const catalogModalCloseButtons = document.querySelectorAll("[data-catalog-modal-close]");
const defaultView = "inicio";
let revealObserver;
const revealSelectors = [
    ".hero-copy",
    ".home-carousel",
    ".section-heading",
    ".catalog-sidebar",
    ".catalog-page",
    ".quote-panel",
    ".gallery-toolbar",
    ".gallery-mosaic article",
    ".mini-clients",
    ".delivery-mosaic > *",
    ".order-card",
    ".order-flow article",
    ".contact-hero > div",
    ".contact-form",
];
const catalogMainTags = ["corte-grabado", "tejidos-crochet"];
const catalogFilterLabels = {
    all: "Todos",
    "corte-grabado": "Gravix: corte y grabado",
    llaveros: "Llaveros",
    colgantes: "Colgantes",
    "mdf-acrilico": "MDF y acrÃ­lico",
    "placas-trofeos": "Placas y detalles",
    "tejidos-crochet": "Gissel.line: crochet",
    amigurumis: "Amigurumi",
    "flores-crochet": "Flores",
    "accesorios-crochet": "Accesorios",
};
const catalogItems = [{
        name: "Llavero Spotify",
        price: "$5",
        image: "assets/web/gravix-spotify.webp",
        tags: ["corte-grabado", "llaveros"],
        detail: "Foto, cancion y dedicatoria en formato llavero Spotify.",
    },
    {
        name: "Llavero Acrilico",
        price: "$2.50",
        image: "assets/web/41tJAtcjkpL._AC_US1000_.jpg",
        tags: ["corte-grabado", "llaveros", "mdf-acrilico"],
        detail: "Llavero acrilico transparente para foto, nombre o recuerdo personalizado.",
    },
    {
        name: "Separador de Libros",
        price: "$2.50",
        image: "assets/web/il_300x300.4177456800_mp09.jpg",
        tags: ["corte-grabado", "mdf-acrilico", "placas-trofeos"],
        detail: "Separador de libros personalizado en MDF o acrilico, ideal para regalo.",
    },
    {
        name: "Colgante Circular",
        price: "Desde $10",
        image: "assets/web/gravix-placa.webp",
        tags: ["corte-grabado", "colgantes"],
        detail: "Dije redondo para nombres, fechas, iniciales o simbolos.",
    },
    {
        name: "Collar Corazon Dorado",
        price: "$14",
        image: "assets/web/collar-corazon-dorado.jpg",
        tags: ["corte-grabado", "colgantes"],
        detail: "Dije dorado de corazon para fecha, iniciales o nombre corto.",
    },
    {
        name: "Collar Corazon Plateado",
        price: "$12",
        image: "assets/web/collar-corazon-plateado.jpg",
        tags: ["corte-grabado", "colgantes"],
        detail: "Dije plateado de corazon para fecha, iniciales o simbolo.",
    },
    {
        name: "Relicario Ovalado Dorado",
        price: "$15",
        image: "assets/web/relicario-ovalado-dorado.jpg",
        tags: ["corte-grabado", "colgantes"],
        detail: "Relicario dorado para foto interna y grabado exterior.",
    },
    {
        name: "Relicario Ovalado Plateado",
        price: "$12",
        image: "assets/web/relicario-ovalado-plateado.png",
        tags: ["corte-grabado", "colgantes"],
        detail: "Relicario plateado para foto interna, fecha o iniciales.",
    },
    {
        name: "Relicario Corazon Plateado",
        price: "$12",
        image: "assets/web/relicario-corazon-plateado.jpg",
        tags: ["corte-grabado", "colgantes"],
        detail: "Relicario plateado de corazon para foto y grabado breve.",
    },
    {
        name: "Relicario Corazon Dorado",
        price: "$14",
        image: "assets/web/relicario-corazon-dorado-foto.jpg",
        tags: ["corte-grabado", "colgantes"],
        detail: "Relicario dorado de corazon para foto y grabado breve.",
    },
    {
        name: "Collar Barra Dorado",
        price: "$18",
        image: "assets/web/collar-barra-dorado.jpg",
        tags: ["corte-grabado", "colgantes"],
        detail: "Collar dorado tipo barra para nombre, firma o frase corta.",
    },
    {
        name: "Collar Barra Plateado",
        price: "$14",
        image: "assets/web/collar-barra-plateado.jpg",
        tags: ["corte-grabado", "colgantes"],
        detail: "Collar plateado tipo barra para nombre, frase o fecha.",
    },
    {
        name: "Collar Corazon Negro con Ala",
        price: "$20",
        image: "assets/web/collar-corazon-negro-ala.png",
        tags: ["corte-grabado", "colgantes"],
        detail: "Collar dorado con corazon negro, ala y dije decorativo.",
    },
    {
        name: "Collar Doble Medalla Dorado",
        price: "$14",
        image: "assets/web/collar-infinito-dorado.avif",
        tags: ["corte-grabado", "colgantes"],
        detail: "Collar dorado doble con medalla para inicial o fecha.",
    },
    {
        name: "Collar Doble Medalla Plateado",
        price: "$12",
        image: "assets/web/collar-medalla-plateado.png",
        tags: ["corte-grabado", "colgantes"],
        detail: "Collar plateado doble con medalla para inicial o fecha.",
    },
    {
        name: "Colgante Rectangular",
        price: "Desde $14",
        image: "assets/web/placarectangular.png",
        tags: ["corte-grabado", "colgantes"],
        detail: "Placa rectangular para frases, fechas o mensajes especiales.",
    },
    {
        name: "Colgante Pulsera",
        price: "Desde $10",
        image: "assets/web/pulsera.jpg",
        tags: ["corte-grabado", "colgantes"],
        detail: "Pulsera de acero para nombre, fecha o frase corta.",
    },
    {
        name: "Collar Huesito",
        price: "Desde $6",
        image: "assets/web/elhueso.jpg",
        tags: ["corte-grabado", "colgantes"],
        detail: "Placa de mascota con nombre y dato de contacto.",
    },
    {
        name: "Llavero Rectangular",
        price: "Desde $14",
        image: "assets/web/llaveroacero.jpeg",
        tags: ["corte-grabado", "llaveros"],
        detail: "Llavero de acero con foto, texto, fecha o dedicatoria.",
    },
    {
        name: "Llavero MDF con Foto",
        price: "$8",
        image: "assets/web/llavero-foto-mdf.webp",
        tags: ["corte-grabado", "llaveros", "mdf-acrilico"],
        detail: "Llavero MDF con foto grabada a laser.",
    },
    {
        name: "Llaveros en Acrilico Negro",
        price: "Desde $2",
        image: "assets/web/llaveroacrilico.jpg",
        tags: ["corte-grabado", "llaveros", "mdf-acrilico"],
        detail: "Acrilico negro para nombres, logos o personajes.",
    },
    {
        name: "Llaveros en MDF",
        price: "Desde $1",
        image: "assets/web/llaveromdf.webp",
        tags: ["corte-grabado", "llaveros", "mdf-acrilico"],
        detail: "Llaveros MDF para nombres, figuras o recuerdos.",
    },
    {
        name: "Portarretrato en MDF",
        price: "Desde $5",
        image: "assets/web/gravix-mdf.webp",
        tags: ["corte-grabado", "mdf-acrilico"],
        detail: "Portarretrato MDF con foto o retrato grabado.",
    },
    {
        name: "Chancleta Dia de la Madre",
        price: "$8",
        image: "assets/web/Chancleta.png",
        tags: ["corte-grabado", "mdf-acrilico"],
        detail: "Detalle grabado para regalar con flores o dulces.",
    },
    {
        name: "Trofeos y Reconocimientos",
        price: "Desde $5",
        image: "assets/web/logotrofeo.jpeg",
        tags: ["corte-grabado", "placas-trofeos"],
        detail: "Trofeos y placas para premios, eventos o recuerdos.",
    },
    {
        name: "Puzzle",
        price: "Desde $5",
        image: "assets/web/puzzle.png",
        tags: ["corte-grabado", "mdf-acrilico"],
        detail: "Puzzle MDF personalizado para regalo o recuerdo.",
    },
    {
        name: "Grabado en Billetera",
        price: "Desde $15",
        image: "assets/web/billetera.jpg",
        tags: ["corte-grabado", "placas-trofeos"],
        detail: "Billetera grabada con iniciales, nombre o frase breve.",
    },
    {
        name: "Amigurumi Personalizado",
        price: "Desde $12",
        image: "assets/web/gallery/joji1.webp",
        tags: ["tejidos-crochet", "amigurumis"],
        detail: "Amigurumi tejido segun personaje o referencia.",
    },
    {
        name: "Amigurumi Caricatura",
        price: "Desde $12",
        image: "assets/web/amigurumi-caricatura-patricio.jpg",
        tags: ["tejidos-crochet", "amigurumis"],
        detail: "Personaje estilo caricatura tejido con vista frontal y posterior.",
    },
    {
        name: "Amigurumi Anime",
        price: "Desde $10",
        image: "assets/web/anime.jpg",
        tags: ["tejidos-crochet", "amigurumis"],
        detail: "Personaje de anime tejido a crochet segun referencia, con colores y detalles personalizados.",
    },
    {
        name: "Amigurumi Mi Ingeniera",
        price: "Desde $10",
        image: "assets/web/amigurumi-mi-ingeniera.png",
        tags: ["tejidos-crochet", "amigurumis"],
        detail: "Detalle especial para graduadas o futuras ingenieras, tejido a crochet y personalizado con colores de carrera.",
    },
    {
        name: "Amigurumis Elasticos",
        price: "Desde $5",
        image: "assets/web/63c8322eabc42a9fa1cd4ec4fcb7c469.jpg",
        tags: ["tejidos-crochet", "amigurumis"],
        detail: "Amigurumis con brazos y patas largas que se estiran, ideales para detalles divertidos.",
    },
    {
        name: "Amigurumi Andante",
        price: "$10",
        image: "assets/web/amigurumi-andante.png",
        tags: ["tejidos-crochet", "amigurumis"],
        detail: "Amigurumi andante tejido a crochet con mecanismo de movimiento y acabado personalizado.",
    },
    {
        name: "Portarretrato a Crochet",
        price: "$5",
        image: "assets/web/portarretrato-crochet.png",
        tags: ["tejidos-crochet", "accesorios-crochet"],
        detail: "Portarretrato tejido a crochet para foto pequena, llavero o detalle personalizado.",
    },
    {
        name: "Portavasos a Crochet",
        price: "Desde $4",
        image: "assets/web/portavasos-crochet.png",
        tags: ["tejidos-crochet", "accesorios-crochet"],
        detail: "Portavasos tejido a crochet con figuras divertidas, ideal para vasos, tazas o detalles personalizados.",
    },
    {
        name: "Llavero a Crochet",
        price: "Desde $3",
        image: "assets/web/llavero-crochet.png",
        tags: ["tejidos-crochet", "accesorios-crochet"],
        detail: "Llavero tejido a crochet para regalos y detalles personalizados.",
    },
    {
        name: "Porta Audifonos Crochet",
        price: "$4",
        image: "assets/web/porta-audifonos-crochet.png",
        tags: ["tejidos-crochet", "accesorios-crochet"],
        detail: "Porta audifonos tejido a crochet en colores personalizados.",
    },
    {
        name: "Gorrito",
        price: "Desde $3",
        image: "assets/web/gorro.jpg",
        tags: ["tejidos-crochet", "accesorios-crochet"],
        detail: "Gorrito tejido a mano en colores a pedido.",
    },
    {
        name: "Parejas a Crochet",
        price: "Desde $40",
        image: "assets/web/pareja-crochet-personalizada.jpg",
        tags: ["tejidos-crochet", "amigurumis"],
        detail: "Parejas a crochet para aniversarios o fechas especiales.",
    },
    {
        name: "Mascotas a Crochet",
        price: "Desde $7",
        image: "assets/web/mascota-perro-crochet.jpg",
        tags: ["tejidos-crochet", "amigurumis"],
        detail: "Mascotas a crochet segun foto o referencia.",
    },
    {
        name: "Ramos a Crochet",
        price: "Desde $6",
        image: "assets/web/flores.webp",
        tags: ["tejidos-crochet", "flores-crochet"],
        detail: "Ramos tejidos a crochet por color, flor y estilo de regalo.",
    },
    {
        name: "Ramos Eternos",
        price: "Desde $20",
        image: "assets/web/ramo-girasoles-rosas.jpg",
        tags: ["tejidos-crochet", "flores-crochet"],
        detail: "Ramo grande con girasoles, rosas y cinta personalizada.",
    },
    {
        name: "Mantaramo",
        price: "Desde $10",
        image: "assets/web/mantaramo.jpg",
        tags: ["tejidos-crochet", "flores-crochet"],
        detail: "Ramo tejido a crochet en colores personalizados.",
    },
    {
        name: "Flor de Sol Rapunzel",
        price: "Desde $12",
        image: "assets/web/flor-sol-rapunzel.jpg",
        tags: ["tejidos-crochet", "flores-crochet"],
        detail: "Flor decorativa inspirada en Rapunzel con base y detalles.",
    },
    {
        name: "Maceta de Flores",
        price: "Desde $5",
        image: "assets/web/maceta-limpiapipas-girasoles.jpg",
        tags: ["tejidos-crochet", "flores-crochet"],
        detail: "Maceta de flores en limpiapipas, color a pedido.",
    },
    {
        name: "Ramo de Limpiapipas",
        price: "Desde $15",
        image: "assets/web/ramo-limpiapipas.jpg",
        tags: ["tejidos-crochet", "flores-crochet"],
        detail: "Ramo decorativo en limpiapipas con flores variadas.",
    },
    {
        name: "Girasoles Eternos",
        price: "$5",
        image: "assets/web/girasol.webp",
        tags: ["tejidos-crochet", "flores-crochet"],
        detail: "Girasol eterno con base o presentacion sencilla.",
    },
    {
        name: "Portalapiceros",
        price: "Desde $5",
        image: "assets/web/gallery/porta1.webp",
        tags: ["tejidos-crochet", "accesorios-crochet"],
        detail: "Portalapiceros tejido con personaje o colores a pedido.",
    },
    {
        name: "Accesorios para Mascotas",
        price: "Desde $5",
        image: "assets/web/accesorios-mascotas-crochet.jpg",
        tags: ["tejidos-crochet", "accesorios-crochet"],
        detail: "Gorritos y accesorios tejidos para mascotas.",
    },
    {
        name: "Placa Spotify",
        price: "Desde $10",
        image: "assets/web/spotify.png",
        tags: ["corte-grabado", "placas-trofeos"],
        detail: "Placa Spotify con foto, cancion y dedicatoria.",
    },
];
const galleryItems = [
    "abejitas1.webp",
    "amigurumis.webp",
    "andante1.webp",
    "andante2.webp",
    "billie1.webp",
    "billie2.webp",
    "calamar1.webp",
    "conejito1.webp",
    "coraline1.webp",
    "coraline2.webp",
    "coraline3.webp",
    "dino1.webp",
    "dino2.webp",
    "dino3.webp",
    "eevee1.webp",
    "eevee2.webp",
    "flores.webp",
    "florsol1.webp",
    "florsol2.webp",
    "florsol3.webp",
    "fresa1.webp",
    "girasol1.webp",
    "goku1.webp",
    "goku2.webp",
    "joji1.webp",
    "joji2.webp",
    "joji3.webp",
    "kaneki1.webp",
    "kaneki2.webp",
    "karl1.webp",
    "karl2.webp",
    "karl3.webp",
    "kurt1.webp",
    "kurt2.webp",
    "llaveros.webp",
    "luffy1.webp",
    "maceta1.webp",
    "mascotas.webp",
    "messi1.webp",
    "messi2.webp",
    "messi3.webp",
    "messi4.webp",
    "pareja.webp",
    "pollito1.webp",
    "pollitobrujo1.webp",
    "pollitogrande1.webp",
    "ponyo1.webp",
    "ponyo2.webp",
    "porta1.webp",
    "porta10.webp",
    "porta2.webp",
    "porta3.webp",
    "porta4.webp",
    "porta5.webp",
    "porta6.webp",
    "porta7.webp",
    "porta8.webp",
    "porta9.webp",
    "pulpo1.webp",
    "pulpo2.webp",
    "pulpo3.webp",
    "pulpo4.webp",
    "pulpo5.webp",
    "ramo1.webp",
    "amigurumi1.webp",
    "amigurumi2.webp",
    "amigurumi3.webp",
    "skye1.webp",
    "skye2.webp",
    "sombrero1.webp",
    "sombrero2.webp",
    "sombrero4.webp",
    "tulipanes1.webp",
    "tulipanes2.webp",
    "tulipanes3.webp",
    "zoro1.webp",
    "zoro2.webp",
    "zoro3.webp",
];
const deliveryItems = [
    "cliente-e1.webp",
    "cliente-e10.webp",
    "cliente-e2.webp",
    "cliente-e3.webp",
    "cliente-e4.webp",
    "cliente-e5.webp",
    "cliente-e6.webp",
    "cliente-e7.webp",
    "cliente-e8.webp",
    "cliente-e9.webp",
    "cliente-e11.webp",
];

function catalogSortScore(item) {
    if (item.tags.includes("tejidos-crochet")) return 0;
    if (item.tags.includes("flores-crochet")) return 1;
    if (item.tags.includes("amigurumis")) return 2;
    if (item.tags.includes("accesorios-crochet")) return 3;
    return 10;
}

function buildWhatsAppUrl(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function openWhatsApp(message) {
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
}

function prepareRevealEffects() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (!revealObserver) {
        revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.14 });
    }

    document.querySelectorAll(revealSelectors.join(",")).forEach((element, index) => {
        if (element.classList.contains("reveal-item")) return;

        element.classList.add("reveal-item");
        element.style.transitionDelay = `${Math.min(index % 6, 5) * 55}ms`;
        revealObserver.observe(element);
    });
}

function revealActiveView(restart = false) {
    const activeView = document.querySelector(".view.is-active");
    if (!activeView) return;

    const visibleElements = Array.from(activeView.querySelectorAll(".reveal-item")).filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.96;
    });

    if (restart) {
        visibleElements.forEach((element) => {
            element.classList.remove("is-visible");
        });

        activeView.offsetHeight;
    }

    visibleElements.forEach((element, index) => {
        window.setTimeout(() => {
            element.classList.add("is-visible");
        }, restart ? 90 + (index % 8) * 95 : 0);
    });
}

function readableName(fileName) {
    const baseName = fileName.replace(/\.[^.]+$/, "").toLowerCase();
    if (baseName.startsWith("porta")) return "Portalapicero";

    return fileName
        .replace(/\.[^.]+$/, "")
        .replace(/-/g, " ")
        .replace(/\d+$/g, "")
        .trim()
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function galleryCategory(fileName) {
    const name = fileName.toLowerCase();
    const flowerWords = ["flor", "girasol", "ramo", "tulipanes", "fresa", "maceta"];
    const characterWords = ["goku", "luffy", "zoro", "coraline", "messi", "kurt", "joji", "kaneki", "karl", "billie", "ponyo", "skye", "eevee"];
    const keychainWords = ["llavero", "abejita", "pulpo", "calamar"];

    if (flowerWords.some((word) => name.includes(word))) return "flores";
    if (characterWords.some((word) => name.includes(word))) return "personajes";
    if (keychainWords.some((word) => name.includes(word))) return "llaveros";
    return "crochet";
}

function renderGallery(filter = "all") {
    if (!galleryGrid) return;

    const items = filter === "all" ?
        galleryItems :
        galleryItems.filter((item) => galleryCategory(item) === filter);

    galleryGrid.innerHTML = items.map((item) => {
        const label = readableName(item);
        return `
      <article data-category="${galleryCategory(item)}" data-gallery-image="assets/web/gallery/${item}" data-gallery-title="${label}">
        <img src="assets/web/gallery/${item}" alt="${label}" loading="lazy">
        <span>${label}</span>
      </article>
    `;
    }).join("");

    galleryGrid.querySelectorAll("[data-gallery-image]").forEach((card) => {
        card.addEventListener("click", () => {
            openImageModal(card.dataset.galleryImage, card.dataset.galleryTitle, "Trabajo realizado por Gissel.line.");
        });
    });

    prepareRevealEffects();
    revealActiveView();
}

function renderDeliveries() {
    if (!deliveryGrid) return;

    const photoCards = deliveryItems.map((item, index) => `
    <button class="delivery-image-button" type="button" data-delivery-image="assets/web/clients/${item}" data-delivery-title="Entrega real ${index + 1}" aria-label="Ver entrega real ${index + 1}">
      <img src="assets/web/clients/${item}" alt="Entrega real ${index + 1}" loading="lazy">
    </button>
  `);
    const videoCards = [
        `<article class="delivery-video">
      <video controls preload="metadata" playsinline poster="assets/web/clients/cliente-e1.webp">
        <source src="assets/web/videos/entrega-1.mp4" type="video/mp4">
      </video>
    </article>`,
        `<article class="delivery-video">
      <video controls preload="metadata" playsinline poster="assets/web/clients/cliente-e2.webp">
        <source src="assets/web/videos/entrega-2.mp4" type="video/mp4">
      </video>
    </article>`,
    ];

    deliveryGrid.innerHTML = [
        ...photoCards.slice(0, 4),
        videoCards[0],
        ...photoCards.slice(4, 8),
        videoCards[1],
        ...photoCards.slice(8),
    ].join("");

    deliveryGrid.querySelectorAll("[data-delivery-image]").forEach((button) => {
        button.addEventListener("click", () => {
            openImageModal(button.dataset.deliveryImage, button.dataset.deliveryTitle, "Entrega real de cliente.");
        });
    });

    prepareRevealEffects();
    revealActiveView();
}

function showWorkPanel(panelName) {
    workTabButtons.forEach((button) => {
        const isActive = button.dataset.workTab === panelName;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    workPanels.forEach((panel) => {
        const isActive = panel.dataset.workPanel === panelName;
        panel.classList.toggle("is-active", isActive);
        panel.hidden = !isActive;
    });
}

function openCatalogModal(item) {
    if (!catalogModal || !catalogModalImage || !catalogModalTitle || !catalogModalDetail) return;

    catalogModalImage.src = item.image;
    catalogModalImage.alt = item.name;
    catalogModalTitle.textContent = item.name;
    catalogModalDetail.textContent = item.detail;
    catalogModal.classList.add("is-open");
    catalogModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
}

function openImageModal(image, title, detail = "Imagen ampliada del portafolio.") {
    openCatalogModal({
        image,
        name: title,
        detail,
    });
}

function closeCatalogModal() {
    if (!catalogModal) return;

    catalogModal.classList.remove("is-open");
    catalogModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
}

function catalogItemBadge(item) {
    const tag = item.tags.find((itemTag) => !catalogMainTags.includes(itemTag)) || item.tags[0];
    return catalogFilterLabels[tag] || "Personalizado";
}

function renderCatalog(filter = "all") {
    if (!catalogList || !catalogCount) return;

    const items = (filter === "all" ?
        [...catalogItems].sort((a, b) => catalogSortScore(a) - catalogSortScore(b)) :
        catalogItems.filter((item) => item.tags.includes(filter)));

    const countLabel = items.length === 1 ? "1 producto" : `${items.length} productos`;
    catalogCount.textContent = filter === "all" ?
        countLabel :
        `${countLabel} - ${catalogFilterLabels[filter] || "Filtro"}`;

    catalogList.innerHTML = items.map((item) => {
        const itemIndex = catalogItems.indexOf(item);
        const badge = catalogItemBadge(item);

        return `
    <article class="catalog-item">
      <button class="catalog-image-button" type="button" data-catalog-image="${itemIndex}" aria-label="Ver imagen grande de ${item.name}">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
      </button>
      <div class="catalog-info">
        <span>${badge}</span>
        <h3>${item.name}</h3>
        <p>${item.detail}</p>
        <div class="catalog-actions">
          <button class="text-button catalog-buy" type="button" data-catalog-product="${item.name}">Comprar</button>
          <strong>${item.price}</strong>
        </div>
      </div>
    </article>
  `;
    }).join("");

    catalogList.querySelectorAll("[data-catalog-image]").forEach((button) => {
        button.addEventListener("click", () => {
            const item = catalogItems[Number(button.dataset.catalogImage)];
            if (item) openCatalogModal(item);
        });
    });

    catalogList.querySelectorAll("[data-catalog-product]").forEach((button) => {
        button.addEventListener("click", () => {
            openWhatsApp(`Hola, quiero comprar ${button.dataset.catalogProduct}.`);
        });
    });

    prepareRevealEffects();
    revealActiveView();
}

function selectCatalogFilter(button) {
    const filter = button.dataset.catalogFilter;
    const parentGroup = button.closest("[data-catalog-filter-group]");
    const activeGroup = button.dataset.catalogMainFilter || parentGroup?.dataset.catalogFilterGroup || "";

    catalogFilterButtons.forEach((filterButton) => {
        filterButton.classList.toggle("is-active", filterButton === button);
    });

    catalogFilterGroups.forEach((group) => {
        const isOpen = group.dataset.catalogFilterGroup === activeGroup;
        const mainButton = group.querySelector("[data-catalog-main-filter]");

        group.classList.toggle("is-open", isOpen);

        if (mainButton) {
            mainButton.setAttribute("aria-expanded", String(isOpen));
            mainButton.classList.toggle("is-parent-active", isOpen && mainButton !== button);
        }
    });

    renderCatalog(filter);
}

function showView(viewName, updateHash = true) {
    const nextView = document.querySelector(`[data-view="${viewName}"]`) ? viewName : defaultView;

    views.forEach((view) => {
        view.classList.toggle("is-active", view.dataset.view === nextView);
    });

    viewLinks.forEach((link) => {
        link.classList.toggle("is-active", link.dataset.viewLink === nextView);
    });

    if (mainMenu && menuToggle) {
        mainMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    }

    if (updateHash && window.location.hash !== `#${nextView}`) {
        history.pushState(null, "", `#${nextView}`);
    }

    const scrollBehavior = updateHash ? "smooth" : "auto";
    window.scrollTo({ top: 0, behavior: scrollBehavior });

    if (!updateHash) {
        window.setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 0);
    }

    prepareRevealEffects();
    window.setTimeout(() => revealActiveView(true), 40);
}

if (menuToggle && mainMenu) {
    menuToggle.addEventListener("click", () => {
        const isOpen = mainMenu.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        mainMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

viewLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        showView(link.dataset.viewLink);
    });
});

window.addEventListener("popstate", () => {
    showView(window.location.hash.replace("#", "") || defaultView, false);
});

whatsappLinks.forEach((link) => {
    const message = link.dataset.message || "Hola, quiero informacion sobre sus productos.";
    link.href = buildWhatsAppUrl(message);
});

galleryFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        galleryFilterButtons.forEach((filterButton) => {
            filterButton.classList.toggle("is-active", filterButton === button);
        });
        renderGallery(button.dataset.galleryFilter);
    });
});

workTabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        showWorkPanel(button.dataset.workTab);
    });
});

catalogModalCloseButtons.forEach((button) => {
    button.addEventListener("click", closeCatalogModal);
});

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCatalogModal();
});

catalogFilterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        selectCatalogFilter(button);
    });
});

askButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const product = button.dataset.product;
        openWhatsApp(`Hola, quiero cotizar ${product}.`);
    });
});

if (quickForm) {
    quickForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.querySelector("#customerName").value.trim();
        const product = document.querySelector("#productSelect").value;
        const detail = document.querySelector("#messageDetail").value.trim();

        const intro = name ? `Hola, soy ${name}.` : "Hola.";
        const detailText = detail ? ` Detalle: ${detail}` : "";
        const message = `${intro} Quiero cotizar ${product}.${detailText}`;

        openWhatsApp(message);
    });
}

if (carousel) {
    const slides = Array.from(carousel.querySelectorAll("[data-carousel-item]"));
    const prevButton = carousel.querySelector("[data-carousel-prev]");
    const nextButton = carousel.querySelector("[data-carousel-next]");
    let activeIndex = 0;
    let touchStartX = 0;
    let touchStartY = 0;

    carousel.querySelectorAll("img").forEach((image) => {
        image.addEventListener("error", () => {
            image.src = "assets/web/flores.webp";
        }, { once: true });
    });

    function getCarouselLayout() {
        if (window.matchMedia("(max-width: 700px)").matches) {
            return { sideOffset: 118, activeDepth: 0, sideDepth: 0, hiddenDepth: 0, sideRotate: 0, hiddenRotate: 0, sideScale: 0.72, hiddenScale: 0.54, sideOpacity: 0.78 };
        }

        if (window.matchMedia("(max-width: 980px)").matches) {
            return { sideOffset: 205, activeDepth: 0, sideDepth: 0, hiddenDepth: 0, sideRotate: 0, hiddenRotate: 0, sideScale: 0.74, hiddenScale: 0.54, sideOpacity: 0.78 };
        }

        return { sideOffset: 300, activeDepth: 0, sideDepth: 0, hiddenDepth: 0, sideRotate: 0, hiddenRotate: 0, sideScale: 0.78, hiddenScale: 0.55, sideOpacity: 0.78 };
    }

    function getCarouselOffset(slideIndex) {
        let offset = slideIndex - activeIndex;
        const half = slides.length / 2;

        if (offset > half) offset -= slides.length;
        if (offset < -half) offset += slides.length;

        return offset;
    }

    function setActiveSlide(index) {
        activeIndex = (index + slides.length) % slides.length;
        const layout = getCarouselLayout();

        slides.forEach((slide, slideIndex) => {
            const offset = getCarouselOffset(slideIndex);
            const distance = Math.abs(offset);
            const isActive = slideIndex === activeIndex;
            const direction = offset < 0 ? -1 : 1;

            let transform = `translateX(0) translateZ(${layout.activeDepth}px) rotateY(0deg) scale(1)`;
            let opacity = "1";
            let zIndex = 3;

            if (!isActive && distance === 1) {
                transform = `translateX(${offset * layout.sideOffset}px) translateZ(${layout.sideDepth}px) rotateY(${direction * -(layout.sideRotate ?? 38)}deg) scale(${layout.sideScale ?? 0.84})`;
                opacity = String(layout.sideOpacity ?? 1);
                zIndex = 2;
            } else if (!isActive) {
                transform = `translateX(${offset * (layout.sideOffset * 0.64)}px) translateZ(${layout.hiddenDepth}px) rotateY(${direction * -(layout.hiddenRotate ?? 48)}deg) scale(${layout.hiddenScale ?? 0.68})`;
                opacity = "0";
                zIndex = 1;
            }

            slide.style.transform = transform;
            slide.style.opacity = opacity;
            slide.style.filter = isActive ? "none" : "saturate(0.92) brightness(0.88)";
            slide.style.pointerEvents = distance > 1 ? "none" : "auto";
            slide.style.zIndex = String(zIndex);
            slide.classList.toggle("is-active", isActive);
            slide.setAttribute("aria-current", isActive ? "true" : "false");
        });
    }

    function openCarouselFilter() {
        const activeSlide = slides[activeIndex];
        const filter = activeSlide?.dataset.carouselFilter;

        showView("catalogo");

        if (filter) {
            const filterButton = document.querySelector(`[data-catalog-filter="${filter}"]`);
            if (filterButton) selectCatalogFilter(filterButton);
        }
    }

    slides.forEach((slide, index) => {
        slide.addEventListener("click", () => {
            if (index === activeIndex) {
                openCarouselFilter();
                return;
            }

            setActiveSlide(index);
        });
    });

    prevButton?.addEventListener("click", () => {
        setActiveSlide(activeIndex - 1);
    });

    nextButton?.addEventListener("click", () => {
        setActiveSlide(activeIndex + 1);
    });

    carousel.addEventListener("touchstart", (event) => {
        const touch = event.changedTouches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }, { passive: true });

    carousel.addEventListener("touchend", (event) => {
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;

        if (Math.abs(deltaX) < 42 || Math.abs(deltaX) < Math.abs(deltaY)) return;

        setActiveSlide(deltaX < 0 ? activeIndex + 1 : activeIndex - 1);
    }, { passive: true });

    window.addEventListener("resize", () => setActiveSlide(activeIndex));

    setActiveSlide(0);
}

renderGallery();
renderDeliveries();
renderCatalog();
showView(window.location.hash.replace("#", "") || defaultView, false);
