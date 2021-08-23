const olClass = '.cart__items';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
// função para criar elemento
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// função para criar seção e jogar os elementos criados dentro

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const sectionItem = document.querySelector('.items');
  sectionItem.appendChild(section);
}

async function fetchApi() { 
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
.then((response) => response.json())
  .then((Object) => Object.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
      createProductItemElement({ sku, name, image });    
  }));   
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const saveStorage = () => {
  localStorage.clear();
  const ol = document.querySelector(olClass);
  localStorage.setItem('saveCart', ol.innerHTML);
};

function cartItemClickListener(event) {
  const ol = document.querySelector(olClass);
  ol.removeChild(event.target);
  saveStorage();
}

const loadStorage = () => {
  const ol = document.querySelector(olClass);
  ol.innerHTML = localStorage.getItem('saveCart');
  // ol.addEventListener('click', cartItemClickListener);
  saveStorage();
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');  
  const ol = document.querySelector(olClass);
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  ol.appendChild(li);
  saveStorage();
  return li;
}

 const fetchCart = (getId) => { 
   const loading = document.querySelector('.loading');
   loading.innerHTML = 'loading...';
   fetch(`https://api.mercadolibre.com/items/${getId}`)
   .then((response) => response.json())
   .then((object) => { 
   createCartItemElement({ sku: object.id, name: object.title, salePrice: object.price });
   });
   loading.remove();
 }; 

const buttonClick = () => {
  const cartButton = document.querySelectorAll('.item__add');
  cartButton.forEach((button) => {
  button.addEventListener('click', (event) => {
    const getId = getSkuFromProductItem(event.target.parentElement);
    console.log(event.target);
    fetchCart(getId);
  });  
});
};

const cleanCart = () => {
const ol = document.querySelector(olClass);
const cleanButton = document.querySelector('.empty-cart');
cleanButton.addEventListener('click', () => {
  ol.innerHTML = '';
  saveStorage();
});
};

window.onload = async () => {
   await fetchApi();
   await buttonClick();
   await cleanCart();
   await loadStorage();
};
