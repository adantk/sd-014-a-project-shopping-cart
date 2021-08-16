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
  image }) {
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
  document.querySelector('.cart__items').removeChild(event.target); // Ao clicar no item do carrinho o mesmo é removido!
}

function createCartItemElement({
  sku,
  name,
  salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchMercadoLivre = async (QUERY) => {
  const mlApi = `https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`;
  const request = await fetch(mlApi);
  const data = await request.json();
  const result = data.results;

  await result.forEach((i) => document.querySelector('.items')
  .appendChild(createProductItemElement({
    sku: i.id,
    name: i.title,
    image: i.thumbnail,
  })));
};

const fetchItem = () => {
  const btn = document.querySelectorAll('.item__add');

  btn.forEach((list) => { 
    list.addEventListener('click', async (event) => { 
      const targetIdProduct = event.target.parentElement.firstChild.innerHTML; 
      const cart = document.querySelector('.cart__items');
      const fetchItemMl = await fetch(`https://api.mercadolibre.com/items/${targetIdProduct}`)
        .then((response) => response.json());
      cart.appendChild(createCartItemElement({ 
        sku: fetchItemMl.id,
        name: fetchItemMl.title,
        salePrice: fetchItemMl.price,
      }));
    });
  });
};

window.onload = async () => {
  await fetchMercadoLivre('computador');
  await fetchItem();
  cartItemClickListener();
};