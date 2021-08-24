const ol = document.querySelector('.cart__items');
const carregando = document.createElement('h1');

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

function createProductItemElement({
  sku,
  name,
  image,
}) {
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
  ol.removeChild(event.target);
}

function createCartItemElement({
  sku,
  name,
  salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// Requisito 6 //
const emptyCart = () => {
  const buttonEmpty = document.querySelector('.empty-cart');
  buttonEmpty.addEventListener('click', () => {
    ol.innerHTML = '';
  });
};

// Requisito 2//
const fetchProductsItens = () => {
  const items = document.querySelectorAll('.item__add');
  items.forEach((item) => {
    item.addEventListener('click', (event) => {
      const getSku = getSkuFromProductItem(event.target.parentElement);
      fetch(`https://api.mercadolibre.com/items/${getSku}`)
        .then((response) => response.json())
        .then((element) => {
          ol.appendChild(createCartItemElement({
            sku: element.id,
            name: element.title,
            salePrice: element.price,
          }));
        });
    });
  });
};

const loading = () => {
  const pai = document.querySelector('.container');
  pai.appendChild(carregando);
  carregando.className = 'loading';
  carregando.innerText = 'loading...';
};

// Requisito 1//
const fetchMercadoLivre = () => {
  loading();
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador').then((response) => {
    response.json().then((dados) => {
      carregando.remove();
      dados.results.forEach((elemento) => {
        const items = document.querySelector('.items');
        items.appendChild(createProductItemElement({
          sku: elemento.id,
          name: elemento.title,
          image: elemento.thumbnail,
        }));
      });
      fetchProductsItens();
    });
  });
};

window.onload = () => {
  fetchMercadoLivre();
  emptyCart();
};