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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Requisito 3 - Remove o item clicado no carrinho
function cartItemClickListener(event) {
  // coloque seu código aqui
  localStorage.removeItem(event.target.id);
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requisito 2 - Função do Event Listener dos botões dos produtos que adiciona o produto clicado ao carinho
async function productClickListener(event) {
  console.log(event.target.parentElement);
  const id = getSkuFromProductItem(event.target.parentElement);
  const resRaw = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const resJson = await resRaw.json();
  document.querySelector('.cart__items').appendChild(createCartItemElement(resJson));
  localStorage.setItem(id, id);
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  // Adiciona event listener nos produtos
  btn.addEventListener('click', productClickListener);
  section.appendChild(btn);
  return section;
}

// Requisito 1 - Realiza a pesquisa e coloca na área de itens
async function search(ele) {
  const fetchRaw = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${ele}`);
  const dataJson = await fetchRaw.json();
  dataJson.results.forEach((product) => {
    document.querySelector('.items').appendChild(createProductItemElement(product));
  });
}

// Requisito 4 - Carrega o local Storage
function loadStorage() {
  for (let index = 0; index < localStorage.length; index += 1) {
    const element = localStorage.getItem(localStorage.key(index));
    fetch(`https://api.mercadolibre.com/items/${element}`)
      .then((res) => res.json())
      .then((e) => document.querySelector('.cart__items').appendChild(createCartItemElement(e)));
    localStorage.setItem(element, element);
  }
}

window.onload = () => {
  search('computador');
  loadStorage();
};
