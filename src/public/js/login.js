// public/js/login.js
(() => {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const successParam = urlParams.get('message');
        const errorParam = urlParams.get('error');
        const successMessageElement = document.getElementById('successMessage');
        const errorMessageElement = document.getElementById('errorMessage');

        if (successParam === 'registro_exitoso') {
            successMessageElement.innerText = '¡Registro exitoso! Por favor, inicia sesión.';
            successMessageElement.style.color = 'var(--secondary-color)';
        } else if (successParam === 'restablecimiento_exitoso') {
            successMessageElement.innerText = 'Contraseña restablecida correctamente. Por favor, inicia sesión.';
            successMessageElement.style.color = 'var(--secondary-color)';
        } else if (successParam === 'logout_exitoso') {
            successMessageElement.innerText = '¡Has cerrado sesión correctamente!';
            successMessageElement.style.color = 'var(--secondary-color)';
        } else if (errorParam) {
            errorMessageElement.innerText = decodeURIComponent(errorParam);
        }

        // limpiar los parámetros de la URL (para que no reaparezcan al refrescar)
        if (successParam || errorParam) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    });
})();
