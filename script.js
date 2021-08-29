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

const valorTotal = () => {
  const precosTotais = document.createElement('span');
  const itensCarrinho = document.querySelectorAll('.cart__item');
  let soma = 0;
  if (document.querySelector('.total-price')) {
    document.querySelector('.total-price').remove();
  }
  itensCarrinho.forEach((item) => {
    const precoItem = item.innerText.split('$')[1];
    soma += parseFloat(precoItem);
  });
  precosTotais.className = 'total-price';
  precosTotais.innerText = `${soma}`;
  document.querySelector('.cart').appendChild(precosTotais);
};

function cartItemClickListener(event) {
  event.target.remove();
  valorTotal();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const btnParaCarrinho = () => {
  const btn = document.querySelectorAll('.item__add');
  btn.forEach((item) =>
    item.addEventListener('click', async (event) => {
      const carrinho = document.querySelector('.cart__items');
      const elemento = event.target.parentElement;
      const sku = elemento.firstChild.innerText;
      const listaProdutos = await fetch(`https://api.mercadolibre.com/items/${sku}`)
        .then((resposta) => resposta.json());
      carrinho.appendChild(createCartItemElement(listaProdutos));
      valorTotal();
      localStorage.setItem('stored', carrinho.innerHTML);
    }));
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const secaoItem = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('btn', 'item__add', 'Adicionar ao carrinho!'),
  );
  secaoItem.appendChild(section);
  return secaoItem;
}

const getProductList = async () => {
  const loading = createCustomElement('h1', 'loading', 'loading');
  loading.className = 'loading';
  document.body.appendChild(loading);
  const listaProdutos = await fetch(
    'https://api.mercadolibre.com/sites/MLB/search?q=computador',
  ).then((resposta) => resposta.json())
    .then((data) => data.results);
  listaProdutos.forEach((produto) => {
    createProductItemElement(produto);
  });
  btnParaCarrinho();
  loading.remove();
};

const emptyCart = () => {
  const itensCarrinho = document.querySelectorAll('.cart__item');
  itensCarrinho.forEach((item) => item.remove());
  localStorage.clear();
  valorTotal();
};

const itensComprados = () => {
  if (localStorage.getItem('stored')) {
    const itensCarrinho = document.querySelector('.cart__items');
    itensCarrinho.innerHTML
      += localStorage.getItem('stored');
    itensCarrinho.childNodes.forEach((item) => {
      item.addEventListener('click', cartItemClickListener);
    });
    valorTotal();
  }
};

window.onload = () => {
  getProductList();
  document.querySelector('.empty-cart').addEventListener('click', emptyCart);
  itensComprados();
};
