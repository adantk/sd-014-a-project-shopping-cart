const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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
// requisição API para obter os produtos, e dar um json neles!
const getFenchAPI = async () => {
  const resposta = await fetch(endpoint);
  const resultado = await resposta.json();
  return resultado.results;
};
const appenItem = (item) => {
  document.querySelector('.items').appendChild(item);
};
// desestruturo a lista de produtos, e utilizo as chaves que preciso, para criar um novo objeto que só contem elas.
const listOfProducts = async () => {
    const products = await getFenchAPI();
    products.forEach((product) => {
      const { id, title, thumbnail } = product;
      const newProduct = { sku: id, name: title, image: thumbnail };
      // adiciona cada produto como filho de <section class="items">, um a um.
      appenItem(createProductItemElement(newProduct));
    });
    document.querySelector('.loading').remove();
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  if (event.target.classList.contains('cart__item')) {
    event.target.remove();
    const carrinhoInfo = document.getElementsByClassName('cart__items')[0];
    localStorage.setItem('infoCart', JSON.stringify(carrinhoInfo.innerHTML));
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requisiçao para pegar o item
const infoProdutoSelecionado = async (idProduto) => {
  const requisicao = await fetch(`https://api.mercadolibre.com/items/${idProduto}`);
  const requisicaoJson = await requisicao.json();
  const { id, title, price } = requisicaoJson;
  const newProduct = { sku: id, name: title, salePrice: price };
  return newProduct;
};

// Adiciona o elemento retornado da função createCartItemElement(product) como filho do elemento <ol>
const adicionaProdutoNoCarrinho = async (event) => {
  if (event.target.classList.contains('item__add')) {
    const idProduto = getSkuFromProductItem(event.target.parentElement);
    const infoProduct = await infoProdutoSelecionado(idProduto);
    const carrinho = document.getElementsByClassName('cart__items')[0]; 
    carrinho.appendChild(createCartItemElement(infoProduct));
    const innerInfo = carrinho.innerHTML;
    localStorage.setItem('infoCart', JSON.stringify(innerInfo));
    console.log(infoProduct.salePrice);
  }
};

// Fução que zera o innerHTML da <ol class='cart__items'>, toda vez que apertado o <button class='empty-cart'>
const esvaziarCarrinho = () => {
  document.querySelector('.cart__items').innerHTML = '';
  localStorage.setItem('infoCart', JSON.stringify(''));
};

window.onload = async () => {
  await listOfProducts();
  document.querySelector('.items').addEventListener('click', adicionaProdutoNoCarrinho);
  const carrinho1 = document.querySelector('.cart__items');
  carrinho1.addEventListener('click', cartItemClickListener);
  carrinho1.innerHTML = JSON.parse(localStorage.getItem('infoCart'));
  const btnEsvaziar = document.querySelector('.empty-cart');
  btnEsvaziar.addEventListener('click', esvaziarCarrinho);
};