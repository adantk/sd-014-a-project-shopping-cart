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

function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items');
  ol.removeChild(event.target);
  localStorage.setItem('lista', ol.innerHTML);
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

const segundaApi = (id) => {
  const pcItemOl = document.querySelector('.cart__items');
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((computador) => {
      pcItemOl.appendChild(createCartItemElement({
        sku: computador.id, name: computador.title, salePrice: computador.price,
      }));
      localStorage.setItem('lista', pcItemOl.innerHTML);
      // const liStorage = localStorage.getItem('lista');
      // console.log(liStorage);
      // const liObjeto = JSON.parse(liStorage);
      // return liObjeto;
    });
};

function buttonAdicionar() {
  const botaoAdicionar = document.querySelectorAll('.item__add');
  botaoAdicionar.forEach((botao) => {
    botao.addEventListener('click', (event) => {
      segundaApi(getSkuFromProductItem(event.target.parentElement));
    });
  });
}

// function cartItemClickListener(event) {
//    const ol = document.querySelector('.cart__items');
//   const limpaItemLi = document.querySelectorAll('.cart__item');
//   limpaItemLi.forEach((clear) => {
//   clear.addEventListener('click', () => {
//   const pcSelecionado = clear;
//    if (event.target.classList.contains('cart__item')) { 
//   ol.removeChild(pcSelecionado);
//   }
//    });
//   });
//   }
//  refatorando com ajuda do MaTheus Souza e Thiago Oliveira

//   const container = document.querySelector('.container');
//   const botaoLimpar = document.createElement('button');
//   botaoLimpar.classList.add('empty-cart');
//   botaoLimpar.innerText = 'Limpar Carrinho';
//   botaoLimpar.appendChild(container);
//   return botaoLimpar;

function limparCarrinho() {
  const btLimpaCarrinho = document.querySelector('.empty-cart');
  const OlItensEscolhidos = document.getElementById('ol__items');
  btLimpaCarrinho.addEventListener('click', () => {
    OlItensEscolhidos.innerHTML = '';
    localStorage.clear();
  });
}
// function loading() {
//   const campoAcionaLoading = document.createElement('div');
//   campoAcionaLoading.classList.add('loading');
//   campoAcionaLoading.style.backgroundColor = 'pink';
//   campoAcionaLoading.addEventListener('click', () => {
//     campoAcionaLoading.innerHTML = 'Carregando, aguarde...';
//     campoAcionaLoading.innerHTML = '';
//     return campoAcionaLoading;
//   });
// }
// loading();

function fetchApiProduct() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json()
      .then((computadores) =>
        computadores.results.forEach((comput) => {
          createProductItemElement({ sku: comput.id, name: comput.title, image: comput.thumbnail });
        }))
      .then(() => buttonAdicionar()));
}

window.onload = () => {
  fetchApiProduct();
  limparCarrinho();
  const ol = document.getElementById('ol__items');
  ol.innerHTML = localStorage.getItem('lista');
  atualizaCarrinho();
};
