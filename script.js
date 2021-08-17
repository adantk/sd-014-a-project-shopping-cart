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

// Requisito 3 - Mudei de lugar pq o lint tava chorando
function cartItemClickListener(event) {
  event.target.remove();
}

// Mudei de lugar pq o lint tava chorando (2)
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener); 
  return li;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}
// Requisito 2
const addProductToCart = () => {
  // Armazena os botões
  const addBtn = document.querySelectorAll('.item__add');
  // "Separa" os botões, addBtn = todos os 50 botões.
  addBtn.forEach((element) => {
    element.addEventListener('click', async (event) => {
      const sku = event.target.parentElement.firstChild.innerText; // Acessa o elemento .item__sku do botão clicado.
      const endpoint = `https://api.mercadolibre.com/items/${sku}`;
      const request = await fetch(endpoint)
      .then((response) => response.json());
      // Acessa elemento cart__items e faz um filho do resultado da função createCartItemElement
      const ol = document.querySelector('.cart__items');
      ol.appendChild(createCartItemElement(request));
    });
  });
};

// Requisito 1
const convertJson = async () => {
  // Requisito 7
  const loadingText = createCustomElement('span', 'loading', 'Loading...');
  // console.log(loadingText);
  document.body.appendChild(loadingText); // Fim do requisito 7
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const request = await fetch(endpoint)
  // Converte em json
  .then((response) => response.json())
  // Acessa a chave results do objeto
  .then((obj) => obj.results);
  request.forEach((computer) => {
    // Acessa elemento items e faz um filho do resultado da função createProductItemElement
    document.querySelector('.items').appendChild(createProductItemElement(computer));
  }); 
  addProductToCart();
  loadingText.remove(); // Chamada dentro do escopo do async e remoção chamada após o carregamento da request à API. 
};

// Requisito 6
const emptyCart = () => {
 const cartItem = document.querySelectorAll('.cart__item');
 cartItem.forEach((item) => item.remove());
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

window.onload = () => {
  convertJson();
  // Inserido no window.onload pois o script se encontra do head e o botão esvaziar carrinho ainda não foi criado.
  document.querySelector('.empty-cart').addEventListener('click', emptyCart);
};
