// Requisito 4
function saveInLocalStorage() { // salva os itens aramzenados no carrinho
  const cartItems = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('cart', cartItems);
}
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
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Requisito 3 - Remove o item do carrinho de compras ao clicar
function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove(); // remove os itens ao clicar
  saveInLocalStorage(); // adiciona os itens ao clicar
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');

  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  
  return li;
}

// Requisito 1.2
function addElement(item) { // adicionando elemento 
  const itemElement = createProductItemElement(item); // cria elemento item
  const itemsElement = document.querySelector('.items'); // chamando a class 'items'
  itemsElement.appendChild(itemElement); // 'items' para filho da section 'item'
}
// Requisito 1.1
const getItem = async () => { // função assíncrona
  const responseRaw = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador'); // URL Mercado Livre Brasil com a busca'computador' já definida
  const responseJson = await responseRaw.json(); // retorna a consulta JSON
  
  const result = Object.entries(responseJson.results); // entries transformou em array
  
  result.forEach((elemento) => { // vai percorrer cada elemento do result 
    // console.log(elemento[1].id);
    const item = { // substituindo os valores dos parâmetros
      sku: elemento[1].id,
      name: elemento[1].title,
      image: elemento[1].thumbnail,
    };
    addElement(item); 
  });
};

// Requisito 2 - Adiciona o produto no carrinho de compras 
function addItemToCart() {
  document.querySelector('.items').addEventListener('click', (event) => { // retorna o primeiro elemento de 'items' e add o evento de click
    if (event.target.classList.contains('item__add')) { // //  se identificar o elemento ao qual o evento ocorreu/ se houver o click add item
      const parent = event.target.parentElement; // retorna o elemento pai do evento que ocorreu
      const sku = getSkuFromProductItem(parent); // chama a função( que puxa o primeiro elemento item com parametros passados)
      const skuUrl = `https://api.mercadolibre.com/items/${sku}`; // url API com busca de sku/id
      fetch(skuUrl)
        .then(response => response.json()) // retorna a response da fetch em JSON
        .then((data) => {
          const obj = { // aramazena com os itens com dados em JSON 
            sku,
            name: data.title,
            salePrice: data.price,
          };
          document.querySelector('.cart__items').appendChild(createCartItemElement(obj));
          saveInLocalStorage();
        });
    }
  });
}
// Requisito 4 
function loadFromLocalStorage() { // o estado atual do carrinho de compras é carregado 
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = localStorage.getItem('cart');
  cartList.addEventListener('click', ((event) => {
    if (event.target.classList.contains('cart__item')) {
      cartItemClickListener(event);
    }
  }));
}

window.onload = () => {
  getItem();
  addItemToCart();
  loadFromLocalStorage();
};