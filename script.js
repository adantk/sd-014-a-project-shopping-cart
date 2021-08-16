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
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Requisito 4 parte 1
const saveCart = () => {
  // localStorage.setItem('savedCartItems', JSON.stringify(cartItems.innerHTML));
  localStorage.setItem('savedCartItems', cartItems.innerHTML); // setItem armazena/salva um item no local storage
};
// Source: https://www.devmedia.com.br/trabalhando-com-html5-local-storage-e-json/29045

// Requisito 1
const getItems = async () => {
  const query = 'computador';
  // const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;

  const request = await fetch(endpoint);
  const response = await request.json();
  const getResult = response.results;

  const items = document.querySelector('.items');
  getResult.forEach(({ title, id, thumbnail }) => {
    items.appendChild(createProductItemElement({
      name: title,
      sku: id,
      image: thumbnail,
    }));
  });
};
// Agradeço ao Matheus Martino pela monitoria de revisão do Bloco 9!

// Requisito 3
function cartItemClickListener(event) {
  cartItems.removeChild(event.target);
  saveCart();
}

// Requisito 4 parte 2
const loadingCart = () => {
  cartItems.innerHTML = localStorage.getItem('savedCartItems'); 
  const cartItem = document.querySelectorAll('.cart__item');
  // getItem recupera ou acessa o item a partir da sua chave
  // .innerHTML troca o conteúdo do elemento pelo que foi salvo no setItem
  cartItem.forEach((item) => item.addEventListener('click', cartItemClickListener));
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requisito 2
const addToCart = async () => {
  const itemList = document.querySelectorAll('.item__add');
  console.log(itemList);
  itemList.forEach((buttonItem) => { // Adicionando um escutador de eventos para cada elemento (botão) da minha lista de itens
    buttonItem.addEventListener('click', async (event) => {
    const itemID = getSkuFromProductItem(event.target.parentElement);
    const endpoint = `https://api.mercadolibre.com/items/${itemID}`;
    
    const request = await fetch(endpoint);
    const response = await request.json();
    const item = { // Adicionando as informações do produto ao carrinho 
      sku: response.id,
      name: response.title,
      salePrice: response.price,
    };
    cartItems.appendChild(createCartItemElement(item));
    saveCart();
    });
  });
};

// Requisito 5

// Requisito 6
const emptyCart = document.querySelector('.empty-cart');
emptyCart.addEventListener('click', () => {
  cartItems.innerHTML = '';
  localStorage.clear();
});

window.onload = async () => { // async/await para organizar o tempo entre criar a lista de produtos, adicionar botões e adicionar produtos ao carrinho 
  await getItems(); 
  addToCart();
  loadingCart();
};
