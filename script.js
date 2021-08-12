const searchApi = (productName = 'computador') => new Promise(async (resolve, reject) => {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${productName}`;
  try {
    const result = await (await fetch(url)).json();
    return resolve(result.results);
  } catch (error) {
    reject(error);
  };
});

const displayResult = async (itemSearched) => {
  const productsContainer = document.getElementById('product-container');
  try {
    const resultArr = await searchApi(itemSearched);
    resultArr.forEach(({ id, title, thumbnail }) => {
      const itemParams = {
        name: title,
        sku: id,
        image: thumbnail
      }
      const productElement = createProductItemElement(itemParams);
      productsContainer.appendChild(productElement);
    });
  } catch (error) {
    throw error; //  arrumar isso aqui para dar erro na tela
  }
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

window.onload = () => { displayResult() };
