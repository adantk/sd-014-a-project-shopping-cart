const mercadolivreAPI = () => {
  const api = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  return new Promise((resolve) => {
    fetch(api).then((response) => {
      response.json().then((data) => {
        resolve(data.results);
      });
    });
  });
};

const itemAPI = (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  return new Promise((resolve) => {
    fetch(endpoint).then((response) => {
      response.json().then((item) => {
        resolve(item);
      });
    });
  });
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

const createCartItemElement = ({ id: sku, title: name, price: salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

function cartItemClickListener(event) { /* Com base na função 'remove': https://developer.mozilla.org/en-US/docs/Web/API/Element/remove */
  event.target.remove();
}

const adicionaItem = () => {
  const botao = document.querySelectorAll('.item__add');
  botao.forEach((button) =>
    button.addEventListener('click', async (event) => {
      const evento = event.target;
      const sku = getSkuFromProductItem(evento.parentElement);
      const wait = await itemAPI(sku);
      const carrinho = document.querySelector('.cart__items');
      carrinho.appendChild(createCartItemElement(wait));
    }));
};

const createProductItemElement = async () => {
  const results = await mercadolivreAPI();

  results.forEach(({ id, title, thumbnail }) => {
    const section = document.createElement('section');
    const items = document.querySelector('.items');
    section.className = 'item';

    section.appendChild(createCustomElement('span', 'item__sku', id));
    section.appendChild(createCustomElement('span', 'item__title', title));
    section.appendChild(createProductImageElement(thumbnail));
    section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

    items.appendChild(section);
  });
  adicionaItem();
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = () => {
  mercadolivreAPI();
  createProductItemElement();
};
