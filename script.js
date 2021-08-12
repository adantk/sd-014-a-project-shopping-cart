 const cartItemClickListener = () => {
  // função para remver li futuramente.
  };
  
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function createCartItemElement(ObjetoParametro) {
  const { id: sku, title: name, price: salePrice } = ObjetoParametro;
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchItemBySku(sku) {
  const urlForFetch = `https://api.mercadolibre.com/items/${sku}`;
  const response = await fetch(urlForFetch).then((resposta) => resposta);
  const responseJson = await response.json();
  const elementOl = document.querySelector('.cart__items');
  elementOl.appendChild(createCartItemElement(responseJson));
}

const ItemClickAddCart = (event) => {
  const elementoItemAdd = event.target.parentElement;
  const skuItemAdd = getSkuFromProductItem(elementoItemAdd);
  fetchItemBySku(skuItemAdd);
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', ItemClickAddCart);
  }
  return e;
}

function createProductItemElement(sku, name, image) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
}

async function FilterFetch(url, chave) { // filtra saida do fetch em json por chave retornando um valor
  const response = await fetch(`${url}`);
  const data = await response.json();
  return data[chave];
}

async function requestionApiMl(valorBusca) {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=$${valorBusca}`;
  const ItensResults = await FilterFetch(url, 'results'); // array com todos resultados de acordo com valorBusca 
  ItensResults.forEach((item) => {
    const elementItems = document.querySelector('.items');
    const {
      id,
      title: nameItem,
      thumbnail: ImgItem,
    } = item;
    elementItems.appendChild(createProductItemElement(id, nameItem, ImgItem));
  });
}

window.onload = () => {
  requestionApiMl('computador');
};