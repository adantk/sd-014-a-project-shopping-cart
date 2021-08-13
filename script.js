const classList = document.querySelector('.items');

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

// FUNÇÕES MINHA DAQUI PRA BRAIXO 
const listJsonMercadoLivre = async () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const response = await fetch(url);
  const request = await response.json();
  const resultList = await request.results;
  return resultList.map((list) => {
    const store = createProductItemElement({ sku: list.id,
       name: list.title, 
       image: list.thumbnail });
    return classList.appendChild(store);
  });
};

listJsonMercadoLivre();

window.onload = () => { };
