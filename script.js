const secaoItens = document.querySelector('.items');
const listaCompras = document.querySelector('.cart__items');
const localValor = document.querySelector('.total-price');

function retornoAPI(url) {
  if (url === 'https://api.mercadolibre.com/sites/MLB/search?q=computador') {
    return fetch(url)
    .then((r) => r.json())
    .then((r) => r.results);
  }
  return fetch(url)
  .then((r) => r.json());
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function guardaPreco2(price, op) {
  let total = parseFloat(localStorage.getItem('total'));
  if (op === 'soma') total += price;
  if (op === 'sub') total -= price;
  localStorage.setItem('total', total);
  //  console.log(lista);
}

function guardaPreco({ price }, op) {
  console.log(op);
  if (localStorage.getItem('total') === null) {
    localStorage.setItem('total', price);
  } else {
    guardaPreco2(price, op);
  }
}

function inserePrecoNoDom() {
  const valor = localStorage.getItem('total');
  //  console.log(valor);
  localValor.innerText = valor;
}

//  https://www.w3schools.com/jsref/jsref_splice.asp
async function cartItemClickListener(event) {
  // coloque seu código aqui
  //  console.log(event.target);
  const sku = event.target.innerText.split(' ')[1];
  //  console.log(sku);
  const lista = localStorage.getItem('carrinho').split(',');
  lista.find((item, index) => (item === sku ? lista.splice(index, 1) : false));
  localStorage.setItem('carrinho', lista);
  listaCompras.removeChild(event.target);
  const objeto = await retornoAPI(`https://api.mercadolibre.com/items/${sku}`);
  guardaPreco(objeto, 'sub');
  inserePrecoNoDom();
  //  guardaPreco(objeto, 'sub');
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function guardaCarrinho({ id }) {
  const lista = [];
  if (localStorage.getItem('carrinho') === null) {
    lista.push(id);
    localStorage.setItem('carrinho', lista);
  } else {
    const listaVelha = localStorage.getItem('carrinho').split(',');
    listaVelha.forEach((item) => lista.push(item));
    lista.push(id);
    localStorage.setItem('carrinho', lista);
    //  console.log(lista);
  }
}

async function pegaItem(evento) {
  //  console.log(evento.target.parentNode.firstChild);
  const id = evento.target.parentNode.firstChild.innerText;
  const objeto = await retornoAPI(`https://api.mercadolibre.com/items/${id}`);
  guardaCarrinho(objeto);
  listaCompras.appendChild(createCartItemElement(objeto));
  guardaPreco(objeto, 'soma');
  inserePrecoNoDom();
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', pegaItem);
  }
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

async function inserePCNoDOM() {
  const itens = await retornoAPI('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  itens.forEach((item) => {
    const produto = createProductItemElement(item);
    secaoItens.appendChild(produto);
  });
}
inserePCNoDOM();

/*  function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function verificacaoInicial() {
  const lista = localStorage.getItem('carrinho').split(',');
  lista.forEach((item) => {
    retornoAPI(`https://api.mercadolibre.com/items/${item}`)
    .then((r) => listaCompras.appendChild(createCartItemElement(r)));
  });
  //  console.log(lista);
}

window.onload = () => {
  if (localStorage.getItem('carrinho') !== null) {
    if (localStorage.getItem('carrinho') === '') {
      localStorage.clear();
    } else {
      verificacaoInicial();
      inserePrecoNoDom();
    }
  }
};
