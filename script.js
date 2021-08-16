const cartsave = '.cart__items';

async function savelocal() {
  await localStorage.setItem('cart', document.querySelector(cartsave).innerHTML);
}

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
    event.target.remove();
    savelocal();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function callItemAPI() {
  const itemConteiner = document.querySelector('.items');
  try {
    itemConteiner.innerHTML = '<p class = "loading"> Loading...</p>';
    const requi = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const requiJson = await requi.json();
  itemConteiner.innerHTML = null;
  const item = await requiJson.results;
  await item.forEach((iten) => document.querySelector('.items')
  .appendChild(createProductItemElement({ sku: iten.id,
     name: iten.title,
image: iten.thumbnail })));
  } catch (error) {
    alert(`Erro${error}`);
  }
}

function addCart() {
  const itens = document.querySelectorAll('.item__add');
  const carrinho = document.querySelector(cartsave);
  itens.forEach((itenButto) => itenButto.addEventListener('click', async (e) => {
    try {
      const item = getSkuFromProductItem(e.target.parentElement);
      const requItem = await fetch(`https://api.mercadolibre.com/items/${item}`);
      const jsonItem = await requItem.json();
      carrinho.appendChild(createCartItemElement({ sku: jsonItem.id,
      name: jsonItem.title,
      salePrice: jsonItem.price }));
      savelocal();
    } catch (error) {
      alert(`Erro${error}`);
    }
  }));
}

function clearCart() {
  const cart = document.querySelector(cartsave);
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    cart.innerHTML = null;
    savelocal();
  });
}

async function loadCart() {
  document.querySelector(cartsave).innerHTML = localStorage.getItem('cart');
}

window.onload = async () => {
  await loadCart();
  await callItemAPI();
  await addCart();
  await clearCart();
 };
