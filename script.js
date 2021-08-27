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

const getItems = document.querySelector('.items');
const searchProduct = 'computador';

const getMLApi = async () => {
  const resultFul = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${searchProduct}`);
  const refinedResult = await resultFul.json();
  const searchResults = refinedResult.results;

  searchResults.forEach((result) => {
    getItems.appendChild(createProductItemElement({
      name: result.title, sku: result.id, image: result.thumbnail,
    }));
  });
};

window.onload = async () => {
  await getMLApi();
};

// Alternativa requisito 1
  // searchResults.forEach((result) => {
  //   const productList = createProductItemElement({
  //     name: result.title,
  //     sku: result.id,
  //     image: result.thumbnail,
  //   });
  //   getItems.appendChild(productList);
  // });