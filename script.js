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
  return objToCart;
};

const getAddItemCarrinho = (event) => {
  const objClickSKU = getSkuFromProductItem(event.target.parentElement);
  fetch(`https://api.mercadolibre.com/items/${objClickSKU}`)
    .then((resposta) => {
      resposta.json().then((dados) => {
        const objToCart = createObjForCart(dados);
        return addItemCarrinho(objToCart);
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
  somaTotal();
}

const addEscutadorDnv = () => {
  const itemsLista = document.getElementsByClassName('cart__item');
  for (let i = 0; i < itemsLista.length; i += 1) {
    itemsLista[i].addEventListener('click', cartItemClickListener);
  }
}

const carregarCarrinho = () => {
  if (localStorage.getItem('itemsCart') != null) {
    const carrinhoLocalStorage = localStorage.getItem('itemsCart')
    let lista = document.getElementById('lista').innerHTML;
    lista = lista + carrinhoLocalStorage
    document.getElementById('lista').innerHTML = lista
    addEscutadorDnv();
    somaTotal();
  }
}

const somaTotal = () => {
  const itemsLista = document.querySelectorAll('.cart__item')
  let resultado = 0;
  for (let i = 0; i < itemsLista.length; i += 1) {
    const innerTextItem = itemsLista[i].innerText
    //Number trasforma o valor recuperado em numerioco para ser usado no futuro
    //pois ele esta sendo retirado de uma string

    //Em substring(A,B) ira da posissao A até uma posição anterior de B
    //mas no caso esta sendo usado substring(A) ira apenas da posissão A até o fim

    //indexOf ira achar a posição do primeiro caracter passado
    const valorItemI = Number(innerTextItem.substring(innerTextItem.indexOf('$') + 1))
    resultado += valorItemI
  }
  let element = document.getElementById('total');
  element.innerHTML = resultado.toFixed(2);
  const totalDOM = document.getElementById('total').innerText
  const totalTamanho = document.getElementById('total').innerText.length
  if (totalDOM[totalTamanho -1] == 0 && totalDOM[totalTamanho - 2] == 0) {
    element.innerHTML = resultado.toFixed(0);
  }
  if (totalDOM[totalTamanho -1] == 0 && totalDOM[totalTamanho - 2] > 0) {
    element.innerHTML = resultado.toFixed(1);
  }
}

const limpaCarrinho = () => {
  let lista = document.getElementById('lista');
  let itens = document.getElementsByClassName('cart__item')
  for (let i = itens.length - 1; i >= 0; i -= 1) {
    lista.removeChild(lista.childNodes[i]);
  }
  updateLocalStorage();
}

window.onload = async () => {
  await fetchML();
  await carregarCarrinho();
  await document.getElementById('botao').addEventListener('click', limpaCarrinho)
}