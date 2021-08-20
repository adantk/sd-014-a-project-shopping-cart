// await == promisse

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
  const capSection = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  capSection.appendChild(section);  

  return section;
}
function cartItemClickListener(event) {
  // coloque seu código aqui
}

// função requisito 2
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// eu fiz 
const capFetch = async (item) => {
  const responseMarket = await fetch(`https://api.mercadolibre.com/items/${item}`);
  const armazenaObjeto = await responseMarket.json();
  // eu fiz, captura ol
  const capFatherLi = document.querySelector('.cart__items');
  const { id, title, price } = armazenaObjeto;
  capFatherLi.appendChild(createCartItemElement({
     sku: id,
     name: title, 
     salePrice: price, 
  }));
};

function capId() {
  const capButton = document.querySelectorAll('.item__add');
    capButton.forEach((element) => {
      element.addEventListener('click', (marcoPolo) => {
       const capInfoId = marcoPolo.target.parentElement.firstChild.innerText; 
       capFetch(capInfoId);
  });
  });
  }

const createItemsList = async () => {
  const apiMarket = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const apiJson = await apiMarket.json();
  apiJson.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
    createProductItemElement({ sku, name, image });
  }); 
    capId();
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = () => {
  createItemsList();
};