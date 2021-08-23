const cartOl = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// Requisito 1 - function fornecida que cria elementos (quadro de produtos)
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Requisito 1 - implementa function invocada na fetchApiProducts que marca o quadro de produtos na mainSection
function createProductItemElement({ sku, name, image }) {
  const mainSection = document.querySelector('.items'); // captura a section superior (.items) para adicionar filhos à ela
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  mainSection.appendChild(section); // adiciona sections criadas como filhos da section superior (.items)

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Requisito 4 - function que cria o localStorage
function setLocalStorage() {
  localStorage.setItem('local-cart', cartOl.innerHTML);
}

// Requisito 3 - implementa a function
function cartItemClickListener(event) {
  // coloque seu código aqui
  const cart = document.querySelector('.cart__items'); // capta ol (carrinho) que é pai do conteúdo a ser removido
  // const li = document.querySelectorAll('.cart-item');
  let count = Number(totalPrice.innerText);
  const num = event.target.innerText.split('$')[1];
  count -= num;
  totalPrice.innerText = count;
  cart.removeChild(event.target); // remove filho (li) em que o evento de click acontece (event.target)
  setLocalStorage(); // Requisito 4 - invoca function que faz setItem atualizando-o após remover um item do carrinho
}

// Requisito 4 - function que captura o localStorage e coloca elementos no carrinho
function getLocalStorage() {
  cartOl.innerHTML = localStorage.getItem('local-cart');
}

// Requisito 4 - function que reativa o escutador de evento no carrinho criado da localStorage
function listenerCartFromLocal() {
  const cartLi = document.querySelectorAll('.cart__item');
  cartLi.forEach((item) => item.addEventListener('click', cartItemClickListener));
}

// Requisito 2 - function que é chamada, cria elementos li, que são colocados como filhos de cartOl (carrinho)
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
function sumTotal() {
  let count = Number(totalPrice.innerText);
  const pegaList = document.querySelectorAll('.cart__item');
  const num = Number(pegaList[pegaList.length - 1].innerText.split('$')[1]);
  count += num;
  totalPrice.innerText = count;
}

// Requisito 2 - fetch da Api
const getApiToInsertItemsOnCart = (id) => { // function busca, diretamente da API, dados dos itens que serão inseridos ao carrinho
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((product) => {
      cartOl.appendChild(createCartItemElement({ // adiciona filhos invocando a function que cria o elemento li que irá para o carrinho
        sku: product.id,
        name: product.title,
        salePrice: product.price,
      }));
      setLocalStorage(); // Requisito 4 - invoca function que faz o setItem após adicionar itens ao carrinho
      sumTotal();
    });
};

// Requisito 2 - button function
function addButton() { // fuction que habilita o evento de clique aos botões das sections dos produtos
  const addBtn = document.querySelectorAll('.item__add'); // querySelectorAll retorna uma NodeList (array)
  addBtn.forEach((button) => { // array de botões será percorrido e, um a um, habilitados os escutadores de eventos
    button.addEventListener('click', (event) => {
      getApiToInsertItemsOnCart(getSkuFromProductItem(event.target.parentElement)); // invoca a function que capta dados da API tendo 
    }); // como parâmetro a function que busca o innerText do elemento identificando o Id necessário. Dica valiosíssima da colega Dayane Barbosa
  });
}

// Requisito 1
function fetchApiProducts(item) {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`)
    .then((response) => response.json()
      .then((products) => products.results.forEach((product) => {
        createProductItemElement({
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        });
      }))
      .then(() => addButton()));
}

window.onload = () => {
  fetchApiProducts('computador'); // para alterar o produto buscado da API basta modificar o parâmetro desta function
  getLocalStorage();
  listenerCartFromLocal();
};
