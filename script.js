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

function cartItemClickListener(event) {
  // coloque seu código aqui
  const cartOl = document.querySelector('.cart__items'); // capta ol (carrinho) que é pai do conteúdo a ser removido
  cartOl.removeChild(event.target); // remove filho (li) em que o evento de click acontece (event.target)
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getApiToInsertItemsOnCart = (id) => { // function busca, diretamente da API, dados dos itens que serão inseridos ao carrinho
  const cartOl = document.querySelector('.cart__items'); // capta a Ol que representa o conteúdo do carrinho para adicionar filhos à ela
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((product) => {
      cartOl.appendChild(createCartItemElement({ // adiciona filhos invocando a function que cria o elemento li que irá para o carrinho
        sku: product.id,
        name: product.title,
        salePrice: product.price,
      }));
    });
};

function addButton() { // fuction que habilita o evento de clique aos botões das sections dos produtos
  const addBtn = document.querySelectorAll('.item__add'); // querySelectorAll retorna uma NodeList (array)
  addBtn.forEach((button) => { // array de botões será percorrido e, um a um, habilitados os escutadores de eventos
    button.addEventListener('click', (event) => {
      getApiToInsertItemsOnCart(getSkuFromProductItem(event.target.parentElement)); // invoca a function que capta dados da API tendo 
    }); // como parâmetro a function que busca o innerText do elemento identificando o Id necessário. Dica valiosíssima da colega Dayane Barbosa
  });
}

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
};
