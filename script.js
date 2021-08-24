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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener() {
  // coloque seu código aqui
  document.querySelector('.cart__items').addEventListener('click', event => {
    event.target.remove();
    saveLocalStorage();
  });
  // orderTotal();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.setAttribute("price", salePrice);
  li.addEventListener('click', cartItemClickListener);
  document.querySelector('.cart__items').appendChild(li);
  saveLocalStorage();
  // return li;
  // orderTotal();
  // let listOl = document.querySelector('.cart__items');
  // console.log(listOl.innerHTML);
  // let listItem = document.querySelectorAll('.cart_item');
  // console.log(listItem[1]);
}

const fetchListMl = async () => {
  const responseRaw = await fetch("https://api.mercadolibre.com/sites/MLB/search?q=computador");
  const responseJson = await responseRaw.json();
  const arrayProducts = responseJson.results;
  arrayProducts.forEach(({ id: sku, title: name, thumbnail: image }) => {
    createProductItemElement({sku, name, image});
  });
  addListenerToButtons();
  // orderTotal();
};
const fetchItemMl = async (itemId) => {
  const responseRaw = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const responseJson = await responseRaw.json();
  let { id: sku, title: name, price: salePrice } = responseJson;
  createCartItemElement({sku, name, salePrice});
};

const addListenerToButtons = () => {
  document.querySelectorAll('.item__add').forEach(item => {
    item.addEventListener('click', event => {
      fetchItemMl(event.target.parentElement.firstChild.innerText);
    })
  })
}
const saveLocalStorage = () => {
  let listCartItems = document.querySelector('.cart__items');
  localStorage.setItem("listCart", listCartItems.innerHTML);
  orderTotal();
}
const loadLocalStorage = () => {
  let listLocalStorage = localStorage.getItem("listCart");
  let listCartItems = document.querySelector('.cart__items');
  listCartItems.innerHTML = listLocalStorage;
  orderTotal();
}
const orderTotal = () => {
  let total = 0;
  let listItem = document.querySelectorAll('.cart__item');
  listItem.forEach((element) => {
    total += parseFloat(element.getAttribute('price'));
  });
  const elementTotalOrder = document.getElementById('total-order1');
  elementTotalOrder.innerText = total;
}
const emptyCart = () => {
  buttonEmpty = document.querySelector('.empty-cart');
  buttonEmpty.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    saveLocalStorage();
  }) 
}
window.onload = () => { 
  fetchListMl();
  loadLocalStorage();
  cartItemClickListener();
  emptyCart();
};
