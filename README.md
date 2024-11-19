# Tienda Online - MundoManga

¡Bienvenido a MundoManga! Esta es una tienda en línea donde puedes explorar y comprar productos relacionados con el mundo del manga. El proyecto está construido con **Node.js**, **Express** y **GitHub** para la gestión del código.

## Descripción del Proyecto

Este proyecto simula una tienda online con productos (mangas, artículos de colección, etc.). Implementa funcionalidades como la gestión de productos y carritos de compra utilizando **Express** para el backend y **JSON** como base de datos simulada.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript.
- **Express.js**: Framework de Node.js para la creación del servidor.
- **Git**: Sistema de control de versiones para la gestión del código.
- **JSON**: Se utiliza como almacenamiento temporal para los productos y carritos.

## Funcionalidades

1. **Gestión de Productos**:
   - Listado de productos.
   - Obtener detalles de un producto específico.
   - Crear un nuevo producto.
   - Actualizar un producto existente.
   - Eliminar un producto.

2. **Gestión de Carritos**:
   - Agregar productos a un carrito.
   - Ver los productos de un carrito.
   - Eliminar productos del carrito.

3. **Validación de datos**:
   - Validación del ID de los productos.
   - Verificación de la presencia de campos obligatorios en las peticiones de creación y actualización de productos.

## Instalación

### Requisitos

- **Node.js**: [Descargar Node.js](https://nodejs.org/)
- **Git**: [Descargar Git](https://git-scm.com/)

### Pasos para instalar el proyecto

1. Clona el repositorio:

    ```bash
    git clone https://github.com/paulaosella/MundoManga.git
    ```

2. Navega a la carpeta del proyecto:

    ```bash
    cd MundoManga
    ```

3. Instala las dependencias:

    ```bash
    npm install
    ```

4. Inicia el servidor:

    ```bash
    npm start
    ```

5. El servidor estará corriendo en `http://localhost:8080`.

## Rutas disponibles

### Productos

- **GET** `/api/products`: Listar todos los productos.
- **GET** `/api/products/:pid`: Obtener un producto por su ID.
- **POST** `/api/products`: Crear un nuevo producto.
- **PUT** `/api/products/:pid`: Actualizar un producto existente.
- **DELETE** `/api/products/:pid`: Eliminar un producto por ID.

### Carritos

- **POST** `/api/carts`: Crear un nuevo carrito.
- **GET** `/api/carts/:cid`: Obtener los productos de un carrito.
- **POST** `/api/carts/:cid/products/:pid`: Agregar un producto a un carrito.
- **DELETE** `/api/carts/:cid/products/:pid`: Eliminar un producto de un carrito.

## Contribuir

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar este proyecto o quieres corregir algún error, puedes hacer un **fork** del repositorio y enviar un **pull request**.

### Pasos para contribuir:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b mi-rama`).
3. Realiza tus cambios y haz commit (`git commit -am 'Agregué una nueva funcionalidad'`).
4. Haz push de tus cambios (`git push origin mi-rama`).
5. Crea un pull request desde tu rama.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

¡Gracias por tu interés en el proyecto y por visitar MundoManga! 🚀 
