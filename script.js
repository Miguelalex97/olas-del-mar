/* ========================================
   OLAS DEL MAR - JavaScript
   ======================================== */

// ─── Datos del Menú ──────────────────────────────────────
const menuData = [
    // Entradas
    { id: 1, category: "entradas", name: "Ceviche de Pescado", description: "Pescado fresco marinado en limón con cebolla, cilantro y ají limo.", price: 12.99, image: "el-mosqui-murcia-768x576.jpeg", badge: "Popular" },
    { id: 2, category: "entradas", name: "Tostones con Guacamole", description: "Plátano verde frito crujiente con guacamole artesanal y pico de gallo.", price: 9.50, image: "langostinos-casa-bigote.jpg", badge: "" },
    { id: 3, category: "entradas", name: "Coctel de Camarón", description: "Camarones frescos en salsa de tomate con aguacate y galletas saladas.", price: 14.00, image: "el-mosqui-murcia-768x576.jpeg", badge: "" },
    { id: 4, category: "entradas", name: "Empanadas de Mariscos", description: "Masa dorada rellena de mezcla de mariscos con salsa criolla.", price: 11.00, image: "langostinos-casa-bigote.jpg", badge: "Nuevo" },

    // Pescados
    { id: 5, category: "pescados", name: "Pargo a la Plancha", description: "Filete de pargo fresco a la plancha con verduras grilladas y arroz con coco.", price: 22.99, image: "el-mosqui-murcia-768x576.jpeg", badge: "Chef Recomienda" },
    { id: 6, category: "pescados", name: "Mojarra Frita Entera", description: "Mojarra entera crujiente con patacones, ensalada y salsa tártara.", price: 19.99, image: "langostinos-casa-bigote.jpg", badge: "" },
    { id: 7, category: "pescados", name: "Salmón al Horno", description: "Salmón fresco al horno con hierbas, limón y puré de yuca.", price: 25.99, image: "el-mosqui-murcia-768x576.jpeg", badge: "" },
    { id: 8, category: "pescados", name: "Tilapia al Coco", description: "Tilapia bañada en salsa de coco fresco con arroz con leche de coco.", price: 21.50, image: "langostinos-casa-bigote.jpg", badge: "" },

    // Mariscos
    { id: 9, category: "mariscos", name: "Langostinos al Ajillo", description: "Langostinos gigantes salteados en ajo, mantequilla y perejil fresco.", price: 28.99, image: "langostinos-casa-bigote.jpg", badge: "Favorito" },
    { id: 10, category: "mariscos", name: "Paella de Mariscos", description: "Arroz español con camarones, mejillones, calamares y azafrán.", price: 32.00, image: "el-mosqui-murcia-768x576.jpeg", badge: "Para Compartir" },
    { id: 11, category: "mariscos", name: "Camarones a la Diabla", description: "Camarones grandes en salsa picante con arroz blanco y frijoles negros.", price: 26.50, image: "langostinos-casa-bigote.jpg", badge: "" },
    { id: 12, category: "mariscos", name: "Arroz con Mariscos", description: "Arroz marinero con camarones, calamares, pulpo y salsa rosada.", price: 27.99, image: "el-mosqui-murcia-768x576.jpeg", badge: "" },

    // Postres
    { id: 13, category: "postres", name: "Tres Leches de Coco", description: "Bizcocho esponjoso bañado en tres leches con toque de coco rallado.", price: 8.99, image: "langostinos-casa-bigote.jpg", badge: "" },
    { id: 14, category: "postres", name: "Flan de Coco", description: "Flan casero de coco con caramelo suave y nueces caramelizadas.", price: 7.50, image: "el-mosqui-murcia-768x576.jpeg", badge: "Clásico" },
    { id: 15, category: "postres", name: "Helado de Frutas Tropicales", description: "Helado artesanal de maracuyá, mango y guanábana con trozos de fruta.", price: 6.99, image: "langostinos-casa-bigote.jpg", badge: "" },
    { id: 16, category: "postres", name: "Brownie con Helado", description: "Brownie de chocolate belga con helado de vainilla y salsa de chocolate.", price: 9.99, image: "el-mosqui-murcia-768x576.jpeg", badge: "" },

    // Bebidas
    { id: 17, category: "bebidas", name: "Limonada Natural", description: "Limón fresco con hierbabuena y un toque de jengibre. Refrescante.", price: 4.50, image: "restaurantes-de-playa-2.jpeg", badge: "" },
    { id: 18, category: "bebidas", name: "Jugo de Frutas del Día", description: "Jugo fresco natural de mango, guanábana o papaya.", price: 5.00, image: "restaurantes-de-playa-2.jpeg", badge: "" },
    { id: 19, category: "bebidas", name: "Cerveza Artesanal", description: "Selección de cervezas artesanales locales. Consulta disponibilidad.", price: 6.50, image: "restaurantes-de-playa-2.jpeg", badge: "" },
    { id: 20, category: "bebidas", name: "Cóctel de la Casa", description: "Ron, jugo de maracuyá, coco fresco y un toque de granadina. (18+)", price: 9.99, image: "restaurantes-de-playa-2.jpeg", badge: "Especial" }
];

// ─── Estado de la App ────────────────────────────────────
let cart = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let activeFilter = 'all';

// ─── Inicialización ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderMenu();
    setupFilterButtons();
    setupNavScroll();
    setupForms();
    setupCartButtons();
    setupThemeToggle();
    setupBackToTop();
    updateCartBadge();
    AOS.init({ duration: 800, once: true, offset: 80 });
});

// ─── Modo Oscuro/Claro ──────────────────────────────────
function initTheme() {
    const saved = localStorage.getItem('theme');
    const root = document.getElementById('htmlRoot');
    const icon = document.querySelector('#themeToggle i');
    if (saved === 'dark') {
        root.setAttribute('data-bs-theme', 'dark');
        if (icon) icon.className = 'fa-solid fa-sun';
    } else {
        root.setAttribute('data-bs-theme', 'light');
        if (icon) icon.className = 'fa-solid fa-moon';
    }
}

function setupThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const root = document.getElementById('htmlRoot');
        const icon = btn.querySelector('i');
        const isDark = root.getAttribute('data-bs-theme') === 'dark';
        if (isDark) {
            root.setAttribute('data-bs-theme', 'light');
            localStorage.setItem('theme', 'light');
            icon.className = 'fa-solid fa-moon';
        } else {
            root.setAttribute('data-bs-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            icon.className = 'fa-solid fa-sun';
        }
    });
}

// ─── Botón Volver Arriba ────────────────────────────────
function setupBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) btn.classList.add('show');
        else btn.classList.remove('show');
    });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ─── Renderizar Menú ─────────────────────────────────────
function renderMenu() {
    const grid = document.getElementById('menuGrid');
    grid.innerHTML = '';

    const items = activeFilter === 'all'
        ? menuData
        : menuData.filter(item => item.category === activeFilter);

    items.forEach((item, index) => {
        const isFav = favorites.includes(item.id);
        const col = document.createElement('div');
        col.className = 'col-lg-3 col-md-4 col-sm-6 menu-item show';
        col.style.animationDelay = `${index * 0.06}s`;
        col.dataset.category = item.category;

        col.innerHTML = `
            <div class="card h-100 border-0">
                <div class="menu-item-img-wrapper">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    ${item.badge ? `<span class="menu-item-badge">${item.badge}</span>` : ''}
                    <button class="menu-item-fav ${isFav ? 'active' : ''}" data-id="${item.id}" title="Agregar a favoritos">
                        <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
                    </button>
                </div>
                <div class="menu-item-body">
                    <h5>${item.name}</h5>
                    <p class="description">${item.description}</p>
                    <div class="menu-item-footer">
                        <span class="menu-item-price">$${item.price.toFixed(2)}</span>
                        <button class="btn-add" data-id="${item.id}">
                            <i class="fa-solid fa-plus"></i> Agregar
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(col);
    });

    grid.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
    });
    grid.querySelectorAll('.menu-item-fav').forEach(btn => {
        btn.addEventListener('click', () => toggleFavorite(parseInt(btn.dataset.id), btn));
    });
}

// ─── Filtros del Menú ───────────────────────────────────
function setupFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            renderMenu();
        });
    });
}

// ─── Carrito de Compras ──────────────────────────────────
function addToCart(itemId) {
    const item = menuData.find(m => m.id === itemId);
    if (!item) return;

    const existing = cart.find(c => c.id === itemId);
    if (existing) existing.qty += 1;
    else cart.push({ ...item, qty: 1 });

    updateCartBadge();
    renderCartSummary();
    showToast(`${item.name} agregado al pedido`);

    const badge = document.getElementById('cartCount');
    badge.classList.add('pulse');
    setTimeout(() => badge.classList.remove('pulse'), 300);
}

function removeFromCart(itemId) {
    cart = cart.filter(c => c.id !== itemId);
    updateCartBadge();
    renderCartSummary();
}

function changeQty(itemId, delta) {
    const item = cart.find(c => c.id === itemId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) { removeFromCart(itemId); return; }
    updateCartBadge();
    renderCartSummary();
}

function clearCart() {
    cart = [];
    updateCartBadge();
    renderCartSummary();
    showToast('Pedido vaciado');
}

function updateCartBadge() {
    const count = cart.reduce((sum, c) => sum + c.qty, 0);
    document.getElementById('cartCount').textContent = count;
}

function renderCartSummary() {
    const summary = document.getElementById('cartSummary');
    const itemsList = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');

    if (cart.length === 0) { summary.style.display = 'none'; return; }

    summary.style.display = 'block';
    itemsList.innerHTML = '';

    cart.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>${item.name}</strong>
                    <br><small class="text-muted">$${item.price.toFixed(2)} c/u</small>
                </div>
                <div class="item-qty">
                    <button class="qty-minus" data-id="${item.id}">−</button>
                    <span class="mx-2 fw-bold">${item.qty}</span>
                    <button class="qty-plus" data-id="${item.id}">+</button>
                    <button class="btn btn-sm btn-outline-danger ms-2 remove-item" data-id="${item.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        itemsList.appendChild(li);
    });

    itemsList.querySelectorAll('.qty-minus').forEach(btn => btn.addEventListener('click', () => changeQty(parseInt(btn.dataset.id), -1)));
    itemsList.querySelectorAll('.qty-plus').forEach(btn => btn.addEventListener('click', () => changeQty(parseInt(btn.dataset.id), 1)));
    itemsList.querySelectorAll('.remove-item').forEach(btn => btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.id))));

    const total = cart.reduce((sum, c) => sum + (c.price * c.qty), 0);
    totalEl.textContent = total.toFixed(2);
}

function setupCartButtons() {
    document.getElementById('clearCartBtn')?.addEventListener('click', clearCart);
    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
        if (cart.length === 0) return;
        const total = cart.reduce((sum, c) => sum + (c.price * c.qty), 0);
        const count = cart.reduce((sum, c) => sum + c.qty, 0);
        showToast(`¡Pedido confirmado! ${count} artículos por $${total.toFixed(2)}. ¡Gracias!`);
        cart = [];
        updateCartBadge();
        renderCartSummary();
    });
}

// ─── Favoritos ───────────────────────────────────────────
function toggleFavorite(itemId, btnEl) {
    const index = favorites.indexOf(itemId);
    const icon = btnEl.querySelector('i');

    if (index > -1) {
        favorites.splice(index, 1);
        btnEl.classList.remove('active');
        icon.className = 'fa-regular fa-heart';
        showToast('Eliminado de favoritos');
    } else {
        favorites.push(itemId);
        btnEl.classList.add('active');
        icon.className = 'fa-solid fa-heart';
        showToast('Agregado a favoritos');
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// ─── Navbar Scroll ───────────────────────────────────────
function setupNavScroll() {
    const nav = document.getElementById('mainNav');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#navbarNav .nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');

        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) current = section.getAttribute('id');
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const collapse = document.getElementById('navbarNav');
            const bsCollapse = bootstrap.Collapse.getInstance(collapse);
            if (bsCollapse) bsCollapse.hide();
        });
    });
}

// ─── Formularios ────────────────────────────────────────
function setupForms() {
    const resForm = document.getElementById('reservationForm');
    if (resForm) {
        const dateInput = document.getElementById('resDate');
        dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
        resForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('resName').value;
            const date = document.getElementById('resDate').value;
            const time = document.getElementById('resTime').value;
            const guests = document.getElementById('resGuests').value;
            showToast(`¡Reservación confirmada para ${name}! ${date} a las ${time} para ${guests}. Te esperamos.`);
            resForm.reset();
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('¡Mensaje enviado! Nos pondremos en contacto contigo pronto.');
            contactForm.reset();
        });
    }
}

// ─── Toast Notifications ─────────────────────────────────
function showToast(message) {
    const toastEl = document.getElementById('appToast');
    const messageEl = document.getElementById('toastMessage');
    messageEl.textContent = message;
    const toast = new bootstrap.Toast(toastEl, { delay: 3500 });
    toast.show();
}
