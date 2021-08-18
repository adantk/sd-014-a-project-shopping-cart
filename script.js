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
  const mainSection = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  mainSection.appendChild(section);

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

const getApiToInsertItemsOnCart = (id) => {
  const cartOl = document.querySelector('.cart__items');
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((product) => {
      cartOl.appendChild(createCartItemElement({
        sku: product.id,
        name: product.title,
        salePrice: product.price,
      }));
    });
};

function addButton() {
  const addBtn = document.querySelectorAll('.item__add');
  addBtn.forEach((button) => {
    button.addEventListener('click', (event) => {
      getApiToInsertItemsOnCart(getSkuFromProductItem(event.target.parentElement));
    });
  });
}

function fetchApiProducts(item) {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`)
    .then((response) => response.json()
      .then((products) => products.results.forEach((product) => {
        createProductItemElement({
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        });
      }))
      .then(() => addButton()));
}

window.onload = () => {
  fetchApiProducts('computador'); // para alterar o produto buscado da API basta modificar o parâmetro desta function
};
