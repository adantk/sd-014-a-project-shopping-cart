const storageKey = 'ol-content';
const cartSection = document.querySelector('.cart');
const itemsSection = document.querySelector('.items');
const cartItemsSection = document.querySelector('.cart__items');
const emptyCartButton = document.querySelector('.empty-cart');
const totalPriceSpan = document.querySelector('.total-price');

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
  // function createProductItemElement(computer) {
  // const { id: sku, title: name, thumbnail: image } = computer;
  
  // const sku = computer.id;
  // const name = computer.title;
  // const image = computer.thumbnail;

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

function sum(ol) {
    // const totalPrice = document.querySelector('.total-price');    
    let total = 0;
    ol.childNodes.forEach((li) => {
      const found = li.querySelector('.sale-price-item').innerText;
      total += Number(found);
    });
    total = Math.round(100 * total) / 100;
    totalPriceSpan.innerText = total;
  }

// function sum(ol) { // ESTA SOLUÇÃO EXIGE OUTRO FORMATO PARA 'li.innerText'
//   // const totalPrice = document.querySelector('.total-price');
//   const regex1 = /([$][1-9])\S+/i;
//   const regex2 = /([1-9])\S+/;
//   let total = 0;
//   ol.childNodes.forEach((li) => {
//     const found = li.innerText.match(regex1);
//     total += Number(found[0].match(regex2)[0]);
//   });
//   total = Math.round(100 * total) / 100;
//   totalPriceSpan.innerText = total;
// }

function cartItemClickListener(event) {
  // const cartItemsSection = document.querySelector(cartItemsSectionClass);
  // console.log(event.target);  // pode ser a <span> da solução li.innerHTML
  // console.log(event.currentTarget); // sempre será a pŕopria <li>
  event.currentTarget.parentElement.removeChild(event.currentTarget);
  localStorage.setItem(storageKey, cartItemsSection.innerHTML);
  sum(cartItemsSection);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');  
  li.className = 'cart__item';
  // li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $ ${salePrice}`;
  const template = `SKU: ${sku} | NAME: ${name} | PRICE: $`;
  const skuAndNameSpan = createCustomElement('span', 'sku-name-item', template);
  // const skuAndNameSpan = createCustomElement('span', 'sku-name-item', `SKU: ${sku} | `);
  // const nameSpan = createCustomElement('span', 'name-item', `NAME: ${name} | PRICE: $`);
  const salePriceSpan = createCustomElement('span', 'sale-price-item', salePrice);  
  li.appendChild(skuAndNameSpan);
  // li.appendChild(skuSpan);
  // li.appendChild(nameSpan);
  li.appendChild(salePriceSpan);
  li.addEventListener('click', cartItemClickListener);
  
  return li;
}

function createLoading() {
  const loadingSpan = document.createElement('span');
  loadingSpan.innerText = 'Carregando página ...';
  loadingSpan.className = 'loading';
  cartSection.appendChild(loadingSpan);  
}

function deleteLoading() {
  cartSection.removeChild(document.querySelector('.loading'));
}

async function getComputersFromMlApi() {
  createLoading();
  return fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((response) => response.json())
    .then((json) => json.results);
}

async function getComputerItemFromMlApi(sku) {
  createLoading();
  return fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((response) => response.json());    
}

function addItemToCart(event) {
  // const cartItemsSection = document.querySelector(cartItemsSectionClass);
  // console.log(event.target);
  // console.log(event.currentTarget);
  // const skuItem = event.target.parentElement.firstChild.innerText; // Seria mais fácil...
  const skuItem = getSkuFromProductItem(event.target.parentElement);
  getComputerItemFromMlApi(skuItem)
    .then(({ id: sku, title: name, price: salePrice }) => {
      const li = createCartItemElement({ sku, name, salePrice });
      cartItemsSection.appendChild(li);
      localStorage.setItem(storageKey, cartItemsSection.innerHTML);
      sum(cartItemsSection);
    })
    .then(() => deleteLoading());
}

function getLocalStorage() {
  // const cartItemsSection = document.querySelector(cartItemsSectionClass);
  cartItemsSection.innerHTML = localStorage.getItem(storageKey)
    ? localStorage.getItem(storageKey)
    : '';
  cartItemsSection.childNodes.forEach((li) =>
    li.addEventListener('click', cartItemClickListener));
  sum(cartItemsSection);
}

function clearAll() {
  // const cartItemsSection = document.querySelector(cartItemsSectionClass);
  cartItemsSection.innerHTML = '';
  // sum(cartItemsSection);  
  totalPriceSpan.innerText = 0;
  localStorage.removeItem(storageKey);
}

window.onload = () => {
  // const items = document.querySelector('.items');
  // document.querySelector(emptyCartClass).addEventListener('click', clearAll);
  emptyCartButton.addEventListener('click', clearAll);
  getLocalStorage();
  getComputersFromMlApi()
    .then((computers) =>
    computers.forEach((computer) => {
        const { id: sku, title: name, thumbnail: image } = computer;        
        // console.log({ sku, name, image });
        const productItemSection = createProductItemElement({ sku, name, image });
        // const section = createProductItemElement(computer);
        // computers.forEach(({ id: sku, title: name, thumbnail: image }) => {
        // const section = createProductItemElement({ sku, name, image });
        productItemSection.lastChild.addEventListener('click', addItemToCart); // button
        itemsSection.appendChild(productItemSection);
        // items.lastChild.lastChild.addEventListener('click', addItemToCart);
      }))
    .then(() => deleteLoading());
};
