const cartItems = document.querySelector('.cart__items'); 

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
  section.appendChild(createCustomElement('button', 'item__add',
   'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
// req 4 I
const saveCartLocalStorage = () => {
  localStorage.setItem('items', cartItems.innerHTML);
};

// req 3
function cartItemClickListener(event) {
  const cartItem = document.querySelector('.cart__item'); // seleciona item no carrinho
  cartItem.remove(event.target); // usa metodo 'remove'
  saveCartLocalStorage();
}

// req 4 II
function addCartToLocalStorage() {
  const items = localStorage.getItem('items');
  cartItems.innerHTML = items; // const cartItems declarada la no inicio do script
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// req 1
const criaLista = async () => {
  const query = 'computador';

 const endopoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
 const request = await fetch(endopoint);
 const resposta = await request.json();
 const resultado = resposta.results;

 const sectionItems = document.querySelector('.items');
 resultado.forEach(({ title, id, thumbnail }) => {
   sectionItems.appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail }));
 });
};

// req 2
const addCart = async () => { 
 const btnItemAdd = document.querySelectorAll('.item__add'); // pega os botoes 'adicionar ao carrinho'
 btnItemAdd.forEach((btn) => { // para cada botao adiciona um escutador
btn.addEventListener('click', async (eventAssync) => { // ao clicar teremos um evento assincrono, uma promise
const itemID = getSkuFromProductItem(eventAssync.target.parentElement); 
const endopoint = `https://api.mercadolibre.com/items/${itemID}`;
const request = await fetch(endopoint);
const response = await request.json();
const item = { // destructuring - pega no json os dados q precisamos nome, id, valor (createCartItemElement)
  sku: response.id,
  name: response.title,
  salePrice: response.price,
};
cartItems.appendChild(createCartItemElement(item));
saveCartLocalStorage();
});
 }); 
}; 

// req 5
// req 6
const limpaCarrinho = document.querySelector('.empty-cart');
limpaCarrinho.addEventListener('click', () => {
cartItems.innerHTML = ' ';
});

window.onload = async () => {
 await criaLista(); 
 await addCart();
 addCartToLocalStorage();
};