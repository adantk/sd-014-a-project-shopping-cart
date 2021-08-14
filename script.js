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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  // coloque seu código aqui
  const cart = document.querySelector('.cart .cart__items');
  cart.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const appendSection = (object) => {
  const { id, title, thumbnail } = object;
  const obj = {
    sku: id,
    name: title,
    image: thumbnail,
  };
  const itemsSection = document.querySelector('.items');
  const child = createProductItemElement(obj);

  itemsSection.appendChild(child);
};

const getAndAddElement = async (event) => {
 const item = (event.target.parentNode);
 const itemID = item.firstChild.innerHTML;
 
 const resolveRaw = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
 const resolveJSON = await resolveRaw.json();
 const { id, title, price } = resolveJSON;
 const obj = {
   sku: id,
   name: title,
   salePrice: price,
 };
 const child = createCartItemElement(obj);
 const father = document.querySelector('.cart__items');
 father.appendChild(child);
};

const fetchCart = async () => {
  const itemsAdd = document.querySelectorAll('.item__add');

  itemsAdd.forEach((element) => {
    element.addEventListener('click', getAndAddElement);
  });
};

const fetchItems = async () => {
  const resolveRaw = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const resolveJSON = await resolveRaw.json();
  resolveJSON.results.forEach((element) => {
    appendSection(element);
  });
  fetchCart();
};

window.onload = () => { 
  fetchItems();
};
