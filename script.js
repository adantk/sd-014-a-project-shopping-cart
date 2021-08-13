const cartList = document.querySelector('.cart__items');

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

function cartItemClickListener(event) {
  cartList.removeChild(event.target);
  const ar = JSON.parse(localStorage.getItem('products'));
  
  const arr = ar.filter(({ sku, name, salePrice }) => 
    `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}` !== event.target.innerText);

  localStorage.setItem('products', JSON.stringify(arr));
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

const ar = [];

function saveItem({ sku, name, salePrice }) {
  const product = {
    sku,
    name,
    salePrice,
  };
  ar.push(product);
  localStorage.setItem('products', JSON.stringify(ar));
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__title', name));
  const btn = section
    .appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  btn.addEventListener('click', () => {
     fetch(`https://api.mercadolibre.com/items/${sku}`)
      .then((response) => response.json()).then((data) => {
        const salePrice = data.price;
        const addedItem = createCartItemElement({ sku, name, salePrice });
        cartList.appendChild(addedItem);
        saveItem({ sku, name, salePrice });
      });
  });

  return section;
}

fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((data) => {
    const { results } = data;
    
    results.forEach((result) => {
      const sku = result.id;
      const name = result.title;
      const image = result.thumbnail;
      const item = createProductItemElement({ sku, name, image });
      
      document.querySelector('.items').appendChild(item);
    });
  });

window.onload = () => {
  const refreshList = JSON.parse(localStorage.getItem('products')) || [];
  refreshList.forEach(({ sku, name, salePrice }) => {
    const addedItem = createCartItemElement({ sku, name, salePrice });
    cartList.appendChild(addedItem);
  });
};