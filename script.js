const classList = document.querySelector('.items');
const getSection = document.querySelectorAll('.item');
const cartList = document.querySelector('.cart__items');
const btnCleanCart = document.querySelector('.empty-cart');
const btnLi = document.querySelectorAll('.cart__item');

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
  return cartList.removeChild(event.target);
}

const cleanCartAll = () => {
    btnCleanCart.addEventListener('click', () => {
      console.log('work');
      cartList.innerHTML = '';
  });
  };

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fecthID = async (endpoint) => {
 const responseRaw = await fetch(`https://api.mercadolibre.com/items/${endpoint}`);
 const responseJson = await responseRaw.json();
 return responseJson;
};

const cartClick = () => {
  const buyButton = document.querySelectorAll('.item__add');
  buyButton.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const sku = event.target.previousSibling.previousSibling.previousSibling.innerText;
      fecthID(sku).then((response) => {
        const appendCart = createCartItemElement({ 
          sku: response.id,
          name: response.title, 
          salePrice: response.price });
         cartList.appendChild(appendCart); 
      });
    });
  });
};

const listJsonMercadoLivre = async (endpoint) => {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${endpoint}`;
  const response = await fetch(url);
  const request = await response.json();
  const resultList = await request.results;
  resultList.map((list) => {
    const store = createProductItemElement({
      sku: list.id,
      name: list.title,
      image: list.thumbnail });
    return classList.appendChild(store);
  });
  cartClick();
};

window.onload = () => {
  listJsonMercadoLivre('computador');
  cleanCartAll();
};
