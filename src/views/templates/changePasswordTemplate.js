export const changePasswordTemplate  = (resetLink) => {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperación de Contraseña</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                color: #333;
                text-align: center;
            }

            .email-wrapper {
                width: 100%;
                background-color: #f4f4f4;
                padding: 20px 0;
            }

            .container {
                background: #ffffff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                max-width: 500px;
                margin: auto;
                text-align: center;
            }

            h2 {
                color: #007bff;
                font-size: 24px;
                margin-bottom: 20px;
            }

            p {
                color: #555;
                font-size: 16px;
                line-height: 1.5;
                margin-bottom: 20px;
            }

            .button {
                background-color: #007bff;
                color:rgb(255, 255, 255);
                padding: 12px 20px;
                text-decoration: none;
                font-size: 16px;
                border-radius: 5px;
                display: inline-block;
                margin-top: 20px;
                transition: background-color 0.3s ease;
            }

            .button:hover {
                background-color: #0056b3;
            }

            .footer {
                font-size: 14px;
                color: #999;
                margin-top: 30px;
            }

            .footer a {
                color: #007bff;
                text-decoration: none;
            }

            .footer p {
                margin-top: 10px;
            }

        </style>
    </head>
    <body>
        <div class="email-wrapper">
            <div class="container">
                <h2>Recuperación de Contraseña</h2>
                <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón para continuar con el proceso:</p>
                
                 <a href="${resetLink}" style="padding: 10px 15px; background-color:rgb(57, 38, 103); color: white; text-decoration: none;">Restablecer Contraseña</a>
                <p>Este enlace expirará en 1 hora por motivos de seguridad.</p>
                <p>Si no solicitaste este cambio, por favor ignora este mensaje.</p>
                <div class="footer">
                    <p>Gracias por confiar en nosotros, <br>El equipo de soporte</p>
                    <p><a href="mailto:support@example.com">Contactar Soporte</a></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};