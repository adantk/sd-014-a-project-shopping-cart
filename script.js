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

  const addItems = document.querySelector('.items');
  addItems.appendChild(section);

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

const pegaComputador = async () => {
  const resulComputador = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const jsonComputador = await resulComputador.json();
  const pegaLoading = document.querySelector('.loading');
  pegaLoading.remove();
  jsonComputador.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
    createProductItemElement({ sku, name, image });
  });
};

const fetchParaId = async (id) => {
  const resultProduct = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const jsonProduct = await resultProduct.json();
  const obj = { sku: jsonProduct.id, name: jsonProduct.title, salePrice: jsonProduct.price };
  createCartItemElement(obj);
};

const clickButton = () => {
  const pegaButton = document.querySelectorAll('.item_add');
  pegaButton.forEach((button) => {
    button.addEventListener('click', (event) => {
      const produtoId = event.target.parentElement.firstChild.innerText;
      fetchParaId(produtoId);
    });
  });
};
window.onload = () => { pegaComputador(); clickButton(); };
