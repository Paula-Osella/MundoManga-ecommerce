// public/js/forgot-password.js
(() => {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('forgotForm');
        const msg = document.getElementById('msg');
        if (!form || !msg) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            msg.textContent = '';

            try {
                const res = await fetch('/api/user/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: document.getElementById('email').value })
                });

                const data = await res.json();

                if (res.ok) {
                    msg.style.color = 'var(--secondary-color)';
                    msg.textContent = data.message || 'Si el correo existe, te enviamos un link para resetear la contraseña.';
                } else {
                    msg.style.color = 'var(--primary-color)';
                    msg.textContent = data.message || 'Ocurrió un error';
                }
            } catch (err) {
                console.error(err);
                msg.style.color = 'var(--primary-color)';
                msg.textContent = 'No se pudo contactar al servidor.';
            }
        });
    });
})();
