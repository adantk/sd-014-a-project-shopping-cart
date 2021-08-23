const url = "https://api.mercadolibre.com/sites/MLB/search?q=";
const itemUrl = "https://api.mercadolibre.com/items/";

function fetchMercadoAPI(product) {
  const itemClass = document.querySelector(".items");
  fetch(`${url}${product}`).then((response) => {
    response.json().then((dataML) => {
      dataML.results.forEach((resultsML) => {
        const { id: sku, title: name, thumbnail: image } = resultsML;
        itemClass.appendChild(createProductItemElement({ sku, name, image }));
      });
    });
  });
}

function createProductImageElement(imageSource) {
  const img = document.createElement("img");
  img.className = "item__image";
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement("section");
  section.className = "item";

  section.appendChild(createCustomElement("span", "item__sku", sku));
  section.appendChild(createCustomElement("span", "item__title", name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement("button", "item__add", "Adicionar ao carrinho!"))
    .addEventListener('click', addCart) //Ja cria com um event listener
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector("span.item__sku").innerText;
}



function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement("li");
  li.className = "cart__item";
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener("click", cartItemClickListener);
  return li;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  return event.target.parentNode.removeChild(event.target);
}

// function loadLocalStorage() {
//   const getCart = localStorage.getItem('cartt');
//   document.querySelector('.cart_items').value = getCart
// }

const loadLocalStorage = () => {
  const getCart = document.querySelector('.cart')
  getCart.querySelector('.cart_items')
  getCart.innerHTML = localStorage.getItem('cartt')
}
// https://www.w3schools.com/jsref/met_storage_setitem.asp
// https://developer.mozilla.org/pt-BR/docs/Web/API/Storage/getItem

const addCart = async (event) => {
  const clickk = event.target.parentNode;
  const itemID = getSkuFromProductItem(clickk);
  await fetch(`${itemUrl}${itemID}`)
    .then((response) => response.json())
    .then((itemData) => {
      const { id: sku, title: name, price: salePrice } = itemData;
      const getCartList = document.querySelector(".cart")
      getCartList.querySelector('cart_items');
      getCartList.appendChild(createCartItemElement({ sku, name, salePrice }));
      localStorage.setItem('cartt', getCartList.innerHTML);
    });
};

window.onload = async () => {
  await fetchMercadoAPI("computador");
  await loadLocalStorage();
};
