const itemsCart = document.querySelector('.cart__items');

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

  const addItems = document.querySelector('.items');
  addItems.appendChild(section);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// const localStorageSave = () => {
//   localStorage.clear();
//   const ol = document.querySelector(itemsCart);
//   localStorage.setItem('listCart', ol.innerHTML);
// };

// const localStorageLoad = () => {
//   const ol = document.querySelector(itemsCart);
//   ol.innerHTML = localStorage.getItem('listCart');
// localStorageSave();
// };

// 3. Remova o item do carrinho de compras ao clicar nele
function cartItemClickListener(event) {
  //  const ol2 = document.querySelector(itemsCart);
  //   ol2.removeChild(event.target);
  // localStorageSave();
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}
// Requisito 4:
function sum() {
  const classTotalPrice = document.querySelector('.total-price');
  let contador = Number(classTotalPrice.innerText);
  const li = document.querySelectorAll('.cart__item');
  const num = Number(li[li.length - 1].innerText.split('$')[1]);
  contador += num;
  classTotalPrice.innerText = contador;
  console.log(contador);
  console.log(sum);
}
// 2. Adicione o produto ao carrinho de compras
const fetchParaId = async (id) => {
  const resultProduct = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const jsonProduct = await resultProduct.json();
  console.log(jsonProduct);
  const obj = { sku: jsonProduct.id, name: jsonProduct.title, salePrice: jsonProduct.price };
  const ol = document.querySelector('.cart__items');
  ol.appendChild(createCartItemElement(obj));
  sum();
};

const clickButton = () => {
  const pegaButton = document.querySelectorAll('.item__add');
  pegaButton.forEach((button) => {
    button.addEventListener('click', (event) => {
      const produtoId = event.target.parentElement.firstChild.innerText;
      fetchParaId(produtoId);
    });
  });
};

// 1. Crie uma listagem de produtos
const pegaComputador = async () => {
  const resulComputador = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const jsonComputador = await resulComputador.json();
  const pegaLoading = document.querySelector('.loading');
  pegaLoading.remove();
  jsonComputador.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
    createProductItemElement({ sku, name, image });
  });
  clickButton();
};

// 6. Crie um botão para limpar carrinho de compras
function apaga() {
  const itensCart = document.querySelector(itemsCart);
  while (itensCart.hasChildNodes()) {
    itensCart.removeChild(itensCart.firstChild);
  }
}
const botaoEsvazia = document.querySelector('.empty-cart');
botaoEsvazia.addEventListener('click', apaga);
// seleciono o item do meu carrinho, que me retorna uma espécie de array. 78, utilizo o while que 'enquanto' o itensCart tiver filhos, eu quero que remova o primeiro filho. HasChildNodes não leva parametro, me retornando true ou false. RemoveChild, recebe um parametro, na qual um elemento que ele tem que receber.  

window.onload = () => { pegaComputador(); };
// localStorageLoad();