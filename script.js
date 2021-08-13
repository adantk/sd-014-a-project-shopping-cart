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
  cart.removeChild(event.target);
  getIds()
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const setItems = () => {
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
    setBtn();
  })
};

const getApi = () => new Promise((resolve, reject) => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((obj) => obj.json()).then((res) => resolve(res.results))
    .catch((error) => reject(error));
});

const setBtn = () => {
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
        getIds()
      });
    }
  });
};

const promise = (id) => new Promise((resolve) => {
  if (id) {
    fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((result) => result.json().then((obj) => resolve(obj)));
  }
});

function loadState() {
  const loadItens = localStorage.getItem('savedState');
  const cart = document.querySelector('.cart__items');
  if (loadItens) {
    const arrayIds = loadItens.split(',')
    arrayIds.forEach((id) => {
      promise(id).then((obj) => {
        const li = createCartItemElement({ sku: obj.id, name: obj.title, salePrice: obj.price, });
        cart.appendChild(li)
      })
    });
  };
}

function saveState(id) {
  localStorage.setItem('savedState', id);
  console.log(localStorage.getItem('savedState'));
}

const getIds = () => {
  const cart = document.querySelector('.cart__items').childNodes;
  const x = []
  cart.forEach((li) => x.push(li.innerText.split('|')[0].split('SKU: ')[1].trim()))
  saveState(x);
}


window.onload = () => {
  setItems();
  loadState();
};
