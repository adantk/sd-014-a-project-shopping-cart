const itemsClass = document.querySelector('.items');
const addCartBtn = document.querySelectorAll('.item__add');
const cartItems = document.querySelector('.cart__items');

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
  // section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const mkBtn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  mkBtn.addEventListener('click', add2Cart)
  section.appendChild(mkBtn);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.parentElement.removeChild(event.target);

}

function createCartItemElement({ sku, name, salePrice }) {
  // alert(sku);
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const add2Cart = async (product) => {
  // window.alert('BUY');  
  const prdSKU = getSkuFromProductItem(product.target.parentElement);
  const myResponse = await fetch(`https://api.mercadolibre.com/items/${prdSKU}`);
  const pls = await myResponse.json();
  const convert4me = createCartItemElement({sku: pls.id, name: pls.title, salePrice: pls.price })
  convert4me.addEventListener('click', cartItemClickListener);
  cartItems.appendChild(convert4me);
}
// I do NOT understand why when I try to fetch it from outside this function it simply does not work. I do NOT get it.

const splashList = async (anItem) => {
  anItem.forEach((it) => {
    const newitem = createProductItemElement({ sku: it.id, name: it.title, image: it.thumbnail });
    // console.log(newitem.price);
    itemsClass.appendChild(newitem);

  });
};

const fetchQuery = async (search) => {
  await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`)
    .then((response) => response.json())
    .then((rlist) => splashList(rlist.results))
    .catch((oops) => window.alert(`oops: ${oops}`));
};

// const fetchID = async (item) => {
//   await fetch(`https://api.mercadolibre.com/items/${item}`)
//     .then((response) => response.json())
//     .catch((oops) => alert(`cant get that ID: ${oops}`));
// };

window.onload = () => {
  fetchQuery('computador')
  // alert(fetchQuery('computador'));

};