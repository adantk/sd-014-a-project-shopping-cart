const listOfItems = document.querySelector('.items');
const cartItemsList = document.querySelector('.cart__items');
const apiML = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const requisition = 'https://api.mercadolibre.com/items/';

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

function cartItemClickListener() {
  const select = document.querySelector('ol').addEventListener('click', (event) => {
    event.target.remove();
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchItemsPromise = (api, search) => new Promise((resolve, reject) => {
  fetch(`${api}${search}`)
    .then((response) => {
      if (response.ok) {
      response.json()
        .then((dados) => {            
            // console.log(dados.results);
            resolve(dados);
        });
      } else {
          reject(new Error('fetch dont work'));
        }
    });
});

const createItemsList = async (api, search) => {
  const jsonResponse = await fetchItemsPromise(`${api}`, `${search}`);
  const resultResponse = jsonResponse.results;
  const objArray = Object.values(resultResponse);

  objArray.forEach((element) => {
    const item = createProductItemElement(
      { sku: element.id, name: element.title, image: element.thumbnail },
    );
    listOfItems.appendChild(item);
  });
};

const itemIntoCart = (api) => {
  listOfItems.addEventListener('click', async (event) => {    
    const select = getSkuFromProductItem(event.target.parentElement);    
    const response = await fetchItemsPromise(`${api}`, `${select}`);
      
    const itemCart = createCartItemElement(
      { sku: response.id, name: response.title, salePrice: response.price },
    );
    cartItemsList.appendChild(itemCart);
  });
};

const clearCart = () => {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    cartItemsList.querySelectorAll('*').forEach((item) => item.remove());
  });
};

createItemsList(apiML, 'skate');
itemIntoCart(requisition);
// clearCart(event);
cartItemClickListener();
clearCart();