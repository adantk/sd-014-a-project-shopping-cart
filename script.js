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
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const somaTotal = (valor) => {
  const seletor = document.querySelector('.total-price');
  let valorTotal = 0;
  valorTotal += valor;
  seletor.innerText = `Valor total: R$ ${valorTotal}`;
};

const fetchParaId = async (id) => {
  const resultProduct = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const jsonProduct = await resultProduct.json();
  const obj = { sku: jsonProduct.id, name: jsonProduct.title, salePrice: jsonProduct.price };
  const ol = document.querySelector('.cart__items');
  ol.appendChild(createCartItemElement(obj));
  somaTotal(obj.salePrice);
};

const addEvent = () => {
  const btn = document.querySelectorAll('.item__add');
  btn.forEach((element) => {
    element.addEventListener('click', (event) => {
      const aa = event.target.parentElement.firstChild.innerText;
      fetchParaId(aa);
    });
  });
};

const fetchProduct = async () => {
  const responseRaw = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const responseJson = await responseRaw.json();
  const loading = document.querySelector('.loading');
  loading.remove();
  const resultados = responseJson.results;
  const items = document.querySelector('.items');
  resultados.forEach((element) => {
    const obj = { sku: element.id, name: element.title, image: element.thumbnail };
    items.appendChild(createProductItemElement(obj));
  });
  addEvent();
};

function apagaTudo() {
  const lista = document.querySelector('.cart__items');
  while (lista.hasChildNodes()) {  
      lista.removeChild(lista.firstChild);
  }
}

const btnApagaTudo = document.querySelector('.empty-cart');
btnApagaTudo.addEventListener('click', apagaTudo);

window.onload = () => {
  fetchProduct();
};
