const urlApiMercadoLivre = 'https://api.mercadolibre.com/sites/MLB';

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

const fetchApiMercadoLivre = async (endPoint) => {
  try {
    const response = await fetch(`${urlApiMercadoLivre}${endPoint}`);
  const product = await response.json();
  return product;
  } catch (error) {
    alert('Não foi possível acessar à api');
  }
};

const createProductsGrid = async () => {
  const product = await fetchApiMercadoLivre('/search?q=computador');
  product.results.forEach((result) => {
    const item = createProductItemElement(result);
    const sectionItems = document.querySelector('.items');
    sectionItems.appendChild(item);
  });
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = () => {
  createProductsGrid();
 };
