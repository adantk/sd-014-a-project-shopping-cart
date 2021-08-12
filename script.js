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

function cartItemClickListener(event) {
  // coloque seu código aqui
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

const addToCart = (event) => {
  if (event.target.className !== 'item__add') return;
  const itemSection = event.target.parentElement;
  const itemSku = getSkuFromProductItem(itemSection);
  const { id, name, price } = fetchCartItem(itemSku);

  const item = createCartItemElement({ sku: id, name, salePrice: price });
  const cart = document.querySelector('.cart__items');

  cart.appendChild(item);
};

const addEventToList = () => {
  const list = document.querySelector('.items');
  list.addEventListener('click', addToCart);
};

window.onload = () => { 
  createHTMLList()
  .then(() => addEventToList());
};
