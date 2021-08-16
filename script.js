const listagemProdutos = document.getElementsByClassName('items');
const selector = '.cart__items';
const carrinho = document.getElementsByClassName('cart__items');
const selector2 = '.total-price';
const itensCarrinho = document.getElementsByClassName('cart__item');

function totalPriceShow() {
  const totalP = document.querySelector(selector2);
  const pricesArray = Array.prototype.map.call(itensCarrinho, (item) => parseFloat(item.id));
  let totalPrice;
  if (pricesArray.length === 0) {
    totalPrice = 0;
   } else { totalPrice = pricesArray.reduce((acc, number) => acc + number); }
  totalP.innerText = totalPrice;
  localStorage.setItem('TotalPrice', totalPrice);
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

function cartItemClickListener(item) {
  // coloque seu código aqui
  totalPriceShow();
  item.addEventListener('click', (event) => {
    carrinho[0].removeChild(event.target);
    totalPriceShow();
    const cart = document.querySelector(selector);
    localStorage.setItem('Storage', cart.innerHTML);
    const totalPrice = document.querySelector(selector2);
    localStorage.setItem('TotalPrice', totalPrice.innerText);
  });
}

function refreshCartItemClickListener() {
  // coloque seu código aqui
  Array.prototype.forEach.call(itensCarrinho, (item) => cartItemClickListener(item));
    totalPriceShow();
    const cart = document.querySelector(selector);
    localStorage.setItem('Storage', cart.innerHTML);
    const totalPrice = document.querySelector(selector2);
    localStorage.setItem('TotalPrice', totalPrice.innerText);
}

function refreshLocalStorage() {
  const localCart = document.querySelector(selector);
  localCart.innerHTML = localStorage.getItem('Storage');
  refreshCartItemClickListener();
  const totalPrice = document.querySelector(selector2);
  totalPrice.innerHTML = localStorage.getItem('TotalPrice');
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = salePrice;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}

function jsonObject(json) {
  return {
    sku: json.id,
    name: json.title,
    salePrice: json.price,
  };
}

const addToCartButton = () => {
  const addCarrinho = document.querySelectorAll('.item__add'); // Busca todos os botões das 'caixas' informativas dos produtos
  addCarrinho.forEach((button) => {
    button.addEventListener('click', (target) => { // Ao clicar, executa a função descrita
    const alvo = target.target.previousSibling.previousSibling.previousSibling.innerText;
    fetch(`https://api.mercadolibre.com/items/${alvo}`)
      .then((data) => data.json()) // Transforma a info recebida em JSON
      .then((json) => { carrinho[0].appendChild(createCartItemElement(jsonObject(json))); })
      .then(() => {
        const carrinhoNode = document.querySelector(selector);
        cartItemClickListener(carrinhoNode.lastChild);
        localStorage.setItem('Storage', carrinhoNode.innerHTML);
      });
    });
  });
};

const getItemsFromML = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador') // Acessa a API do Mercado Livre
    .then((data) => data.json()) // Transforma a info recebida em JSON
    .then((json) => {
      json.results.forEach((product) => {
        const infos = { // Cons Infos vai ser o objeto parametro a ser enviado para a função createProductItemElement
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        };
        listagemProdutos[0].appendChild(createProductItemElement(infos)); // Chama a função createProduct... e a section criada nela (com as informações do produto) são adicionadas (appendChild) na section #items
      });
    })
    .then(() => addToCartButton());
};

function clearCart() {
  const cart = document.querySelector(selector);
  while (cart.lastElementChild) {
    cart.removeChild(cart.lastElementChild);
  }
  totalPriceShow();
  localStorage.clear();
}

window.onload = () => {
  getItemsFromML();
  document.querySelector('.empty-cart').addEventListener('click', clearCart);
  if (localStorage) { refreshLocalStorage(); }
};
