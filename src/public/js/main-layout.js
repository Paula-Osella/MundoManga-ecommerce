// public/js/main-layout.js
(() => {
    'use strict';

    // ===== Datos del layout inyectados por Handlebars =====
    const body = document.body;
    const username = (body.dataset.username || '').trim() || null;
    const serverCartId = (body.dataset.cartId || '').trim() || null;

    // Exponer flags globales para vistas hijas (products, cart)
    window.IS_LOGGED_IN = !!username;
    window.CART_ID = window.CART_ID || serverCartId || null;

    // ===== Toast de bienvenida (solo una vez por pestaña) =====
    (function showWelcomeOnce() {
        const toastEl = document.getElementById('welcomeToast');
        if (!toastEl || !username) return;

        const key = `welcomeShown:${username}`;
        try {
            if (!sessionStorage.getItem(key)) {
                toastEl.classList.add('show');
                setTimeout(() => toastEl.classList.remove('show'), 4000);
                sessionStorage.setItem(key, '1');
            }
        } catch { /* fail-safe */ }
    })();

    // ===== Refrescar badge del carrito =====
    async function refreshCartCount() {
        try {
            const badge = document.getElementById('cartCountBadge');
            if (!badge) return;

            if (!window.CART_ID || !window.IS_LOGGED_IN) {
                badge.style.display = 'none';
                return;
            }

            const res = await fetch(`/api/carts/${window.CART_ID}`);
            if (res.status === 401) { badge.style.display = 'none'; return; }
            if (!res.ok) throw new Error('No OK');

            const cart = await res.json();
            const totalQty = (cart.products || []).reduce((acc, it) => acc + (it.quantity || 0), 0);
            badge.textContent = totalQty;
            badge.style.display = totalQty > 0 ? 'inline-block' : 'none';
        } catch { /* silencioso */ }
    }
    window.refreshCartCount = refreshCartCount; // disponible para otras vistas

    // ===== Sincronizar link del carrito si aparece el CART_ID luego =====
    function syncCartLink() {
        const link = document.getElementById('cartLink');
        if (!link) return;
        if (window.CART_ID && window.IS_LOGGED_IN) link.href = `/carts/${window.CART_ID}`;
        else link.href = '#';
    }

    // ===== Proteger acceso al carrito (redirigir a login si no hay sesión) =====
    (function protectCartLink() {
        const link = document.getElementById('cartLink');
        if (!link) return;

        const alreadyInCart = location.pathname.startsWith('/carts/');
        if (alreadyInCart) return;

        link.addEventListener('click', (e) => {
            if (!window.IS_LOGGED_IN) {
                e.preventDefault();
                window.location.href = '/login?error=Debes%20iniciar%20sesión';
            }
        });
    })();

    // ===== Borrar flag del toast al cerrar sesión (opcional) =====
    (function clearWelcomeOnLogout() {
        const logoutLink = document.getElementById('logoutLink');
        if (!logoutLink || !username) return;
        logoutLink.addEventListener('click', () => {
            try { sessionStorage.removeItem(`welcomeShown:${username}`); } catch { }
        });
    })();

    // ===== Boot =====
    document.addEventListener('DOMContentLoaded', () => {
        syncCartLink();
        refreshCartCount();
    });
})();
