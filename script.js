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
  const itens = document.querySelector('.items');
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  itens.appendChild(section);

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

const segundaApi = (id) => {
  const pcItem = document.querySelector('.cart__items');
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((computador) => {
      pcItem.appendChild(createCartItemElement({ 
        sku: computador.id, name: computador.title, salePrice: computador.price }));
    });
};

function buttonAdicionar() {
  const botaoAdicionar = document.querySelectorAll('.item__add');
  botaoAdicionar.forEach((botao) => {
    botao.addEventListener('click', (event) => {
      segundaApi(getSkuFromProductItem(event.target.parentElement));
    });
  });
}

function fetchApiProduct() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json()
      .then((computadores) =>
        computadores.results.forEach((comput) => {
          createProductItemElement({ sku: comput.id, name: comput.title, image: comput.thumbnail });
        }))
      .then(() => buttonAdicionar()));
}

window.onload = () => {
  fetchApiProduct();
};
