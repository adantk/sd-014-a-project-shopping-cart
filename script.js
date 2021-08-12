function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
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
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.parentNode.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getComputersFromMlApi() {
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((response) => response.json())
  .then((json) => json.results);
}

function getComputerItemFromMlApi(sku) {
  return fetch(`https://api.mercadolibre.com/items/${sku}`)
  .then((response) => response.json());  
}

function addItemToCart(event) {
  const cart = document.querySelector('.cart__items');
  const skuItem = event.target.parentElement.firstChild.innerText;
  getComputerItemFromMlApi(skuItem)  
  .then(({ id: sku, title: name, price: salePrice }) => {
    const li = createCartItemElement({ sku, name, salePrice });
    cart.appendChild(li);
  });  
}

window.onload = () => {
  const items = document.querySelector('.items');
  getComputersFromMlApi()
  .then((computers) => computers.forEach(({ id: sku, title: name, thumbnail: image }) => {
    const section = createProductItemElement({ sku, name, image });
    // console.log(section);
    items.appendChild(section);
    items.lastChild.lastChild.addEventListener('click', addItemToCart);
  }));
};
