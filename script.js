// por necessidade de reutilizar o mesmo caminho, e evitar repetição
const currentCart = document.querySelector('.cart__items');
const itemsFromSection = document.querySelector('.items');
const saveToLocalStorage = () => {
  localStorage.setItem('savedCart', currentCart.innerHTML);
};
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
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
  event.currentTarget.remove();
  saveToLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// de alguma forma a função abaixo não passa no teste
// diz gerar 99 ao inves de 50 items mas não consigo descobrir a razão disso acontecer
async function fetchComputers() {
  const api = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const resp = await api.json();
  const result = resp.results;
  let counter = 0;
  result.every((element) => {
    if (counter >= 50) return false;
    counter += 1;
    console.log(counter);
   return document.querySelector('.items').appendChild(createProductItemElement(element));
 });
}
async function fetchProduct(id) {
  const apiResult = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const respToJson = await apiResult.json();
  return respToJson;
}
   const cart = document.querySelector('.cart__items');
   async function addToCart() {
   await fetchComputers();
   const eventAdd = document.querySelectorAll('.item__add');
   eventAdd.forEach((item) => item.addEventListener('click', async (event) => {
     // ótima dica abaixo da Jéssica Grunewald me ajudou bastante em como selecionar o id 
     // bem como do Márcio luiz em como targetar a lista do carrinho
   const itemID = getSkuFromProductItem(event.target.parentElement);
   // agradecimentos ao Gabriel por me explicar como fazer um comportamento assincrono 
   const productInfo = await fetchProduct(itemID);
   // const productToJson = await productInfo.json();
   const createdProduct = createCartItemElement(productInfo);
    cart.appendChild(createdProduct);
  }));
  saveToLocalStorage();
}
const getFromLocalStorage = () => {
  itemsFromSection.innerHTML = localStorage.getItem('savedCart');
  itemsFromSection.childNodes.forEach((li) => li.addEventListener('click', 
  cartItemClickListener));
};
const emptyCart = () => {
  const cleatButton = document.querySelector('.empty-cart');
  cleatButton.addEventListener('click', () => {
  currentCart.innerHTML = '';
  localStorage.clear();
  saveToLocalStorage(); 
  });
};
window.onload = async () => {
  await fetchComputers();
  getFromLocalStorage();
  await addToCart();
  emptyCart();
};
