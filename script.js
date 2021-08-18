const cartItemss = '.cart__items';
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
// requisito 5
const sumPrices = () => { 
  const cartItem = document.querySelectorAll('.cart__item'); 
  const totalPrice = document.querySelector('.total-price'); 
  let sum = 0; 
  cartItem.forEach((item) => { 
    const price = (item.innerText).split('$')[1]; 
    sum += parseFloat(price); 
  }); 
  totalPrice.innerText = sum; 
  // console.log(totalPrice); 
}; 

// Requisito 4 - parte 1
const localSSave = () => {
  const ol = document.querySelector(cartItemss);
  // console.log(ol.innerHTML);
  localStorage.setItem('itensDeProdutos', ol.innerHTML);
};

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

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  localSSave(); // toda vez que eu remover algo, salva no localStorage
  sumPrices();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchFreeMarketAsync = async (QUERY) => {
  const responseRaw = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`);
  const responseJson = await responseRaw.json(); // my object
  const arrayResults = responseJson.results; // produtos
  const listItens = document.querySelector('.items');
  arrayResults.forEach((product) => {
    const infosOfObject = {
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    };
  listItens.appendChild(createProductItemElement(infosOfObject));
});
};

const btnAddCarAsync = () => {
  const btns = document.querySelectorAll('.item__add');
  // console.log(btns);
  btns.forEach((btn) => {
    btn.addEventListener('click', async (event) => {
      const itemID = getSkuFromProductItem(event.target.parentElement);
      const responseRaw = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
      // console.log(responseRaw);
      const responseJson = await responseRaw.json();
      const productSelect = document.querySelector(cartItemss);
      productSelect.appendChild(createCartItemElement({ 
        sku: responseJson.id,
        name: responseJson.title,
        salePrice: responseJson.price }));
      localSSave(); // salva no localStorage
      sumPrices();
    });
  });
};

// tem aver com o requisito 4 - parte 2
const resLocalS = () => {
  const ol = document.querySelector(cartItemss);
  ol.innerHTML = localStorage.getItem('itensDeProdutos'); 
  document.querySelectorAll('.cart__item').forEach((itemDelet) => {
    itemDelet.addEventListener('click', cartItemClickListener);
  });
};

const clearBtn = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
  document.querySelector(cartItemss).innerText = '';
  localStorage.clear();
  sumPrices();
});
};

window.onload = async () => { 
  await fetchFreeMarketAsync('computador');
  resLocalS();
  btnAddCarAsync();
  sumPrices();
  clearBtn();
};