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

const updateTotalPrice = async () => {
  const cartListItems = Array.from(document.querySelectorAll('.cart__item'));
  const cartStrings = cartListItems.map((item) => item.innerText);
  const pricesList = cartStrings.map((string) => +string.split('PRICE: $')[1]);
  const totalPrice = pricesList.reduce((sum, current) => sum + current, 0);

  const totalPriceText = document.querySelector('.total-price');
  totalPriceText.innerText = totalPrice;
};

function cartItemClickListener(event) {
  const cartList = event.target.parentElement;
  cartList.removeChild(event.target);
  updateTotalPrice()
  .then(() => localStorage.setItem('localCart', cartList.innerHTML));
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchJSONResponse = async () => {
  const QUERY = 'computador';
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`;

  try {
   const response = await fetch(url); 

   if (response.ok) {
     const jsonResponse = await response.json();
    return jsonResponse;
   }
  } catch (error) {
    console.log(error);
  }
};

const getProductsList = async () => {
  try {
    const JSONResponse = await fetchJSONResponse();
    const list = JSONResponse.results;
    return list;
  } catch (error) {
    console.log(error);
  }
};

const createHTMLList = async () => {
  try {
    const productList = await getProductsList();
    
    productList.forEach(({ id, title, thumbnail }) => {
      const product = createProductItemElement({ sku: id, name: title, image: thumbnail });
      const itemsSection = document.querySelector('.items');
      itemsSection.appendChild(product);
    });
  } catch (error) {
    console.log(error);
  }
};

const fetchCartItem = async (sku) => {
  const ItemID = sku;
  const url = `https://api.mercadolibre.com/items/${ItemID}`;

  try {
    const response = await fetch(url); 
 
    if (response.ok) {
      const jsonResponse = await response.json();
     return jsonResponse;
    }
   } catch (error) {
     console.log(error);
   }
};

const addToCart = async (event) => {
  if (event.target.className !== 'item__add') return;

  const itemSection = event.target.parentElement;
  const itemSku = getSkuFromProductItem(itemSection);

  const { id, title, price } = await fetchCartItem(itemSku);

  const item = createCartItemElement({ sku: id, name: title, salePrice: price });
  const cart = document.querySelector('.cart__items');

  cart.appendChild(item);
  await updateTotalPrice();
  localStorage.setItem('localCart', cart.innerHTML);
};

const addEventToList = () => {
  const list = document.querySelector('.items');
  list.addEventListener('click', addToCart);
};

const getLocalCart = async () => {
    const cart = document.querySelector('.cart__items');
    cart.innerHTML = localStorage.getItem('localCart');
    Array.from(cart.children).forEach((item) => {
      item.addEventListener('click', cartItemClickListener);
    });
    await updateTotalPrice();
};

const emptyCart = async () => {
  const cartToEmpty = document.querySelector('.cart__items');
  cartToEmpty.innerHTML = '';
  localStorage.removeItem('localCart');
  await updateTotalPrice();
};

window.onload = () => { 
  document.querySelector('.empty-cart').addEventListener('click', emptyCart);
  getLocalCart();

  createHTMLList()
  .then(() => addEventToList())
  .catch(() => window.onload());
};
