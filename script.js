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
  const buscaItems = document.querySelector('.items');

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  buscaItems.appendChild(section);
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addCarrinho() {
  const lista = document.querySelectorAll('.item__add');
  const buscaOl = document.querySelector('.cart__items');
  lista.forEach((item) => {
    item.addEventListener('click', async (event) => {
      const buscaId = getSkuFromProductItem(event.target.parentElement);
      const buscaUrl = await fetch(`https://api.mercadolibre.com/items/${buscaId}`)
        .then((response) => response.json());
      buscaOl.appendChild(createCartItemElement({
        sku: buscaUrl.id,
        name: buscaUrl.title,
        salePrice: buscaUrl.price }));
    });
  });
}

// requisito #1
function fetchApiProduct() {
  const itemApi = document.getElementsByClassName('items')[0];

  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((Response) => Response.json()
      .then((computadores) => computadores.results.forEach((comput) => {
        const { id: sku, title: name, thumbnail: image } = comput;
        const newItens = createProductItemElement({ sku, name, image });
        itemApi.appendChild(newItens);
      }))
      .then(() => addCarrinho()));
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

window.onload = () => {
  fetchApiProduct('computador');
  addCarrinho();
};
