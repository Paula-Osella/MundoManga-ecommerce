const createProductHTML = (product) => {
  const productImage = product.thumbnails?.length
    ? `<img src="${product.thumbnails[0]}" alt="Imagen de ${product.title}" style="width: 50px;">`
    : "";

  return `
    <li class="product-item">
      <div class="product-details">
        <h5>${product.category}</h5>
        <h5>${product.code}</h5>
        <h4>${product.title}</h4>
        ${productImage}
        <h4>$${product.price}</h4>
        <p>Stock: ${product.stock}</p>
        <p>${product.status ? "Disponible" : "No Disponible"}</p>
      </div>
      <button class="btn-view-details" data-id="${product.id}">Ver Detalle</button>
      <div class="product-extra-details" id="details-${product.id}" style="display:none;">
        <p>${product.description}</p>
      </div>
    </li>`;
};

const loadProductsList = async () => {
  try {
    const response = await fetch("/api/products", { method: "GET" });
    const products = await response.json();

    const productsList = document.getElementById("products-list");
    productsList.innerHTML = "";

    if (Array.isArray(products) && products.length > 0) {
      products.forEach((product) => {
        productsList.innerHTML += createProductHTML(product);
      });
      attachListenersToButtons();
    } else {
      displayError("No se encontraron productos...");
    }
  } catch (error) {
    displayError("Hubo un problema al cargar la lista de productos...");
  }
};

const attachListenersToButtons = () => {
  document.querySelectorAll(".btn-view-details").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.id;
      const details = document.getElementById(`details-${productId}`);
      details.style.display = details.style.display === "none" ? "block" : "none";
    });
  });
};

const displayError = (message) => {
  const messageContainer = document.getElementById("message-container");
  messageContainer.textContent = message;
};

document.getElementById("btn-refresh-products-list").addEventListener("click", loadProductsList);
document.addEventListener("DOMContentLoaded", loadProductsList);
