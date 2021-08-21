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

function createProductItemElement({
  sku,
  name,
  image
}) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));

  const addBotao = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  addBotao.addEventListener('click', (event) => getAddItemCarrinho(event))

  section.appendChild(addBotao)

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const cartItemClickListener = (event) => {
  const itemsCarrinho = document.querySelector('.cart__items');
  itemsCarrinho.removeChild(event.target)
  updateLocalStorage()
}

function createCartItemElement({
  sku,
  name,
  salePrice
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = () => {};

const fetchML = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((resposta) => {
      resposta.json().then((dados) => {
        const retornoDados = dados.results;
        retornoDados.forEach((dadosResult => {
          const obj = {
            sku: dadosResult.id,
            name: dadosResult.title,
            image: dadosResult.thumbnail
          }
          document.getElementById('boxItems').appendChild(createProductItemElement(obj));
        }))
      })
    })
}

const createObjForCart = (dados) => {
  const objToCart = {
    sku: dados.id,
    name: dados.title,
    salePrice: dados.price
  }
  return addItemCarrinho(objToCart)
};

const getAddItemCarrinho = (event) => {
  const objClickSKU = getSkuFromProductItem(event.target.parentElement);
  fetch(`https://api.mercadolibre.com/items/${objClickSKU}`)
    .then((resposta) => {
      resposta.json().then((dados) => {
        return createObjForCart(dados);
      })
    })
}

const addItemCarrinho = (objToCart) => {
  let teste = document.getElementsByClassName('cart__items')
  teste[0].appendChild(createCartItemElement(objToCart))
  updateLocalStorage()
}



function updateLocalStorage() {
  localStorage.setItem('itemsCart', document.getElementById('lista').innerHTML)
  // ou
  // localStorage.setItem('itemsCart', document.querySelector('.cart__items').innerText)
}

const addEscutadorDnv = () => {
  const itemsLista = document.getElementsByClassName('cart__item');
  for (let i = 0; i < itemsLista.length; i += 1){
    itemsLista[i].addEventListener('click', cartItemClickListener);
  }
}

const carregarCarrinho = () => {
  if(localStorage.getItem('itemsCart') != null) {
  const carrinhoLocalStorage = localStorage.getItem('itemsCart')
  // const ol = document.getElementsByClassName('cart__items')
  // // ol.appendChild(carrinhoLocalStorage)
  // console.log(carrinhoLocalStorage)
  let lista = document.getElementById('lista').innerHTML;
  lista = lista + carrinhoLocalStorage
  document.getElementById('lista').innerHTML = lista
  addEscutadorDnv();
  }
}

window.onload = async () => {
  await fetchML();
  await carregarCarrinho();
  // console.log(localStorage.itemsCart[1])
}


// let botaoAddCarrinho1 = document.querySelector("#boxItems");
// let botaoAddCarrinho2 = botaoAddCarrinho1.section
// botaoAddCarrinho.addEventListener('click' , function(event) {
//   console.log('teste')
// })