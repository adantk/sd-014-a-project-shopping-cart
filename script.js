/* eslint-disable sonarjs/no-use-of-empty-return-value */
const olListCarr = document.querySelector('ol');
const totalPriceItens = document.querySelector('.total-price');

function sumPrice() {
  const itemsCar = document.querySelectorAll('.cart__item');
  let priceTotal = 0;
  itemsCar.forEach((itemCar) => {
  priceTotal += parseFloat(itemCar.id);
  const somaPreco = Math.ceil(priceTotal * 100) / 100;
  totalPriceItens.innerText = somaPreco;
  // localStorage.setItem('price', totalPriceItens.innerHTML);
  localStorage.setItem('price', JSON.parse(totalPriceItens.innerHTML));
  });
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

function createProductItemElement({
  sku,
  name,
  image,
}) {
  const section = document.createElement('section');
  section.className = 'item';
  const itens = document.querySelector('.items');

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  itens.appendChild(section);

  return section;
}

// function saveLocalStorage() {
//   localStorage.setItem('carrinho', olListCarr.innerHTML);
// }
// console.log(olListCarr.value);

// localStorage();
// olListCarr.removeChild(event.target); outra maneira de remover é usando removeChild ou seja remove o filho da ol / ol = olListCarr e o event.target é a li onde acontece o evento

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
// na funcao abaixo foi criada para criar uma classe total price e esta foi incluida como filha da tag section com classe cart 

// function creatTotalPrice() {
//   const cart = document.querySelector('.cart');
//   const totprice = document.createElement('span');
//   totprice.className = 'total-price';
//   totprice.innerText = 'Preço total:';
//   cart.appendChild(totprice);
//   return cart;
// }event.target.remove();

function reducePrice() {
   olListCarr.addEventListener('click', (event) => {
    const newli = event.target.nodeName === 'LI';
    if (!newli) {
      return;
    }
  const precoCarrinho = parseFloat(totalPriceItens.innerHTML);
  const removePriceText = event.target.innerText;
  const removePriceItem = parseFloat(removePriceText.split('$')[1]);
  const precoReduzido = (precoCarrinho - removePriceItem);
  totalPriceItens.innerText = Math.ceil(precoReduzido);
  event.target.remove();
  // localStorage.setItem('lista', JSON.stringify(olListCarr.innerHTML));
  // localStorage.setItem('preço total', totalPriceItens.innerHTML);
  // localStorage.setItem('price', JSON.stringify(totalPriceItens.innerHTML));
});
}

//  const teste = Math.ceil(removePriceItem)
// priceTotal += parseFloat(itemCar.id);
// const somaPreco = Math.ceil(priceTotal * 100) / 100;
// totalPriceItens.innerText = somaPreco;
// localStorage.setItem('price', totalPriceItens.innerHTML);
// });
function cartItemClickListener(event) {
  event.target.remove();
  reducePrice();
  localStorage.setItem('lista', JSON.stringify(olListCarr.innerHTML));
  // sumPrice();
} 

function createCartItemElement({
  sku,
  name,
  salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.id = salePrice;
  return li;
}

// a funcao addCar serve para adicionar elementos ao carrinho atraves de addEventListener chamando a funcao getSkuFromProductItem acessa 
// os intens criados por la que sao a li filhas de ol depois a funcao faz um fetch para acessar a url e depois mudar json para acessar objeto
// e o array de objetos acessando algumas chaves depois temos um apendchild para jogar dentro da ol e em seguida fiz a soma dos itens adcionados

function addCarr() {
  const buttonAdd = document.querySelectorAll('.item__add');
  buttonAdd.forEach((botton) => {
    botton.addEventListener('click', async (event) => {
      const buscaId = getSkuFromProductItem(event.target.parentElement);
      const buscaUrl = await fetch(`https://api.mercadolibre.com/items/${buscaId}`);
      const urlJason = await buscaUrl.json();
      olListCarr.appendChild(createCartItemElement({
        sku: urlJason.id,
        name: urlJason.title,
        salePrice: urlJason.price,
      }));   
      sumPrice();
      localStorage.setItem('lista', JSON.stringify((olListCarr.innerHTML)));
    });
  });
}

function msgLoading() {
const items = document.querySelector('.items');
const loading = document.createElement('div');
loading.className = 'loading';
loading.innerText = 'loading...';
items.appendChild(loading);
}

function limpaCarrinho() {
  const btnClear = document.querySelector('.empty-cart');
  btnClear.addEventListener('click', () => {
    olListCarr.innerHTML = '';
    document.querySelector('.total-price').innerText = '0';
    localStorage.clear('lista');
 //   localStorage.removeItem('price');
    });
}

// // let lista = JSON.parse(localStorage.getItem('lista')) || [];
// lista.push(buttonAdd);
// localStorage.setItem('lista', JSON.stringify(lista))

function atualizaLocalStorage() {
  const lista = JSON.parse(localStorage.getItem('lista'));
  const precoRecuperado = localStorage.getItem('price');
    if (lista) {
    olListCarr.innerHTML = lista;
    totalPriceItens.innerHTML = precoRecuperado;
  }
  const liItens = document.querySelector('.cart__items');
  liItens.innerHTML = JSON.parse(localStorage.getItem('lista'));
  liItens.addEventListener('click', cartItemClickListener);
}

// // requisito 1
function fetchApiProduct(computador) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${computador}`)
    .then((response) => response.json())
    .then((json) => json.results);
}

fetchApiProduct('computador').then((computers) => {
  const resultadoList = computers.forEach((computer) => {
    const {
      id: sku,
      title: name,
      thumbnail: image,
    } = computer;
    const newItens = createProductItemElement({
      sku,
      name,
      image,
    });
    return newItens;
  });
  return resultadoList;
});

window.onload = async () => {
  await fetchApiProduct('computador');
  await addCarr();
  msgLoading();
  sumPrice();
  limpaCarrinho();
  atualizaLocalStorage();
};