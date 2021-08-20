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

const acessAPI = async (search) => {
  const responseRaw = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`);
  const responseJson = await responseRaw.json();
  const results = responseJson.results;
  // console.log(results);

  const itens = document.querySelector('.items');
  results.forEach((elemento) => {
    itens.appendChild(createProductItemElement({
      name: elemento.title,
      sku: elemento.id,
      image: elemento.thumbnail,
    }));
  });
}

window.onload = () => { 
  acessAPI('computer');
};
