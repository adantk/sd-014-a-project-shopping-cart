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
  image }) {
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

function createCartItemElement({
  sku,
  name,
  salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchMercadoLivre = async (QUERY) => {
  const mlApi = `https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`;

  await fetch(mlApi)
    .then((response) => response.json())
    .then((data) => data.results)
    .then((results) => results.forEach((result) =>
      document.querySelector('.items').appendChild(createProductItemElement({
        sku: result.id,
        name: result.title,
        image: result.thumbnail,
      }))));
};

const fetchItem = () => {
  const btn = document.querySelectorAll('.item__add'); // Busca a classe do botão no HTML

  btn.forEach((list) => { // Cria um evento que para cada clique no botão seja adicionado o produto na lista do carrinho de compras!
    list.addEventListener('click', async (event) => { 
      const targett = event.target.parentElement.firstChild.innerHTML; 
      const cart = document.querySelector('.cart__items'); // Busca a classe da lista do carrinho de compras!
      const fetchItemMl = await fetch(`https://api.mercadolibre.com/items/${targett}`)
        .then((response) => response.json()); // Transforma os dados em Json!
      cart.appendChild(createCartItemElement({
        sku: fetchItemMl.id,
        name: fetchItemMl.title,
        salePrice: fetchItemMl.price,
      }));
    });
  });
};

window.onload = async () => {
  await fetchMercadoLivre('computador');
  await fetchItem();
};