// public/js/products.js
(() => {
    'use strict';

    // ===== Utilidad de toast (usa app-toast.js; si no está, fallback a alert) =====
    function showToastSafe(msg, type = 'success') {
        if (typeof window.showToast === 'function') {
            window.showToast(msg, type);
        } else {
            if (type === 'error') console.error(msg);
            alert(msg);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        // --- Mensajes en URL (errores de backend, etc.) ---
        const urlParams = new URLSearchParams(window.location.search);
        const errorMessageElement = document.getElementById('errorMessage');
        if (urlParams.get('error') && errorMessageElement) {
            errorMessageElement.innerText = decodeURIComponent(urlParams.get('error'));
        }
        if (urlParams.get('message') || urlParams.get('error')) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // --- Stepper (+ / -) ---
        document.querySelectorAll('.qty-controls').forEach(ctrl => {
            const qtyEl = ctrl.querySelector('.qty');
            const decBtn = ctrl.querySelector('.btn-decrease');
            const incBtn = ctrl.querySelector('.btn-increase');

            if (decBtn) decBtn.addEventListener('click', () => {
                qtyEl.textContent = Math.max(1, (parseInt(qtyEl.textContent || '1', 10) - 1));
            });
            if (incBtn) incBtn.addEventListener('click', () => {
                qtyEl.textContent = Math.min(99, (parseInt(qtyEl.textContent || '1', 10) + 1));
            });
        });

        // --- Ver más / Ver menos (delegado al grid para menos listeners) ---
        const grid = document.querySelector('.products-grid-container');
        if (grid) {
            grid.addEventListener('click', (e) => {
                const btn = e.target.closest('.toggle-desc');
                if (!btn) return;

                const targetId = btn.getAttribute('data-target');
                if (!targetId) return;

                const desc = document.getElementById(targetId);
                if (!desc) return;

                const expanded = desc.classList.toggle('is-expanded');
                desc.classList.toggle('card-desc--clamp', !expanded);
                btn.textContent = expanded ? 'Ver menos' : 'Ver más';

                // Fallback inline por si algún CSS global fuerza el clamp
                if (expanded) {
                    desc.style.display = 'block';
                    desc.style.overflow = 'visible';
                    desc.style.webkitLineClamp = 'unset';
                    desc.style.webkitBoxOrient = 'initial';
                } else {
                    desc.style.display = '';
                    desc.style.overflow = '';
                    desc.style.webkitLineClamp = '';
                    desc.style.webkitBoxOrient = '';
                }
            });
        }

        // --- Agregar al carrito ---
        document.querySelectorAll('button.add-to-cart').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (!window.IS_LOGGED_IN) {
                    window.location.href = '/login?error=Debes%20iniciar%20sesión';
                    return;
                }

                const prodId = btn.getAttribute('data-id');

                try {
                    // 1) Crear carrito si no existe
                    let cartId = window.CART_ID;
                    if (!cartId) {
                        const createRes = await fetch('/api/carts', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' }
                        });
                        if (!createRes.ok) throw new Error('No se pudo crear el carrito');
                        const createData = await createRes.json();
                        cartId = createData.cart?._id || createData._id;
                        window.CART_ID = cartId;

                        const cartLink = document.getElementById('cartLink');
                        if (cartLink && cartId) cartLink.href = `/carts/${cartId}`;
                    }

                    // 2) Cantidad elegida en ESTA card
                    const card = btn.closest('.product-card');
                    const qty = Math.max(1, parseInt(card.querySelector('.qty-controls .qty').textContent || '1', 10));

                    // 3) Leer carrito actual para cantidad acumulada
                    const cartRes = await fetch(`/api/carts/${cartId}`);
                    if (!cartRes.ok) throw new Error('No se pudo leer el carrito');
                    const cart = await cartRes.json();
                    const item = (cart.products || []).find(p => (p.product?._id || p.product) == prodId);
                    const target = (item?.quantity || 0) + qty;

                    // 4) PUT con la cantidad final
                    btn.disabled = true;
                    const putRes = await fetch(`/api/carts/${cartId}/products/${prodId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ quantity: target })
                    });
                    const data = await putRes.json();
                    btn.disabled = false;

                    if (!putRes.ok) {
                        console.error('PUT falló:', data);
                        showToastSafe(data.message || 'No se pudo actualizar la cantidad', 'error');
                        return;
                    }

                    // 5) Reset visual + badge + toast
                    card.querySelector('.qty-controls .qty').textContent = '1';
                    if (window.refreshCartCount) await window.refreshCartCount();
                    showToastSafe(`Producto agregado al carrito con éxito (${qty})`, 'success');
                } catch (err) {
                    console.error(err);
                    showToastSafe('Error al agregar al carrito', 'error');
                }
            });
        });
    });
})();
