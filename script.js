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
 const btnAdd = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
 // btnAdd.addEventListener('click', addCarrinho);
  btnAdd.addEventListener('click', () => {
    // console.log(event.target);
    // console.log(sku);
    fetchItens(sku);
  });
  
  section.appendChild(btnAdd);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
 const itemRemover = event.target;
 itemRemover.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  addLocalStorage()
  return li;
}

const fetchApi = async () => {
  const produto = 'computador';
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${produto}`;
  const response = await fetch(endpoint); // retorna uma promise
  const responseJson = await response.json(); // json retorna uma promise
  return responseJson.results;
    /* Estudo realizado junto com o Gustavo Dias - forma de explicar direfente de como verificar se a Promise esta tendo o retorno desejado. */
    // if (response.ok) { 
    //   const jsonResponse = await response.json();
    //  return jsonResponse;
    // }
};

const getProduto = async () => {
  const produtos = await fetchApi();
  const item = document.querySelector('.items'); 
  // pegando a classe e criando nossos elementos (produtos) com o forEach de baixo

  produtos.forEach((resul) => {
    item.appendChild(createProductItemElement(
      { 
        sku: resul.id, 
        name: resul.title,
        image: resul.thumbnail,
      },
      ));
  });
  // console.log(produtos.results);
};

function addCarrinho(idItem) {
  // console.log(idItem);
  const itemId = createCartItemElement( // envia os parametros do id do item recebido para a função createCartItemElement
    { sku: idItem.id, 
      name: idItem.title, 
      salePrice: idItem.price,
    },
  );
    const itemCarrinho = document.querySelector('.cart__items');
    itemCarrinho.appendChild(itemId);
    
}
// 2
const fetchItens = async (itemId) => {
  // console.log(itemId);
  const fetchItem = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
  const responseItem = await fetchItem.json();
  // console.log(responseItem);
  addCarrinho(responseItem);
  return responseItem;
};

// 4 - Adicionando no LocalStorage
function addLocalStorage() {
  console.log('add');
  const listaItem = document.getElementsByClassName('cart__items');
  // if (listaItems.length > 0) {
    console.log('estamos aqui'); 
    localStorage.setItem('carrinho', listaItem.innerHTML);
  
}

function valorTotalCarrinho() {
  const listaItem = document.getElementsByClassName('cart__items');
  console.log(listaItem.price);
}
valorTotalCarrinho();
window.onload = () => { 
  fetchApi();
  getProduto();
};
