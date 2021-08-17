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
  const itemPai = document.querySelector('.items')
  itemPai.appendChild(section);
  return section;
}

const prodFetch = () => { fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
.then((response) => response.json())
  .then((itemCarr) => itemCarr.results.forEach(({id: sku, title: name, thumbnail: image}) => {
    createProductItemElement({sku, name, image});
  }))
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  
}

const lerBotao = () => {
const pegaBotao = document.querySelectorAll('.item__add');
pegaBotao.forEach((button) => button.addEventListener('click', clickBotao))
}

const clickBotao = (evento) => {
  fetchId(evento.target.parentElement.firstChild.innerText);
  console.log('funciona');
}

const fetchId =  async (id) => {
const pegarIdRaw = await fetch(`https://api.mercadolibre.com/items/${id}`)
const IdTrat = await pegarIdRaw.json();
console.log(IdTrat);
}

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
