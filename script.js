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

const fetchMercadoLivre = async (query) => {
  const sectionItem = document.querySelector('.items');
  const apiMercadoLivre = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`);
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

window.onload = async () => { 
  await fetchMercadoLivre('computador');
};
