const listOfItems = document.querySelector('.items');
const cartItemsList = document.querySelector('.cart__items');
const cartSection = document.querySelector('.cart');
const container = document.querySelector('.container');
const data = [];

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
// isso ta bugado
const removeItem = (id) => {
  JSON.parse(localStorage.getItem(data));
  data.forEach((item) => { // a partir daqui nao funciona direito
    if (id === item.id) {
      console.log(id);
      console.log(item.id);
      data.pop(item);
      localStorage.removeItem('selectedItems', JSON.stringify(data));
    }
  });
};

function cartItemClickListener() {
  const select = document.querySelector('ol').addEventListener('click', (event) => {
    event.target.remove();
    console.log(event.target.id);
    removeItem(event.target.id);
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener); // essa linha tá me deixando louco
  return li;
}
// mostra o loading
const showLoading = () => {
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'loading';
  loadingDiv.innerText = 'loading';

  listOfItems.appendChild(loadingDiv);
};
// remove o loading
const removeLoading = () => {
  const loadingDiv = document.querySelector('.loading');
  loadingDiv.remove();
};
// pega info da api
const fetchItemsPromise = (api, search) => new Promise((resolve, reject) => {
  showLoading();
  fetch(`${api}${search}`)
    .then((response) => {
      if (response.ok) {
      response.json()
        .then((dados) => {            
          // document.querySelector('.loadingDiv').remove();
          removeLoading();
          resolve(dados);
        });
      } else {
          // document.querySelector('.loadingDiv').remove();
          removeLoading();
          reject(new Error('fetch dont work'));
        }
    });
});
// salva o item no storage
const saveItem = ({ id, name, price }) => {
  const item = {
    id,
    name,
    price,
  };
  data.push(item);
  localStorage.setItem('itemCart', JSON.stringify(data));
};

// cria a lista de items
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

const localItemIntoCart = async (object) => {
  const objects = object;
  // const response = await fetchItemsPromise(`${requisition}`, `${item}`);
  objects.forEach((item) => {
    const itemCart = createCartItemElement(
      { sku: item.id, name: item.name, salePrice: item.price },
    );
    itemCart.setAttribute('id', item.id);
    cartItemsList.appendChild(itemCart);
  });
  // console.log(object.length);
};

// bota o item no cart
const itemIntoCart = (api) => {
  listOfItems.addEventListener('click', async (event) => {
    const select = getSkuFromProductItem(event.target.parentElement);    
    const response = await fetchItemsPromise(`${api}`, `${select}`);
    
    const itemCart = createCartItemElement(
      { sku: response.id, name: response.title, salePrice: response.price },
    );
    // adiciona um id para facilitar a vida
    itemCart.setAttribute('id', response.id);

    saveItem({ id: response.id, name: response.title, price: response.price });
    cartItemsList.appendChild(itemCart);
  });
};
// limpa o cart
const clearCart = () => {
  const clearButton = document.querySelector('.empty-cart');

  clearButton.addEventListener('click', () => {
    cartItemsList.querySelectorAll('*')
      .forEach((item) => { 
        item.remove();
        data.pop();
    });
    localStorage.clear();
    console.log(data);
  });
};

// coloca o valor total no carrinho(nao funciona ainda)
const totalValue = () => {
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'total-price';
  loadingDiv.innerText = 'Valor total no carrinho de compras: 0';

  cartSection.insertBefore(loadingDiv, cartSection.children[2]);
};

const parsing = () => {
  const parseStorage = JSON.parse(localStorage.getItem('itemCart'));
  return parseStorage;
};

const verifyLocalStorage = () => {
  const cart = document.querySelector('.cart__items');
  console.log(cart);
  if (localStorage.length !== 0) {
    console.log(localStorage.length);
    const parse = parsing();
    localItemIntoCart(parse);
    // itemIntoCart(requisition);
  }
  // parse.forEach((obj) => console.log(obj));
};

verifyLocalStorage();
createItemsList(apiML, 'action figure');
itemIntoCart(requisition);
cartItemClickListener();
clearCart();
totalValue();
parsing();
