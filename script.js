const itemsCart = '.cart__items';

// Requisito 5
const totalPriceCart = () => {
  const items = document.querySelectorAll('.cart__item');
  const totalPrice = document.querySelector('.total-price');
  let totalSum = 0;   
  items.forEach((item) => {
    totalSum += parseFloat(item.innerText.split('$')[1]); // https://blog.betrybe.com/javascript/javascript-split/
  });  
  totalPrice.innerText = `${totalSum}`;
};

// Requisito 7 - Parte I
const loadingPage = () => {
  const loading = document.querySelector('.loading');
  loading.innerText = 'Loading...';
};

// Requisito 7 - Parte II
const removeLoadingPage = () => {  
  document.getElementsByClassName('loading')[0].remove();
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
  const itemSection = document.querySelector('.items');
  itemSection.appendChild(section);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Requisito 4 - parte I
const localStorageSave = () => {
  localStorage.clear();
  const ol = document.querySelector(itemsCart);
  localStorage.setItem('listCart', ol.innerHTML);  
};

// Requisito 3
function cartItemClickListener(event) {
  event.target.remove();
  localStorageSave();
  totalPriceCart();
}

// Requisito 4 - parte II
const localStorageLoad = () => {
  const ol = document.querySelector(itemsCart);  
  ol.innerHTML = localStorage.getItem('listCart');  
  ol.addEventListener('click', cartItemClickListener);
  localStorageSave(); 
  totalPriceCart();
};

function createCartItemElement({ sku, name, salePrice }) {
  const ol = document.querySelector(itemsCart);
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  ol.appendChild(li);
  localStorageSave();
  totalPriceCart();
  return li;
}

// Requisito 2 - Parte II
// Requisição para o endpoint
const createFetch = (idProduct) => {
  fetch(`https://api.mercadolibre.com/items/${idProduct}`)
    .then((response) => response.json())
    .then((object) => {      
    // Chama função que add item na lista ol (carrinho)
      createCartItemElement({ sku: object.id, name: object.title, salePrice: object.price });    
    });
};

// Requisito 2 - Parte I
// Ao clicar no botão capturar a ID do produto
const clickButton = () => {
  const getButton = document.querySelectorAll('.item__add');
  console.log(getButton);
  getButton.forEach((button) => {
    button.addEventListener('click', (event) => {
      const idProduct = getSkuFromProductItem(event.target.parentElement);
      // const idProduct = event.target.parentElement.firstChild.innerText;      
      // Chama função que fará requisição para o endpoint
      console.log(idProduct);
      createFetch(idProduct);
    });
  });
};

// Requisito 1
const getList = () => {
  loadingPage();
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((object) => {
      removeLoadingPage();
      object.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
        createProductItemElement({ sku, name, image });        
      });
    })
    .then(() => clickButton())
    .then(() => localStorageLoad());    
};

// Requisito 6
const clearCart = () => {
  const ol = document.querySelector(itemsCart);
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    ol.innerHTML = '';
    localStorage.clear();
    totalPriceCart();
  });  
};

window.onload = () => {
  getList();
  clearCart();    
};
