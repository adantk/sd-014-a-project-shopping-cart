/* eslint-disable no-unused-vars */
const UrlBase = 'https://api.mercadolibre.com/sites/MLB/';

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

// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/await
// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/async_function
// https://thoughtbot.com/blog/good-things-come-to-those-who-await#:~:text=returns%20a%20promise%3A-,const%20response%20%3D%20await%20fetch(%22https%3A%2F%2Fapi.example,value%20we%20assign%20to%20response%20.
async function Products() {
  const respo = await fetch(`${UrlBase}/search?q=computador`);
  const produto = await respo.json();
  return produto;
}

window.onload = async () => {
  const produtos = await Products();
  produtos.results.forEach((product) => {
    const element = createProductItemElement(product);
    const items = document.querySelector('.items');
    items.appendChild(element);
  });
};
