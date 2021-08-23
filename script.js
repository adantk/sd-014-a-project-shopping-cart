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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getAPI = async () => {
  const responseRaw = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const responseJson = await responseRaw.json();
  const removeLoading = await document.querySelector('.loading').remove();
  responseJson.results.forEach((result) => document.querySelector('.items')
  .appendChild(createProductItemElement({
    sku: result.id, 
    name: result.title,
    image: result.thumbnail })));            
};

const addItem = (ItemID) => {
  fetch(`https://api.mercadolibre.com/items/${ItemID}`)
  .then((response) => response.json().then((data) => document.querySelector('.cart__items')
  .appendChild(createCartItemElement(data))));
};
document.addEventListener('click', (event) => {
if (event.target.classList.contains('item__add')) {
return addItem(getSkuFromProductItem(event.target.parentElement));
}
});
window.onload = () => { getAPI(); };