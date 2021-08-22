const Ol = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
const buttonEmpty = document.querySelector('.empty-cart');
const load = document.querySelector('.loading');

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

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  const ItensClass = document.querySelector('.items');
  ItensClass.appendChild(section);

 return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
// const sum = () => {
//   let count = Number(totalPrice.innerText);
//   const pegaList = document.querySelectorAll('.cart__item');
//   const num = Number(pegaList[pegaList.length - 1].innerText.split('$')[1]);
//   count += num;
//   totalPrice.innerText = count;
//   // console.log(soma);
// };
function cartItemClickListener(event) {
  // coloque seu código aqui  
  const cartList = document.querySelector('.cart__items');
  let count = Number(totalPrice.innerText);
  const num = event.target.innerText.split('$')[1];
  count -= num;
  totalPrice.innerText = count;
  cartList.removeChild(event.target);
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
  return li;
}

const fetchAPI = async () => {
  const responseComputer = await fetch(
    'https://api.mercadolibre.com/sites/MLB/search?q=computador',
  );
  load.remove();
  const data = await responseComputer.json();
  data.results.forEach(({
    id: sku,
    title: name,
    thumbnail: image,
  }) => {
    createProductItemElement({ sku, name, image });
  });
};

const sum = () => {
  let count = Number(totalPrice.innerText);
  const pegaList = document.querySelectorAll('.cart__item');
  const num = Number(pegaList[pegaList.length - 1].innerText.split('$')[1]);
  count += num;
  totalPrice.innerText = count;
  // console.log(soma);
};

const fetchId = async (id) => { // Essa função trata os dados da API e aplica na função de adicionar itens no carrinho
  try {
    const responseRaw = await fetch( // estou fazendo a requisição da API, para consumir as informações do produto
      `https://api.mercadolibre.com/items/${id}`,
    );
    const infoP = await responseRaw.json(); // tratando a resposta, e transformando os dados em Json
    const cartItem = { sku: infoP.id, name: infoP.title, salePrice: infoP.price }; // desestruturando o objeto recebido para manipular algumas informações
    Ol.appendChild(createCartItemElement(cartItem)); // adicionando os itens na lista de compra
    sum();
    // const { price } = infoP;
  } catch (error) { // com uma função pré-existente apenas chamando-a como callback e aplicando os valores capturados
    console.log(error);
  }
};

// preciso fazer a soma dos valores dos produtos a medida que eles vão sendo adicionados no carrinho

const manipEvents = () => { // adiciona o evento de clique aos botões e de adicionar ao carrinho
  const searchButton = document.querySelectorAll('.item__add');
  searchButton.forEach((item) => item.addEventListener('click', async (event) => {
    const getSku = getSkuFromProductItem(event.target.parentElement);
    await fetchId(getSku);
  }));
};

const apaga = () => {
  while (Ol.hasChildNodes()) {
    Ol.removeChild(Ol.firstChild);
  }
};
buttonEmpty.addEventListener('click', apaga);

// pegaList {
// const num = innerText.split('$')[1];
// count += parseFloat(num);
// const sumValues = () => {
// const sumButton = document.querySelectorAll('.item__add');
// sumButton.addEventListener('click', async (event) => {

// });

// Cada vez que se adicionar um item ao carrinho de compras, será necessário 
// somar seus valores e apresentá-los na página principal do projeto.  
// O elemento que tem como filho o preço total dos itens do carrinho deve ter, 
// obrigatóriamente, a classe total-price.

// Obs: Devemos tomar cuidado, no entanto, pois estamos buscando os dados do produto em uma API.
//  Portanto, é necessário garantir que a API já retornou as informações para somente depois realizar 
//  o cálculo da soma.

window.onload = async () => {
  await fetchAPI();
  manipEvents();
};