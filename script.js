let list = [];

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
  // nessa função usei o código do Rodolfo Pinheiro de referência para a correção de um erro meu, detalhado abaixo. Fonte: https://github.com/tryber/sd-014-a-project-shopping-cart/pull/98/files
  const itemsList = document.querySelector('.items'); // estava errando nessa linha, porque estava usando .getElementsByClassName, que retorna não o elemento, mas uma HTMLlist. Usando o querySelector, como o Rodolfo usou, consegui acessar o elemento diretamente.
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  itemsList.appendChild(section);
  
  return itemsList;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const cartList = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener.bind(this, li));
  cartList.appendChild(li);
  return li;
}

const addToCart = async (id) => { // puxa a API com dados do item a ser adicionado ao cart
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then((product) => createCartItemElement(product)); // chama a função createCartItemElement passando os dados do item a ser adicionado
};

const addListenerToButtons = () => {
  const buttonArr = Array.from(document.getElementsByClassName('item__add'));
  const skuArr = Array.from(document.getElementsByClassName('item__sku'));
  buttonArr.forEach((el, i) => el.addEventListener('click',
  addToCart.bind(this, skuArr[i].innerHTML))); // referencia para o .bind: https://stackoverflow.com/questions/35667267/addeventlistenerclick-firing-immediately
};

const getApi = async (searchItem) => {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${searchItem}`)
    .then((response) => response.json())
    .then(function (obj) {
      list = obj.results;
    })
    .then(function () {
      list.forEach((item) => {
        createProductItemElement(item);
    });
    addListenerToButtons();
  })
    .catch((error) => console.log(error));
};
 
window.onload = () => { 
 getApi('computador');
};