const storageKey = 'ol-content';
const cartSection = document.querySelector('.cart');
const itemsSection = document.querySelector('.items');
const cartItemsSection = document.querySelector('.cart__items');
const emptyCartButton = document.querySelector('.empty-cart');
const totalPriceSpan = document.querySelector('.total-price');

function deleteLoading() {
  cartSection.removeChild(document.querySelector('.loading'));
}

function createLoading() {
  const loadingSpan = document.createElement('span');
  loadingSpan.innerText = 'Carregando página ...';
  loadingSpan.className = 'loading';
  cartSection.appendChild(loadingSpan);  
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

function createProductItemElement({ sku, name, image, price }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__price', `$${price.toFixed(2)}`));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

function testReponse(response) {
  if (response.ok) {
    return response.json();
  }
  throw new Error(`URL: ${response.url} - STATUS: ${response.status}`);
}

async function getComputerItemFromMlApi(sku) {
  createLoading();
  return fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((response) => testReponse(response));
}

async function getComputersFromMlApi(query) {
  createLoading();
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${query}`)
    .then((response) => testReponse(response))
    .then((json) => json.results);
}

function sum(ol) {    
  let total = 0;
  ol.childNodes.forEach((li) => {
    total += Number(li.lastChild.innerText); // span
  });
  total = Math.round(100 * total) / 100;
  totalPriceSpan.innerText = total;
}

function cartItemClickListener(event) {  
  event.currentTarget.remove();
  localStorage.setItem(storageKey, cartItemsSection.innerHTML);
  sum(cartItemsSection);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';  
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $`;  
  const salePriceSpan = createCustomElement('span', 'sale-price', salePrice);  
  li.append(salePriceSpan);
  li.addEventListener('click', cartItemClickListener);  
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function addItemToCart(event) {  
  const skuItem = getSkuFromProductItem(event.target.parentElement);
  getComputerItemFromMlApi(skuItem)
    .then(({ id: sku, title: name, price: salePrice }) => {
      const li = createCartItemElement({ sku, name, salePrice });
      cartItemsSection.appendChild(li);
      localStorage.setItem(storageKey, cartItemsSection.innerHTML);
      sum(cartItemsSection);
    })
    .catch((error) => window.alert(`ERRO: ${error.message}`))
    .then(() => deleteLoading());
}

function getLocalStorage() {  
  cartItemsSection.innerHTML = localStorage.getItem(storageKey)
    ? localStorage.getItem(storageKey)
    : '';
  cartItemsSection.childNodes.forEach((li) =>
    li.addEventListener('click', cartItemClickListener));
  sum(cartItemsSection);
}

function clearAll() {  
  cartItemsSection.innerHTML = '';  
  totalPriceSpan.innerText = 0;
  localStorage.removeItem(storageKey);
}

window.onload = () => {  
  emptyCartButton.addEventListener('click', clearAll);
  getLocalStorage();  
  getComputersFromMlApi('computador')
    .then((computers) =>
    computers.forEach(({ id: sku, title: name, thumbnail: image, price }) => {
        const productItemSection = createProductItemElement({ sku, name, image, price });        
        productItemSection.lastChild.addEventListener('click', addItemToCart); // button
        itemsSection.appendChild(productItemSection);        
      }))    
    .catch((error) => window.alert(`ERRO: ${error.message}`))
    .then(() => deleteLoading());   
};
