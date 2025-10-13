// public/js/reset-password.js
(() => {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('resetForm');
        const msg = document.getElementById('msg');
        const submitBtn = document.getElementById('resetSubmit');

        if (!form || !msg || !submitBtn) return;

        // Tomamos el token de la URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        // Si no hay token -> bloquear el form y avisar
        if (!token) {
            msg.style.color = 'var(--primary-color)';
            msg.textContent = 'Token inválido o ausente. Solicitá un nuevo enlace de restablecimiento.';
            submitBtn.disabled = true;
            return;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            msg.textContent = '';

            const newPassword = document.getElementById('newPassword').value.trim();
            const confirmPassword = document.getElementById('confirmPassword').value.trim();

            // Validaciones mínimas
            if (newPassword.length < 8) {
                msg.style.color = 'var(--primary-color)';
                msg.textContent = 'La contraseña debe tener al menos 8 caracteres.';
                return;
            }
            if (newPassword !== confirmPassword) {
                msg.style.color = 'var(--primary-color)';
                msg.textContent = 'Las contraseñas no coinciden.';
                return;
            }

            // Deshabilitar mientras enviamos
            submitBtn.disabled = true;
            const prevText = submitBtn.textContent;
            submitBtn.textContent = 'Actualizando…';

            try {
                const res = await fetch(`/api/user/reset-password?token=${encodeURIComponent(token)}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ newPassword })
                });

                const data = await res.json().catch(() => ({}));

                if (res.ok) {
                    msg.style.color = 'var(--secondary-color)';
                    msg.textContent = data.message || 'Contraseña actualizada correctamente. Redirigiendo…';
                    // Redirige al login con mensaje para mostrar el aviso verde allí
                    setTimeout(() => {
                        window.location.href = '/login?message=restablecimiento_exitoso';
                    }, 1000);
                } else {
                    msg.style.color = 'var(--primary-color)';
                    msg.textContent = data.message || 'No se pudo actualizar la contraseña.';
                    submitBtn.disabled = false;
                    submitBtn.textContent = prevText;
                }
            } catch (err) {
                console.error(err);
                msg.style.color = 'var(--primary-color)';
                msg.textContent = 'No se pudo contactar al servidor.';
                submitBtn.disabled = false;
                submitBtn.textContent = prevText;
            }
        });
    });
})();