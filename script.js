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
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const productsList = async (query) => {
  const sectionItem = document.querySelector('.items');
  const apiMercadoLivre = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${query}`);
  const responseJSON = await apiMercadoLivre.json();
  const { results } = responseJSON;
  results.forEach((product) => {
    const infosObject = {
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    };
    sectionItem.appendChild(createProductItemElement(infosObject));
  });
};

async function addCart() {
  const items = document.querySelector('.items');
  const cartItems = document.querySelector('.cart__items');
  console.log(items);
  items.addEventListener('click', async (event) => {
    const itemID = event.path[1].childNodes[0].innerText;
    const requestAPI = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
    const responseJSON = await requestAPI.json();
    const itemObject = {
      sku: responseJSON.id,
      name: responseJSON.title,
      salePrice: responseJSON.price,
    };
    cartItems.appendChild(createCartItemElement(itemObject));
  });
}

window.onload = async () => { 
  await productsList('computador');
  await addCart();
};
