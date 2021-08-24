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
  const buscaSection = document.getElementsByClassName('items');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  buscaSection[0].appendChild(section);
  
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

async function BuscaApi(buscar) {
  const requisiçao = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${buscar}`);
  const aprovada = await requisiçao.json();
  const array = aprovada.results.map((itens) => itens);
  array.forEach((item) => {
   const parametro = {
     sku: item.id,
     name: item.title,
     image: item.thumbnail,
   };
   createProductItemElement(parametro);
  });
}

window.onload = () => {
  BuscaApi('computador');
 };
