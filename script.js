function createProductImageElement(imageSource) {
  const image = document.createElement('img');
  image.className = 'item__image';
  image.src = imageSource;
  return image;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement(id, title, uriImagem) {
  const sectionPai = document.querySelector('.items'); 
  const sectionFilha = document.createElement('section');
  const spanId = document.createElement('span'); 
  const spanTitle = document.createElement('span');
  const img = document.createElement('img'); 
  const button = document.createElement('button');
  spanId.innerText = id; spanId.classList.add('item__sku');
  spanTitle.innerHTML = title; spanTitle.classList.add('item__title');
  img.src = uriImagem; img.classList.add('item__image');
  button.innerText = 'Adicionar ao carrinho'; button.classList.add('item__add');

  sectionFilha.classList.add('item');
  sectionFilha.appendChild(spanId);
  sectionFilha.appendChild(spanTitle);
  sectionFilha.appendChild(img);
  sectionFilha.appendChild(button);

  sectionPai.appendChild(sectionFilha);
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

// Requisito 1
const adicionarInfos = async (computer) => {
  const listaDeProd = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${computer}`);
  const listaDeProdutosJson = await listaDeProd.json();
  listaDeProdutosJson.results.forEach((prod) => {
    createProductItemElement(prod.id, prod.title, prod.thumbnail);
  });
};

window.onload = () => {
  adicionarInfos('computador');
};
