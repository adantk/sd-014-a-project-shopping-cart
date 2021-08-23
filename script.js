const valorTotal = document.querySelector('.total-price');
let count = Number(localStorage.getItem('valor-total'));
valorTotal.innerText = 0;

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
  const itens = document.querySelector('.items');
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  itens.appendChild(section);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function saveStorage() {
  localStorage.setItem('valor-total', count);
}

const subtracao = (event) => {
  console.log(event);
  const numero = Number(event.innerText.split('$')[1]);
  count -= numero;
  valorTotal.innerText = count;
  saveStorage();
};

function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items');
  ol.removeChild(event.target);
  localStorage.setItem('lista', ol.innerHTML);
  subtracao(event.target);
}

function atualizaCarrinho() {
  const atualizaLi = document.querySelectorAll('.cart__item');
  atualizaLi.forEach((arrayLi) => arrayLi.addEventListener('click', cartItemClickListener));
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// window.onload = () => { };
// const carregaLoading = () => {
//   const textoLoading = document.createElement('p');
//   textoLoading.classList.add = 'loading';
//   textoLoading.innerHTML = 'Loading ...';
//   document.body.appendChild(textoLoading);
// 

// function sum() {
//   if (totalPrice === null) {
//     totalPrice = '0';
//   }

//   let totPrice = parseFloat(totalPrice.innerText);
//   console.log(typeof totPrice);
//   let count = 0;
//   const pegaList = document.querySelectorAll('.cart__item');
//   totPrice.innerHTML = count;
//   let ultimoclickNum = parseFloat(pegaList[pegaList.length - 1].innerText.split('$')[1]);

//  let soma =  ultimoclickNum + ultimoclickNum;
//  console.log(soma);
// }

const sum = () => {
  const pegaList = document.querySelectorAll('.cart__item');
  const num = Number(pegaList[pegaList.length - 1].innerText.split('$')[1]);
  count += num;
  valorTotal.innerText = count;
  saveStorage();
};

const segundaApi = (id) => {
  const pcItemOl = document.querySelector('.cart__items');
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json()
      .then((computador) => {
        pcItemOl.appendChild(createCartItemElement({
          sku: computador.id, name: computador.title, salePrice: computador.price,
        }));
        sum();
        localStorage.setItem('lista', pcItemOl.innerHTML);
      }));
};

function buttonAdicionar() {
  const botaoAdicionar = document.querySelectorAll('.item__add');
  botaoAdicionar.forEach((botao) => {
    botao.addEventListener('click', (event) => {
      segundaApi(getSkuFromProductItem(event.target.parentElement));
    });
  });
}

function limparCarrinho() {
  const btLimpaCarrinho = document.querySelector('.empty-cart');
  const OlItensEscolhidos = document.getElementById('ol__items');
  btLimpaCarrinho.addEventListener('click', () => {
    OlItensEscolhidos.innerHTML = '';
   valorTotal.innerText = 0;
    localStorage.clear();
  });
}

// function criarLoading() {
//    const loading = document.createElement('p');
//   textoLoading.classList.add = 'loading';
//   textoLoading.innerHTML = 'Loading ...';
//   document.body.appendChild(textoLoading);
// }

function storageValorFinal() {
  const ol = document.getElementById('ol__items');
  valorTotal.innerText = count;
  ol.innerHTML = localStorage.getItem('lista');
}

function fetchApiProduct() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json()
      .then((computadores) =>
        computadores.results.forEach((comput) => {
          createProductItemElement({ sku: comput.id, name: comput.title, image: comput.thumbnail });
        }))
        .then(() => {
          const loading = document.querySelector('.loading');
          const body = document.querySelector('body');
          body.removeChild(loading);
        })
      .then(() => buttonAdicionar())
      .then(() => storageValorFinal())
      .then(() => atualizaCarrinho()));
}

window.onload = () => {
  fetchApiProduct();
  limparCarrinho();
};
