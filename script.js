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

function cartItemClickListener(event) {
  event.target.remove();
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

async function jsonComputer() {
  const load = createCustomElement('h1', 'loading', 'loading');
  document.querySelector('.items').appendChild(load);

  const js = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const jsResov = await js.json();

  load.remove();

  jsResov.results.forEach((e) => {
    const section = document.querySelector('.items');
    section.appendChild(createProductItemElement({ sku: e.id, name: e.title, image: e.thumbnail }));
  });
}

function addventListeBotton() {
  const botton = document.querySelectorAll('.item__add');
  botton.forEach((valu) => {
    valu.addEventListener('click', async (event) => {
      const x = event.target.parentElement.firstChild.innerText;
      const carrinho = document.querySelector('.cart__items');
      const produt = await fetch(`https://api.mercadolibre.com/items/${x}`);
      const objetoJson = await produt.json();

      carrinho.appendChild(createCartItemElement({
        sku: objetoJson.id,
        name: objetoJson.title,
        salePrice: objetoJson.price,
      }));
      localStorage.setItem('items', carrinho.innerHTML);
    });
  });
}

function carrinhoStorage() {
  const items = localStorage.getItem('items');
  const carrinho = document.querySelector('.cart__items');
  carrinho.innerHTML = items;
  console.log(items);
  const li = document.querySelectorAll('.cart__item');
  li.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
}

function removeCarrinho() {
  const items = document.querySelectorAll('.cart__item');

  items.forEach((elementos) => {
    elementos.remove();
  });
}

window.onload = async () => {
  await jsonComputer();
  await addventListeBotton();
  await carrinhoStorage();
  document.querySelector('.empty-cart').addEventListener('click', removeCarrinho);
};