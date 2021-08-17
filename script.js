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

const localSSave = () => {
  const ol = document.querySelector('.cart__items');
  // console.log(ol.innerHTML);
  localStorage.setItem('itensDeProdutos', ol.innerHTML);
};

const resLocalS = () => {
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = localStorage.getItem('itensDeProdutos'); 
  // ol.forEach((itemDelet) => {
  //   itemDelet.addEventListener('click', (event) => {
  //   event.target.remove();
  //   });
  // });
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
      const productSelect = document.querySelector('.cart__items');
      productSelect.appendChild(createCartItemElement({ 
        sku: responseJson.id,
        name: responseJson.title,
        salePrice: responseJson.price }));
      localSSave(); // salva no localStorage
    });
  });
};

window.onload = async () => { 
  await fetchFreeMarketAsync('computador');
  resLocalS();
  btnAddCarAsync();
};
