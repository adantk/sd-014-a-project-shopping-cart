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
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function getItems(query) {
  if (!query) alert('Nenhum termo informado');

  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    if (json.results) return json.results;

    throw new Error('Endpoint não existe');
  } catch (error) {
    console.log(error);
  }
}

async function appendItems(query) {
  const itemsSection = document.querySelector('.items');

  const itemsList = await getItems(query);

  if (itemsList) {
    itemsList.forEach(({ id, title, thumbnail }) => {
      const itemElement = createProductItemElement({ id, title, thumbnail });

      itemsSection.appendChild(itemElement);
    });
  }
}

async function fetchItemID(id) {
  if (!id) alert('ID não informado');

  const url = `https://api.mercadolibre.com/items/${id}`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    if (json) return json;

    throw new Error('Endpoint não existe');
  } catch (error) {
    console.log(error);
  }
}

// function saveToLocalStorage() {
//   const cartSection = document.querySelector('.cart__items');

//   localStorage.setItem('cartList', cartSection.innerHTML);
// }

function addToCart() {
  const cartSection = document.querySelector('.cart__items');

  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('item__add')) {
      const itemID = getSkuFromProductItem(event.target.parentNode);
      const { id, title, price } = await fetchItemID(itemID);
      const cartItemElement = createCartItemElement({ id, title, price });

      cartSection.appendChild(cartItemElement);

      // saveToLocalStorage();
    }
  });
}

function removeToCart() {
  const cartSection = document.querySelector('.cart__items');

  document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('cart__item')) {
      cartSection.removeChild(event.target);
    }
  });
}

window.onload = () => {
  appendItems('computador');
  addToCart();
  removeToCart();
};
