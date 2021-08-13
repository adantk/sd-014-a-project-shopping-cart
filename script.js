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
  const cart = document.querySelector('.cart__items');
    cart.removeChild(event.target)
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const setItems = () => {
  const getApi = () => new Promise((resolve, reject) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then((obj) => obj.json()).then((res) => resolve(res.results))
      .catch((error) => reject(error));
  });
  const items = document.getElementsByClassName('items');
  getApi().then((result) => {
    result.forEach((pc) => {
      const retorno = createProductItemElement({
        sku: pc.id,
        name: pc.title,
        image: pc.thumbnail,
      });
      items[0].appendChild(retorno);
    });
  });
};

const setBtn = () => {
  const promise = (id) => new Promise((resolve) => {
    fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((result) => result.json().then((obj) => resolve(obj)));
  });
  const items = document.querySelector('.items');
  items.addEventListener('click', (target) => {
    if (target.target.classList.contains('item__add')) {
      const id = target.target.parentNode.firstElementChild.innerText;
      promise(id).then((result) => {
        const ret = createCartItemElement({
          sku: id,
          name: result.title,
          salePrice: result.price,
        });
        document.querySelector('.cart__items').appendChild(ret);
      });
    }
  });
};

window.onload = () => {
  setItems();
  setBtn();
};
