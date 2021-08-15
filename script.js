const itemsSection = document.getElementsByClassName('items')[0];
const oList = document.getElementsByClassName('cart__items')[0];
const clearCartBtn = document.getElementsByClassName('empty-cart')[0];
const body = document.getElementsByTagName('body')[0];

function localStorageUpdate() {
  localStorage.clear();
  localStorage.setItem('liSaved', oList.innerHTML);
}

const updateTotalPrice = () => {
  let sum = 0;
  for (let i = 0; i < oList.children.length; i += 1) {
    const cur = Number(oList.children[i].innerText.slice(oList.children[i]
      .innerText.search('PRICE:') + 8));
    sum += cur;
  }
  const totalPrice = document.getElementsByClassName('total-price')[0];
  totalPrice.innerText = sum;
  if (sum === 0) {
    totalPrice.style.display = 'none';
  } else {
    totalPrice.style.display = 'block';
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
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(button);

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.remove();
  localStorageUpdate();
  updateTotalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addCartButtonInitializer() {
  const buttonAdd = document.querySelectorAll('.item__add');
  buttonAdd.forEach((ele) => { 
    ele.addEventListener('click', (event) => {
      const ItemID = [...event.target.parentElement.children]
        .find((ele2) => ele2.classList.contains('item__sku')).innerText;
      fetch(`https://api.mercadolibre.com/items/${ItemID}`)
        .then((response) =>
        response.json())
        .then((dado) => {
          const myObject = { sku: dado.id, name: dado.title, salePrice: dado.price };
          oList.appendChild(createCartItemElement(myObject));
          localStorageUpdate();
          updateTotalPrice();
        });
    });
  });
}

const setupMarketList = (query = 'computador') => {
  body.appendChild(createCustomElement('span', 'loading', 'Loading...'));
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`).then((response) => 
  response.json()).then((dados) => {
    dados.results.reduce((acc, cur) => {
      const object = {
        sku: cur.id,
        name: cur.title,
        image: cur.thumbnail,
      };
      const newChild = createProductItemElement(object);
      itemsSection.appendChild(newChild);
      return acc; // This does nothing, but keeps the reduce running.
    }, 0);
  })
  .then(() => { 
    addCartButtonInitializer();
    body.removeChild(document.getElementsByClassName('loading')[0]);
  });
};

function localStorageStarter() {
  if (localStorage.liSaved) {
    oList.innerHTML = `${localStorage.getItem('liSaved')}`;
  }
  for (let i = 0; i < oList.children.length; i += 1) {
    oList.children[i].addEventListener('click', cartItemClickListener);
  }
}

clearCartBtn.addEventListener('click', () => {
  oList.innerHTML = '';
  localStorageUpdate();
  updateTotalPrice();
});

window.onload = () => {
  setupMarketList();
  localStorageStarter();
  updateTotalPrice();
};