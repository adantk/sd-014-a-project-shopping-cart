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
// codigo aq;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchComputer(query) {
  await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => response.json())
    .then((data) => data.results)
    .then((results) => results.forEach((item) => document.querySelector('.items')
    .appendChild(
      createProductItemElement({ sku: item.id, name: item.title, image: item.thumbnail }),
      )));
}

const itemAdd = () => {
  const button = document.querySelectorAll('.item__add');
  console.log(button);

  button.forEach((btn) =>
  btn.addEventListener('click', () =>
  console.log('teste')));
};

window.onload = async () => {
await fetchComputer('computer');
await itemAdd();
};
