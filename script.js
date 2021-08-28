const sectionPaiHtml = document.querySelector('.items');
const listaDeCompra = document.querySelector('.cart__items');
const ITEM_URL = 'https://api.mercadolibre.com/items';
const buttonEscaziarCarrinho = document.querySelector('.empty-cart');
const chaveDoLocalStorage = 'Carrinho de compra';
const loadingTag = document.querySelector('.loading');
const totalPrice = document.querySelector('.total-price');

// quando eu adicionar algo no carrinho vou atualizar o valor total
// quando remover um produto, é necessario 
let precoTotal = 0;

const atualizarValorTotal = (preco) => {
  precoTotal += preco;
  totalPrice.innerText = precoTotal;
  // const filhosDoOL = listaDeCompra.children;
  // for (let x = 0; x < filhosDoOL.length; x += 1) {
  //   const blabla = filhosDoOL[x].innerText.split(' ');
  //   console.log(blabla, 'oi');
  // }
  // console.log(filhosDoOL, filhosDoOL.length);
};

// eu preciso criar uma função "AtualizaValorTotal" para ser chamado nas funções de adicionar e remover

const limparCarrinho = () => {
  listaDeCompra.innerHTML = '';
};

buttonEscaziarCarrinho.addEventListener('click', limparCarrinho);

const fetchProductItens = async (itenID) => {
  const item = await fetch(`${ITEM_URL}/${itenID}`);
  return item.json();
};

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

let listaDoCarrinhoStorage = [];

function cartItemClickListener(event) {
  const inTextEmArray = event.target.innerText.split(' ');
  const valorEmString = inTextEmArray[inTextEmArray.length - 1];
  const valorADescontar = parseFloat(valorEmString.slice(1)) * -1;
  atualizarValorTotal(valorADescontar);
  event.target.remove();
  // remover sku da listadecarrinhostorage
  listaDoCarrinhoStorage = listaDoCarrinhoStorage.filter((skuref) => skuref !== inTextEmArray[1]);
  // salvar a nova lista no locar storage
  localStorage.setItem(chaveDoLocalStorage, JSON.stringify(listaDoCarrinhoStorage));
}

const AddLocalStorage = (sku) => {
  listaDoCarrinhoStorage.push(sku);
  localStorage.setItem(chaveDoLocalStorage, JSON.stringify(listaDoCarrinhoStorage));
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  listaDeCompra.appendChild(li);
  atualizarValorTotal(salePrice);
}

const addButtonClickListener = (sku) => { /**/
  fetchProductItens(sku)
  .then((item) => {
    createCartItemElement({
      sku: item.id,
      name: item.title,
      salePrice: item.price,
    });
  });
};

const atualizarCarrinho = () => {
  if (localStorage.getItem(chaveDoLocalStorage) === null) {
    localStorage.setItem(chaveDoLocalStorage, JSON.stringify([]));
  }
  listaDoCarrinhoStorage = JSON.parse(localStorage.getItem(chaveDoLocalStorage));
  listaDoCarrinhoStorage.forEach((sku) => {
    addButtonClickListener(sku);
  });
};

const createCustomElementButton = (className, titulo, sku) => {
  const button = document.createElement('button');
  button.className = className;
  button.innerText = titulo;
  button.addEventListener('click', () => {
    addButtonClickListener(sku);
    AddLocalStorage(sku);
  });

  return button;
};

function createProductItemElement(sku, name, image) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElementButton('item__add', 'Adicionar ao carrinho!', sku));

  // return section;
  sectionPaiHtml.appendChild(section);
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const buscandoProdutos = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  data.results.forEach((produto) => {
    createProductItemElement(produto.id, produto.title, produto.thumbnail);
  });
  loadingTag.remove();
};
// const buscandoProduto = async (sku) => {
//   const response = await fetch(`https://api.mercadolibre.com/sites/$SITE_ID/search?q=Motorola%20G6${sku}`);
//   const data = await response.json();
//   data.results.forEach((produto) => {
//     createCartItemElement(produto.id, produto.title, produto.price);
//   });
// };

window.onload = () => {
  buscandoProdutos();
  atualizarCarrinho();
};
