
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
const showProductList = async () => {
  clearProductList();
  const responseRaw = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  const responseJson = await responseRaw.json();

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

const showCartList = () => {
  clearCartList();
  const cart = document.querySelector('.cart__items');
  cartList.forEach((productJson) => {
    cart.appendChild(createCartItemElement(productJson));
  });
};
let cartList = [];
const buttonAddCart = () => {
  const button = document.querySelectorAll('.item__add');
  button.forEach((item) => item.addEventListener('click', async (event) => {
    const selectedProduct = event.target.parentElement;
    const sku = selectedProduct.firstChild.innerText;

    const productJson = await fetch(
      `https://api.mercadolibre.com/items/${sku}`,
    ).then((r) => r.json());
    cartList.push(productJson);
    // console.log(cartList);
    showCartList();
  }));
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {

}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// requisito 1 grupo de estudo com Alvaro Raminelli dev Pleno CoinBase
window.onload = () => {
  showProductList();
  showCartList();
};