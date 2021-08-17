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

  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}
const clearProductList = () => {
  document.getElementsByClassName('items')[0].innerText = ''; // a função remove todos os itens da lista substituidno a lista por uma string vazia.
  console.log('learProductList', document.getElementsByClassName('items'));
};

function showLoading() {
  document.getElementsByClassName('items')[0]
  .appendChild(createCustomElement('span', 'loading', 'Loading'));
}

function hideLoading() {
  document.getElementsByClassName('items')[0].innerText = '';
}
const showProductList = async () => {
  clearProductList();
  showLoading(); 
  const responseRaw = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const responseJson = await responseRaw.json();
  hideLoading();
  responseJson.results.forEach((element) => {
    const itemEl = createProductItemElement(
      {
        sku: element.id, name: element.title, image: element.thumbnail,
      },
    );
    document.getElementsByClassName('items')[0].appendChild(itemEl);
  });
  buttonAddCart();
};

const clearCartList = () => {
  document.getElementsByClassName('cart__items')[0].innerText = '';
};

const showCartList = () => { // função que busca a informação e demonstra a lista do carrinho 
  clearCartList(); // função que limpa o carrinho antes de fazer a novamente a busca no cart__items
  const cart = document.querySelector('.cart__items');
  cartList.forEach((productJson) => {
    cart.appendChild(createCartItemElement(productJson));
  });
  showCartTotal();
};
let cartList = [];
const buttonAddCart = () => { // função para buscar add os items quando clicado no buttom e incluir na linha.
  const button = document.querySelectorAll('.item__add');
  button.forEach((item) => item.addEventListener('click', async (event) => {
    const selectedProduct = event.target.parentElement; // faz o evento de buscar o produto e seleciona antes de incluir na lista
    const sku = selectedProduct.firstChild.innerText; // busca o firstChild Sku

    const productJson = await fetch(
      `https://api.mercadolibre.com/items/${sku}`,
    ).then((r) => r.json());
    cartList.push(productJson); // push no array com as informaçÕes selecionadas
    // console.log(cartList);
    showCartList(); // mostra novamente a lista.
  }));
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) { // Função que remove o item do carrinho quando clicado
  // console.log(event.target.id);
  // filter está retirando do Array o ID que eu estou querendo remover do array.
  cartList = cartList.filter((item) => item.id !== event.target.id);
  showCartList();
}

function showCartTotal() {
  const total = cartList.reduce((acc, item) => acc + item.price, 0);
  document.getElementsByClassName('total-price')[0].innerText = total;
}

const setUpEmptyCart = () => { // função setUpEmptyCart, zera o carrinho toda vez que utilizada.
  document.getElementsByClassName('empty-cart')[0];
  const buttomEmpty = document.getElementsByClassName('empty-cart')[0]; // buscar o buttum
  buttomEmpty.addEventListener('click', () => { // add eventLister click
    cartList = []; // esvazia o array antes de chamar novamente a lista
    showCartList(); // chama a função que mostra novamente a Lista
  });
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku; // vai passar esse ID para a função de click para filtrar do array
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// requisito 1 grupo de estudo com Alvaro Raminelli dev Pleno CoinBase
window.onload = () => {
  showProductList();
  showCartList();
  setUpEmptyCart();
  showCartTotal();
};