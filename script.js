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

// req 5
function totalPrice() { 
  if (document.querySelector('.total-price')) {
    document.querySelector('.total-price').remove();
  }
  const prices = createCustomElement('div', 'total-price', 'Preço Total:');
  const li = document.querySelectorAll('.cart__item');
  let sum = 0;
  li.forEach((item) => {
    sum += parseFloat(item.id);
    prices.innerHTML = sum;
  });
  document.querySelector('.cart').appendChild(prices);
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

// req 3 deleta itens individuais no carrinho;
function cartItemClickListener(event) {
event.target.remove();

// salva lista depois de remover itens desejados;
const ol = document.querySelector('.cart__items');
localStorage.setItem('cartItems', ol.innerHTML);

totalPrice();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.id = salePrice;
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// req 1 - cria fetch com produtos de computadores e adiciona estes produtos na tela pela função createProductItemElement;
// requisito 7 - mensagem de loading antes da api aparecer e é removida depois que a API aparece;
async function fetchComputer(query) {
  const loading = createCustomElement('h1', 'loading', 'loading...');
  document.body.appendChild(loading);

  const json = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => response.json())
    .then((data) => data.results);

    json.forEach((item) => document.querySelector('.items')
    .appendChild(
      createProductItemElement({ sku: item.id, name: item.title, image: item.thumbnail }),
      ));

      loading.remove();
}

// req 2 - adiciona itens ao carrinho;
const itemAdd = () => {
  const button = document.querySelectorAll('.item__add');

  button.forEach((btn) =>
  btn.addEventListener('click', async (event) => {
    const id = event.target.parentElement.firstChild.innerText;
  
    const resp = await fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json());

    const ol = document.querySelector('.cart__items');
    ol.appendChild(
      createCartItemElement({ sku: resp.id, name: resp.title, salePrice: resp.price }),
      );

      // salva lista de itens no localStorage (req 4);
      localStorage.setItem('cartItems', ol.innerHTML);
      totalPrice();
  }));
};

// req 4 - mantém itens do carrinho ao reiniciar a página;
const saveCartItems = () => {
  const ol = document.getElementsByClassName('cart__items')[0];
  const savedItems = localStorage.getItem('cartItems');
  ol.innerHTML = savedItems;

  // necessário criar um li para que possa remover os itens salvos ao clicar na lista;
  const li = document.querySelectorAll('.cart__item');
  li.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
};

// req 6 - apagar carrinho;
const emptyCart = () => {
  // remove list salva no storage
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    localStorage.clear();
    // remove lista impressa na tela;
    document.querySelectorAll('.cart__item').forEach((item) => item.remove());
    totalPrice();
  });
};

window.onload = async () => {
await fetchComputer('computer');
await itemAdd();
await saveCartItems();
await totalPrice();
await emptyCart();
};
