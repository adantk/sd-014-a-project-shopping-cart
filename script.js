// const items = document.querySelector('.items');
const cartItems = '.cart__items';

// requisito 4, funcao salvar local storage

const saveLocalStorage = () => {
  const olCart = document.querySelector(cartItems);
  const olHtml = olCart.innerHTML;
  localStorage.setItem('lista', olHtml);
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

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove(); // onde clicar vai remover
  saveLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const API_URL = 'https://api.mercadolibre.com/sites/MLB/search';
const API_ITEM = 'https://api.mercadolibre.com/items/';

// requisito 1
const searchProducts = (product = 'computador') => {
  const loading = document.querySelector('.loading');
  fetch(`${API_URL}?q=${product}`)
    .then((response) => response.json())
    .then((object) => {
      const { results } = object;
      // console.log((results));
      
      results.forEach((result) => {
        const sectionItem = document.querySelector('.items');
        const element = createProductItemElement(result);
        sectionItem.appendChild(element);
        loading.remove(); // remove loading da página
      });
    });
};

// criar funcao que vai importar o item para o carrinho de compras
const addItemCart = (element) => {
  const elementoPai = element.target.parentElement;
  const getId = getSkuFromProductItem(elementoPai);
  fetch(`${API_ITEM}${getId}`)
  .then((resposta) => resposta.json())
  .then((object) => {
    const LiItem = createCartItemElement(object);
    const sectionCart = document.querySelector(cartItems);
    sectionCart.appendChild(LiItem);
    saveLocalStorage();
  });
};

// requisito 2
// criando funcao que vai encontrar o botao
const buttonItem = () => {
  const itemsElement = document.querySelector('.items');
  itemsElement.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      return addItemCart(event);
    }
  });
};

const getLocalStorage = () => {
  const getOl = document.querySelector(cartItems);
  getOl.innerHTML = localStorage.getItem('lista');
  getOl.addEventListener('click', (event) => {
    if (event.target.className === 'cart__item') {
      cartItemClickListener(event);
    }
  });
};
// requisito 6
const buttonRemove = () => {
  const buttonEmptyCar = document.querySelector('.empty-cart');
  buttonEmptyCar.addEventListener('click', () => {
    const olListner = document.querySelector(cartItems);
      olListner.innerHTML = '';
  });
};
window.onload = () => { 
 searchProducts();
 buttonItem();
 getLocalStorage();
 buttonRemove();
};
