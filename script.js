let cartItems = document.querySelector('.cart__items');

function actualizeCartItems() {
  cartItems = document.querySelector('.cart__items');
  localStorage.setItem('cartItems', cartItems.innerHTML);
}

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

function createProductItemElement({
  sku,
  name,
  image,
}) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  actualizeCartItems();
}

function createCartItemElement({
  sku,
  name,
  salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = () => { 
  const savedItems = localStorage.getItem('cartItems');
  console.log(savedItems);
  cartItems.innerHTML = savedItems;
};

function buttonToAdd() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      actualizeCartItems();
      const id = event.target.parentNode.children[0].innerText;
      fetch(`https://api.mercadolibre.com/items/${id}`)
        .then((response) => response.json())
        .then((response) => {
          const item = {
            sku: response.id,
            name: response.title,
            salePrice: response.price,
          };
          cartItems.appendChild(createCartItemElement(item));
          actualizeCartItems();
        });
    });
  });
}

function fetchMercadoLivre() {
  const itemsHTML = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((response) => {
      response.results.forEach((result) => {
        itemsHTML.appendChild(createProductItemElement({
          sku: result.id,
          name: result.title,
          image: result.thumbnail,
        }));
      });
    })
    .then(() => {
      buttonToAdd();
    });
}

fetchMercadoLivre();