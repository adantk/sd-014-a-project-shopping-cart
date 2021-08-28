// const salvando as classes
const btnclearcart = document.querySelector('.empty-cart');
const cartItems = document.querySelector('.cart__items');
const totalValue = document.querySelector('.total-price'); // ps: usei span no html pq a tag embuti na div
const cartItem = document.querySelectorAll('.cart__item');

// requisito 6
function clearCart() {
  btnclearcart.addEventListener('click', () => {
    totalValue.innerHTML = '0'; // preço total igual é zerado
    localStorage.clear();
    cartItem.forEach((item) => {
      item.parentNode.removeChild(item); // A propriedade parentNode retorna o nó pai do nó especificado, como um objeto Node W3 School
    });
    localStorage.setItem('savedCart', cartItems.innerHTML = '');
  });
}
// Requisito 4.1
// const savedCartLocal = () => {
//  localStorage.setItem('savedCart', cartItems.innerHTML);
// };

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
  const item = document.querySelector('.items');
  const section = document.createElement('section');
  item.appendChild(section);
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const getApi = async () => {
  const api = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador'); 
  const respostaApi = await api.json(); 
  respostaApi.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
    createProductItemElement({ sku, name, image });
  });
  // console.log(respostaApi)
};
// ;

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}
// FUNCAO ORIGINAL - Parte Requisito 2
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// Requisito 2.2 Pegar API por ID
const getApi2 = async (ItemID) => {
  const api = await fetch(`https://api.mercadolibre.com/items/${ItemID}`); 
  const respostaApi = await api.json(); 
  const { id, title, price } = respostaApi;
  const ol = document.querySelector('.cart__items');
  ol.appendChild(createCartItemElement({ sku: id, name: title, salePrice: price }));
};
// getApi2('MLB1341706310');

// minha func. pra pegar botao
const btnsAddItem = () => {
  const itemAdd = document.querySelectorAll('.item__add'); // querySelectorAll retorna um array;
  itemAdd.forEach((btn) => btn.addEventListener('click', (event) => {
    const sku = event.target.parentNode.firstChild.innerText; // innerText pega só o texto dentro do elemento;
    getApi2(sku);
  })); 
};

window.onload = async () => {
  await getApi();
  clearCart();
  btnsAddItem();
 };