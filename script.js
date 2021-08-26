const cartItems = '.cart__items';
const orderTotal = () => {
  let total = 0;
  const listItem = document.querySelectorAll('.cart__item');
  listItem.forEach((element) => {
    total += parseFloat(element.getAttribute('price'));
  });
  const elementTotalOrder = document.getElementById('total-order1');
  elementTotalOrder.innerText = total;
};
const saveLocalStorage = () => {
  const listCartItems = document.querySelector(cartItems);
  localStorage.setItem('listCart', listCartItems.innerHTML);
  orderTotal();
};
const loading = () => {
  const elementSpan = document.createElement('span');
  elementSpan.className = 'loading';
  elementSpan.innerText = 'loading...';
};
const stopLoading = () => {
  document.querySelector('.loading').remove();
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  document.querySelector('.items').appendChild(section);
  // return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener() {
  // coloque seu código aqui
  document.querySelector(cartItems).addEventListener('click', (event) => {
    event.target.remove();
    saveLocalStorage();
  });
  // orderTotal();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.setAttribute('price', salePrice);
  li.addEventListener('click', cartItemClickListener);
  document.querySelector(cartItems).appendChild(li);
  saveLocalStorage();
  // return li;
  // orderTotal();
  // let listOl = document.querySelector('.cart__items');
  // console.log(listOl.innerHTML);
  // let listItem = document.querySelectorAll('.cart_item');
  // console.log(listItem[1]);
}
const fetchItemMl = async (itemId) => {
  // loading();
  const responseRaw = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const responseJson = await responseRaw.json();
  const { id: sku, title: name, price: salePrice } = responseJson;
  createCartItemElement({ sku, name, salePrice });
  // stopLoading();
};
const addListenerToButtons = () => {
  document.querySelectorAll('.item__add').forEach((item) => {
    item.addEventListener('click', (event) => {
      fetchItemMl(event.target.parentElement.firstChild.innerText);
    });
  });
};

const fetchListMl = async () => {
  loading();
  const responseRaw = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const responseJson = await responseRaw.json();
  const arrayProducts = responseJson.results;
  arrayProducts.forEach(({ id: sku, title: name, thumbnail: image }) => {
    createProductItemElement({ sku, name, image });
  });
  stopLoading();
  addListenerToButtons();
  // orderTotal();
};

const loadLocalStorage = () => {
  const listLocalStorage = localStorage.getItem('listCart');
  const listCartItems = document.querySelector(cartItems);
  listCartItems.innerHTML = listLocalStorage;
  orderTotal();
};

const emptyCart = () => {
  const buttonEmpty = document.querySelector('.empty-cart');
  buttonEmpty.addEventListener('click', () => {
    document.querySelector(cartItems).innerHTML = '';
    saveLocalStorage();
  }); 
};
window.onload = () => { 
  fetchListMl();
  loadLocalStorage();
  cartItemClickListener();
  emptyCart();
};
