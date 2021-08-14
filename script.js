const sectionItens = document.querySelector('.items');
const cartItens = document.querySelector('.cart__items');
const valorfinal = document.querySelector('.total-price');
const botaoEsvaziar = document.querySelector('.empty-cart');
const h1 = document.createElement('h1');
const body = document.querySelector('body');
let soma = 0;
valorfinal.innerHTML = 0;

// função de click para esvaziar o carrinho e resetar o preço.
botaoEsvaziar.addEventListener('click', () => {
  cartItens.innerHTML = '';
  valorfinal.innerHTML = 0;
  soma = 0;
});

// função de loanding, ele roda enqunato os produtos da API não carregam e é apagado apos os produtos aparecer.
function loadingApi() {
  h1.classList.add('loading');
  h1.innerHTML = 'LOADING...';
  body.appendChild(h1);
}

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

// função implementada para remover o item da lista clicando encima dele.
function cartItemClickListener(event) {
  const evento = event.target;
  cartItens.removeChild(evento);
  const valorString = evento.innerHTML.split('$');
  const valorNumber = parseFloat(valorString[1]);
  soma -= valorNumber;
  valorfinal.innerText = Math.round(soma * 100) / 100;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// função para fazer a soma dos produtos que são adiconados ao carrinho.
function somandoValorCarrinho(valor) {
  soma += valor;
  valorfinal.innerText = Math.round(soma * 100) / 100;
}

// função para adicionar os produtos no carrinho de compras!
function adiconandoALista(idSKU) {
  fetch(`https://api.mercadolibre.com/items/${idSKU}`)
    .then((itemSelecionado) => itemSelecionado.json().then((pc) => {
      const objetoPc = { sku: pc.id, name: pc.title, salePrice: pc.price };
      cartItens.appendChild(createCartItemElement(objetoPc));
      somandoValorCarrinho(pc.price);
    }));
}

// função de click para pegar o id do produto e adicionar ele na lista de compras.
function pegandoIdProduto() {
  const buttom = document.querySelectorAll('.item__add');
  buttom.forEach((botaoAdd) => {
    botaoAdd.addEventListener('click', (event) => {
      const evento = event.target;
      adiconandoALista(getSkuFromProductItem(evento.parentNode));
    });
  });
}

// função para pegar a API e adicionar os produtos na pagina.
const mercadoLivre = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((itensMercadoLivre) => {
      itensMercadoLivre.json().then((produtos) => {
        produtos.results.forEach((pc) => {
          const objetoPc = { sku: pc.id, name: pc.title, image: pc.thumbnail };
          sectionItens.appendChild(createProductItemElement(objetoPc));
        });
      }).then(() => pegandoIdProduto())
        .then(() => body.removeChild(h1));
    });
};

window.onload = () => {
  loadingApi();
  mercadoLivre();
};
