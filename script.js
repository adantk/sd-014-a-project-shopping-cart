function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText, sku) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  e.setAttribute('onclick', `apiRequ('${sku}')`);
  return e;
}

function createProductItemElement({ // usado no item 1
  id: sku,
  title: name,
  thumbnail: image,
}) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku));
  return section;
}
async function api(query) { // item 1
  const arrayApi = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((mApi) => mApi.json())
    .then((mApiJson) => mApiJson.results);

  arrayApi.forEach((item) => document.getElementsByClassName('items')[0]
    .appendChild(createProductItemElement(item)));
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) { // item 3
  event.target.remove();
}

function createCartItemElement({ // usado no item 2
  id: sku,
  title: name,
  price: salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
async function apiRequ(id) { // item 1
  await fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((mApi) => mApi.json())
    .then((isso) => document.getElementsByClassName('cart__items')[0]
      .appendChild(createCartItemElement(isso)));
}

window.onload = () => {
  api('computador');
};