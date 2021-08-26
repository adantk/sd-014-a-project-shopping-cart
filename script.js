// const carrinhoList = document.querySelector('.cart__items');
const CartItemsId = '.cart__items';
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

// requesito 4
const saveCart = () => {
  const cartList = document.querySelector(CartItemsId);
  localStorage.setItem('cartItems', cartList.innerHTML);
}; 

function cartItemClickListener(event) {
  // coloque seu código aqui
  console.log(event.target);
  event.target.remove();  
}
const loadCart = () => {
  const cartList = document.querySelector(CartItemsId);
  const cartItems = localStorage.getItem('cartItems');
  console.log(cartItems);
  if (cartItems) {
    cartList.innerHTML = cartItems;  
    cartList.childNodes.forEach((cartItem) => {
      cartItem.addEventListener('click', cartItemClickListener);
    });
  }
};
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
  }

  const ApiBut = async (ids) => {
  const urlBut = `https://api.mercadolibre.com/items/${ids}`;
  const getFechBut = await fetch(urlBut);
  const getJsonBut = await getFechBut.json();
  const olCartItem = document.querySelector(CartItemsId);
  const { id, title, price } = getJsonBut;
  olCartItem.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
  saveCart();
  };

  function btnAddCar() {
    const botaoItem = document.querySelectorAll('.item__add');    
    botaoItem.forEach((botao) => botao.addEventListener('click', (event) => {
       ApiBut(event.target.parentElement.firstChild.innerText);
    }));
  }

// requesito 1
const ApiCall = async () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador'; 
  const getFech = await fetch(url);
  const getJson = await getFech.json();
  const itemSel = document.querySelector('.items');
  getJson.results.forEach((result) => {
    itemSel.appendChild(createProductItemElement(result));
      });
  btnAddCar();
};

window.onload = () => {
  ApiCall();
  loadCart();
 };
