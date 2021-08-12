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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  const items = document.querySelector('.items');
  items.appendChild(section);
}

const fetchItems = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((result) => result.json()).then((data) => {
    data.results.forEach((product) => {
     createProductItemElement(product);
    });
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText; // retornando o id do produto com base na posição da section passado por parametro
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  
  const ol = document.querySelector('.cart__items');
  ol.appendChild(li);
}

const fetchID = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((result) => result.json()).then((data) => {
    createCartItemElement(data);
  });
};

const addProduct = () => {
  const button = document.querySelector('.items');

  button.addEventListener('click', (e) => {
    if (e.target.classList.contains('item__add')) {
      const id = getSkuFromProductItem(e.target.parentElement);
      fetchID(id); // passando a posição exata do elemento section, que é pai do botao clicado
    }
  });
};

window.onload = () => { 
  fetchItems();
  addProduct();
};
