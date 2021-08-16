const items = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
const clearCart = document.querySelector('.empty-cart');
let cart;

function emptyCart() {
  clearCart.addEventListener('click', () => {
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach((item) => { 
    item.parentNode.removeChild(item); 
    // Para cada LI, chama o pai e exclui um filho, resultando na remoção de todos os itens
  });
});
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

function saveCart() {
  localStorage.setItem('saveCart', cartItems.innerHTML);
}

function cartItemClickListener(event) {
  const clicado = event.target; // Armazena a li clicada na variavel
  cartItems.removeChild(clicado); // Apaga a filha de ol clicada
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener); // Chama a callback ao clicar em alguma li
  return li; // retorna uma li com o id, nome e preço do produto clicado
}

async function getCart(itemId) {
  const api = await fetch(`https://api.mercadolibre.com/items/${itemId}`); // retorna a api do produto encontrado pela id
  const json = await api.json();
  cart = {
    id: json.id,
    title: json.title,
    price: json.price,
  }; // Objeto para eu trabalhar apenas com o que eu preciso da api do produto
  const addCart = document.querySelector('.cart__items');
  addCart.appendChild(createCartItemElement(cart)); // chama como filho o retorno da createCart(...) entregando meu objeto cart como parametro
  saveCart(); // Salva os itens do carrinho no local storage
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText; // Pega o id do span/item__sku dentro daquela section clicada
}

function getId(event) {
  const id = getSkuFromProductItem(event.target.parentNode); 
  // Pega o pai do elemento button clicado e passa como parametro para getSku(...)
  getCart(id); // chama getCart com o id encontrado
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  // Restringe o results para apenas as chaves id, title e thumbnail
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(button);
  button.addEventListener('click', getId); // Adiciona eventListener nos botões criados e chama getId

  return section;
}

async function getComputer(query) {
  const api = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`); // Busca api
  const json = await api.json(); // Deixa a API 'legivel' pro JS com o Json, transformando ela em objeto
  json.results.forEach((result) => items.appendChild(createProductItemElement(result)));
  // mapeia os results e coloca como parametro de createProductItemElement deixando ela como filha de items
}

function loadCart() {
  if (localStorage.length > 0) {
    cartItems.innerHTML = localStorage.getItem('saveCart'); 
    // Se houver algo em local storage, adiciona o HTML ao ol do carrinho
  }
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach((item) => item.addEventListener('click', cartItemClickListener)); 
  // Carrega o eventListener para os li's salvos do carrinho
  emptyCart();
}

window.onload = () => {
  getComputer('computador');
  loadCart();
};