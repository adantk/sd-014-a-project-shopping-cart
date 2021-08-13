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

function createProductItemElement({ sku, name, image }) { // SKU: código identificador do produto, utilizado para controle do estoque
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

// Requisito 3
function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requisito 1
const getItems = async () => {
  const query = 'computador';
  // const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;

  const request = await fetch(endpoint);
  const response = await request.json();
  const getResult = response.results;

  const items = document.querySelector('.items');
  getResult.forEach(({ title, id, thumbnail }) => {
    items.appendChild(createProductItemElement({
      name: title,
      sku: id,
      image: thumbnail,
    }));
  });
};
// Agradeço ao Matheus Martino pela monitoria de revisão do Bloco 9!

// Requisito 2
const addToCart = async () => {
  const cartItems = document.querySelector('.cart__items');
  const itemList = document.querySelectorAll('.item__add');
  console.log(itemList);
  itemList.forEach((buttonItem) => { // Adicionando um escutador de eventos para cada elemento (botão) da minha lista de itens
    buttonItem.addEventListener('click', async (event) => {
    const itemID = getSkuFromProductItem(event.target.parentElement);
    const endpoint = `https://api.mercadolibre.com/items/${itemID}`;
    
    const request = await fetch(endpoint);
    const response = await request.json();
    const item = { // Adicionando as informações do produto ao carrinho 
      sku: response.id,
      name: response.title,
      salePrice: response.price,
    };
    cartItems.appendChild(createCartItemElement(item));
    });
  });
};

// addToCart();

window.onload = async () => { // async para organizar o tempo entre criar a lista de produtos, adicionar botões e adicionar produtos ao carrinho 
  await getItems(); 
  addToCart();
};
