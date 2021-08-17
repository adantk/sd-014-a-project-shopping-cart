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
  const itemPai = document.querySelector('.items');
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  itemPai.appendChild(section);
  return section;
}

//  função requisito 1;
const prodFetch = () => { 
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((itemCarr) => itemCarr.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
    createProductItemElement({ sku, name, image });
  }));
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  
}

//  funções requisito 2;
const fetchId = async (id) => {
  const pegarIdRaw = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const IdTrat = await pegarIdRaw.json();
  return console.log(IdTrat);
};

const lerBotao = () => {
console.log('rodando');
const listaItems = document.querySelectorAll('.item__add');
console.log(listaItems);
listaItems.forEach((button) => button.addEventListener('click', async (event) => {
 await fetchId(event.target.parentElement.firstChild.innerText);
}));
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = () => {
  prodFetch();
  lerBotao();
 };
