const updateTotalPrice = (price) => {
  const totalPrice = document.querySelector('.total-price');
  const parsedTotalPrice = parseFloat(totalPrice.innerHTML);
  const parsedPrice = parseFloat(price);
  totalPrice.innerText = parsedPrice + parsedTotalPrice;
};

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
  const price = event.target.innerText.split('$')[1];
  updateTotalPrice(-price);
  event.target.remove();
  saveCart();
}
const loadCart = () => {
  const cartList = document.querySelector(CartItemsId);
  const cartItems = localStorage.getItem('cartItems');
    if (cartItems) {
    cartList.innerHTML = cartItems;  
    cartList.childNodes.forEach((cartItem) => {
      cartItem.addEventListener('click', cartItemClickListener);
      const price = cartItem.innerText.split('$')[1];
      updateTotalPrice(price);
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
  updateTotalPrice(price);
  };

  function btnAddCar() {
    const botaoItem = document.querySelectorAll('.item__add');    
    botaoItem.forEach((botao) => botao.addEventListener('click', (event) => {
       ApiBut(event.target.parentElement.firstChild.innerText);
    }));
  }

// requesito 1
const ApiCall = async () => {
  const itemSel = document.querySelector('.items');
  const loadingSection = document.createElement('section');
  loadingSection.innerHTML = 'loading...';
  loadingSection.classList.add('loading');
  itemSel.appendChild(loadingSection);
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador'; 
  const getFech = await fetch(url);
  const getJson = await getFech.json();
  loadingSection.remove();
  getJson.results.forEach((result) => {
    itemSel.appendChild(createProductItemElement(result));
      });
  btnAddCar();
};
const btnClear = () => {
 const btn = document.querySelector('.empty-cart');
 btn.addEventListener('click', () => {
  const cartList = document.querySelector(CartItemsId);
  cartList.innerHTML = '';
  localStorage.removeItem('cartItems');
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = '0';
 });
};

window.onload = () => {
  ApiCall();
  loadCart();
  btnClear();
 };
