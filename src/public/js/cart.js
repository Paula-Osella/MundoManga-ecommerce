(() => {
  'use strict';

  const cartEl = document.querySelector('.cart');
  if (!cartEl) return;

  const listEl   = cartEl.querySelector('.cart-items');
  const savingEl = cartEl.querySelector('.cart-saving');
  const CART_ID  = cartEl.dataset.cartId;

  // Helpers
  const getTotalEl = () => document.getElementById('cartTotalAmount');
  const money = n => '$' + (Math.round((Number(n)||0)*100)/100)
    .toLocaleString('es-AR',{minimumFractionDigits:2,maximumFractionDigits:2});

  const safeSwapText = (el, newText) => {
    if (!el) return;
    el.classList.add('value-updating');
    setTimeout(() => { el.textContent = newText; el.classList.remove('value-updating'); }, 120);
  };
  const setSaving = (on) => { if (savingEl) savingEl.hidden = !on; };

  const rowSubtotalNum = (row) => {
    const unit = parseFloat(row.querySelector('.cart-price-unit')?.dataset.unit || '0');
    const qty  = parseInt(row.querySelector('.qty')?.textContent || '0', 10);
    return unit * qty;
  };

  const computeTotal = () => {
    let sum = 0;
    listEl.querySelectorAll('.cart-row').forEach(row => {
      if (!row.classList.contains('removing')) sum += rowSubtotalNum(row);
    });
    return sum;
  };

  // Debounce PUT por producto
  const timers   = new Map(); // productId -> timeoutId
  const inFlight = new Map(); // productId -> AbortController

  const schedulePUT = (productId, qty, row) => {
    if (timers.has(productId)) clearTimeout(timers.get(productId));
    if (inFlight.has(productId)) { inFlight.get(productId).abort(); inFlight.delete(productId); }

    setSaving(true);
    const tid = setTimeout(async () => {
      const ctrl = new AbortController();
      inFlight.set(productId, ctrl);
      try {
        const res = await fetch(`/api/carts/${CART_ID}/products/${productId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity: qty }),
          signal: ctrl.signal
        });
        if (!res.ok) throw new Error('PUT failed');
      } catch (e) {
        const qtyEl = row.querySelector('.qty');
        qtyEl.textContent = Math.max(1, parseInt(qtyEl.textContent || '1', 10));
        const subEl = row.querySelector('[data-subtotal]');
        safeSwapText(subEl, money(rowSubtotalNum(row)));
        safeSwapText(getTotalEl(), money(computeTotal()));
        alert('No se pudo actualizar la cantidad. Intenta de nuevo.');
      } finally {
        inFlight.delete(productId);
        if (timers.size === 0 && inFlight.size === 0) setSaving(false);
      }
    }, 300);

    timers.set(productId, tid);
    setTimeout(() => timers.delete(productId), 320);
  };

  // + / - / eliminar
  listEl.addEventListener('click', (e) => {
    const row = e.target.closest('.cart-row');
    if (!row) return;

    const productId = row.dataset.productId;
    const qtyEl = row.querySelector('.qty');
    const subEl = row.querySelector('[data-subtotal]');

    // aumentar / disminuir
    if (e.target.closest('.btn-increase') || e.target.closest('.btn-decrease')) {
      const isInc   = !!e.target.closest('.btn-increase');
      const current = parseInt(qtyEl.textContent || '1', 10);
      const next    = isInc ? Math.min(99, current + 1) : Math.max(1, current - 1);
      if (next === current) return;

      qtyEl.textContent = next;
      safeSwapText(subEl, money(rowSubtotalNum(row)));
      safeSwapText(getTotalEl(), money(computeTotal()));
      schedulePUT(productId, next, row);
      return;
    }

    // eliminar
    if (e.target.closest('.cart-remove')) {
      row.classList.add('removing');
      setSaving(true);
      setTimeout(async () => {
        row.remove();
        safeSwapText(getTotalEl(), money(computeTotal()));
        try {
          const res = await fetch(`/api/carts/${CART_ID}/products/${productId}`, { method: 'DELETE' });
          if (!res.ok) throw new Error('DELETE failed');
        } catch {
          alert('No se pudo eliminar el producto. Refrescá la página.');
        } finally {
          setSaving(false);
        }
      }, 260);
    }
  });

  // Finalizar compra
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async () => {
      try {
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = .7;
        setSaving(true);

        const res = await fetch(`/api/carts/${CART_ID}/purchase`, { method: 'POST' });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'No se pudo completar la compra');

        safeSwapText(getTotalEl(), money(0));
        listEl.innerHTML = '';

        if (data?.ticket?.code) {
          window.location.href = `/purchase/${encodeURIComponent(data.ticket.code)}`;
        } else {
          alert('Compra realizada, pero no se obtuvo el código de ticket.');
        }
      } catch (err) {
        alert(err.message || 'Error al completar la compra');
      } finally {
        setSaving(false);
        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = '';
      }
    });
  }
})();
