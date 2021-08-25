const endPoints = {
  computer: 'https://api.mercadolibre.com/sites/MLB/search?q=',
  item: 'https://api.mercadolibre.com/items/',     
};

// salvar dados da lista
// remover dados da lista
// retornar dados salvos

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

// busca id do produto
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const listaCarrinho = document.querySelector('.cart__items');

function clearList() {
  listaCarrinho.innerHTML = ''; 
  localStorage.setItem('store', JSON.stringify(listaCarrinho.innerHTML));
}

document.querySelector('.empty-cart').addEventListener('click', clearList);
// limpa carrinho, executando função clearList
function cartItemClickListener(event) {
  if (event.target.classList.contains('cart__item')) {
    event.target.remove();  
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}

async function fetchData(endpoint, query) {
  const api = `${endpoint}${query || ''}`;
  const response = await fetch(api);
  const json = await response.json();
  return json;
}// ajuda dos colegas.(modificado para ficar dinamico.)

async function addProducts(section) {
  const products = await fetchData(endPoints.computer, 'computador')
  .then((json) => json.results);  
  products.forEach(({ id: sku, title: name, thumbnail: image }) => {
      const product = createProductItemElement({ sku, name, image });
      section.appendChild(product);    
  });
  document.querySelector('.loading').remove();
}// ajuda dos colegas.

async function addCart(event) {
    if (event.target.classList.contains('item__add')) { 
    const productId = getSkuFromProductItem(event.target.parentElement);
    const productInfo = await fetchData(endPoints.item, productId)
      .then(({ title: name, price: salePrice }) => (
        { sku: productId, name, salePrice } 
      ));
    const productElement = createCartItemElement(productInfo);
    // salva no webstorage.
    listaCarrinho.appendChild(productElement);
    localStorage.setItem('store', JSON.stringify(listaCarrinho.innerHTML));
  }
}

listaCarrinho.addEventListener('click', cartItemClickListener);

async function eventPage() {
  const listaProdutos = document.querySelector('.items');
  await addProducts(listaProdutos);
  listaProdutos.addEventListener('click', addCart);
}
 
window.onload = () => {
  eventPage();
  listaCarrinho.innerHTML = JSON.parse(localStorage.getItem('store'));
  console.log(listaCarrinho.innerHTML);  
};