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
  const listProduct = document.querySelector('.cart__items');
  listProduct.removeChild(event.target); // Somente com Remove não funciona
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchItem = async (idItem) => { // Criando a estrutura dos elementos a ser adicionado ao carrinho
  const responseFetch = await fetch(`https://api.mercadolibre.com/items/${idItem}`);
  const responseJson = await responseFetch.json();
  const listProduct = document.querySelector('.cart__items');
  const { id, title, price } = responseJson; // Infos retiradas do Json
  listProduct.appendChild(createCartItemElement({
    sku: id,
    name: title,
    salePrice: price,
  }));// Adicionando produto a seção
};

const addItem = () => {
  const btnAdd = document.querySelectorAll('.item__add');
  btnAdd.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      fetchItem(event.target.parentElement.firstChild.innerText);// Acessa o pai do botão e captura  o texto do primeiro filho que é o id
    });
  });// ForEach
};

const fetchList = async () => {
  const responseFetch = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  const responseJson = await responseFetch.json();
  const itensList = responseJson.results;
  const sectionItems = document.querySelector('.items');
  itensList.forEach((item) => { // Itens do array selecionados de acordo com a função createProductItemElement
    const infoItems = {
      sku: item.id,
      name: item.title,
      image: item.thumbnail,
    };
    sectionItems.appendChild(createProductItemElement(infoItems)); // createProductItemElement gera uma seção com intens que são passados para sectionItems
  });// ForEach
  addItem();
};// fetchList

window.onload = () => {
  fetchList();
};
