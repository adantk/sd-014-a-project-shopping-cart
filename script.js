const CartItems = document.querySelector('.cart__items');

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

function apagarCarrinho() {
  const button = document.querySelector('.empty-cart');

  button.addEventListener('click', () => {
    CartItems.innerText = '';
    localStorage.clear();
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
  
function cartItemClickListener(event) {
  // coloque seu código aqui
  const target = event.target.classList;  
 if (target.contains('cart__item')) {    
  CartItems.removeChild(event.target);
 }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.id = salePrice;
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function criarCarrinho() {
  const botao = document.querySelectorAll('.item__add');
  botao.forEach((itens) => {
  itens.addEventListener('click', async (event) => {
    const elemento = event.target.parentElement;
    const sku = elemento.firstChild.innerText;   
    const aPis = await fetch(`https://api.mercadolibre.com/items/${sku}`); 
    const requestJson = await aPis.json();
    CartItems.appendChild(createCartItemElement({ 
      sku: requestJson.id, 
      name: requestJson.title, 
      salePrice: requestJson.price }));  
      localStorage.setItem('storage', CartItems.innerHTML);
    });
   });  
}

function getLocalStorage() {  
  const salvo = localStorage.getItem('storage');
  CartItems.innerHTML = salvo;
  const li = document.querySelectorAll('.cart__item');
  li.forEach((lista) => lista.addEventListener('click', cartItemClickListener)); 
}

const getFetchComputador = async () => {
  const loading = createCustomElement('h1', 'loading', '...loading');
  document.body.appendChild(loading);
 const requisição = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const responseJson = await requisição.json();
  responseJson.results.filter((array) => (document.querySelector('.items')
  .appendChild(createProductItemElement({  
     sku: array.id,   
     name: array.title,   
      image: array.thumbnail }))));      
      criarCarrinho(); 
      loading.remove();
    };

window.onload = () => {  
    getFetchComputador();
    getLocalStorage();
    apagarCarrinho();
   };