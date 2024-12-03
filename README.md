Tienda Online - MundoManga
¡Bienvenido a MundoManga! Esta es una tienda en línea donde puedes explorar y comprar productos relacionados con el mundo del manga. El proyecto está construido con Node.js, Express, GitHub y WebSocket para la gestión del código y la comunicación en tiempo real.

Descripción del Proyecto
Este proyecto simula una tienda online con productos (mangas, artículos de colección, etc.). Implementa funcionalidades como la gestión de productos y carritos de compra utilizando Express para el backend, JSON como base de datos simulada, WebSocket para comunicación en tiempo real, y plantillas para la interfaz de usuario.

Tecnologías Utilizadas
Node.js: Entorno de ejecución para JavaScript.
Express.js: Framework de Node.js para la creación del servidor.
Git: Sistema de control de versiones para la gestión del código.
JSON: Se utiliza como almacenamiento temporal para los productos y carritos.
WebSocket: Protocolo para comunicación bidireccional en tiempo real entre el servidor y el cliente.
Plantillas (Template Engines): Se utiliza para generar el contenido dinámico de las páginas web del proyecto (por ejemplo, EJS o Handlebars).
Funcionalidades
Gestión de Productos:
Listado de productos.
Obtener detalles de un producto específico.
Crear un nuevo producto.
Actualizar un producto existente.
Eliminar un producto.
Gestión de Carritos:
Agregar productos a un carrito.
Ver los productos de un carrito.
Eliminar productos del carrito.
Comunicación en Tiempo Real:
WebSocket: Se ha implementado WebSocket para permitir la comunicación en tiempo real, por ejemplo, para notificaciones sobre el estado de los carritos o actualizaciones de stock.
Plantillas:
Se ha integrado un motor de plantillas como EJS o Handlebars para generar dinámicamente las páginas web del proyecto. Esto permite la visualización de los productos y carritos de manera estructurada y con datos actualizados en tiempo real.
Handlers:
Los handlers de rutas en Express manejan las peticiones HTTP y las operaciones sobre los productos y los carritos. Los handlers se encargan de gestionar la lógica de negocio y las respuestas adecuadas a las solicitudes del cliente.
Validación de Datos:
Validación del ID de los productos.
Verificación de la presencia de campos obligatorios en las peticiones de creación y actualización de productos.
Instalación
Requisitos
Node.js: Descargar Node.js
Git: Descargar Git
Pasos para instalar el proyecto
Clona el repositorio:
bash
Copiar código
git clone https://github.com/paulaosella/MundoManga.git
Navega a la carpeta del proyecto:
bash
Copiar código
cd MundoManga
Instala las dependencias:
bash
Copiar código
npm install
Inicia el servidor:
bash
Copiar código
npm start
El servidor estará corriendo en http://localhost:8080.
Rutas disponibles
Productos
GET /api/products: Listar todos los productos.
GET /api/products/:pid: Obtener un producto por su ID.
POST /api/products: Crear un nuevo producto.
PUT /api/products/:pid: Actualizar un producto existente.
DELETE /api/products/:pid: Eliminar un producto por ID.
Carritos
POST /api/carts: Crear un nuevo carrito.
GET /api/carts/:cid: Obtener los productos de un carrito.
POST /api/carts/:cid/products/:pid: Agregar un producto a un carrito.
DELETE /api/carts/:cid/products/:pid: Eliminar un producto de un carrito.
Contribuir
¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar este proyecto o quieres corregir algún error, puedes hacer un fork del repositorio y enviar un pull request.

Pasos para contribuir:

Haz un fork del repositorio.
Crea una nueva rama (git checkout -b mi-rama).
Realiza tus cambios y haz commit (git commit -am 'Agregué una nueva funcionalidad').
Haz push de tus cambios (git push origin mi-rama).
Crea un pull request desde tu rama.

¡Gracias por tu interés en el proyecto y por visitar MundoManga! 🚀 
