const itemsClass = document.querySelector('.items');
const addCartBtn = document.querySelectorAll('.item__add');
const cartItems = document.querySelector('.cart__items');
const checkoutCost = document.querySelectorAll('.total-price');

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
  section.appendChild(mkBtn);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const updatePrice = async () => {
  // Array.from(cartItems.getElementsByTagName('li')).forEach((x) => console.log(x.innerHTML.split('PRICE: $')[1]))
  const calcAll = Array.from(cartItems.getElementsByTagName('li'))
    .reduce((acc, rec) => parseFloat(rec.innerHTML.split('PRICE: $')[1], 10) + acc, 0);
  checkoutCost[0].innerHTML = parseFloat(calcAll, 10);
  console.log(calcAll);
};
// I'd prefer to not have that nightmare inside the reduce, but lint doesn't like it when I do 'acc += Number' so yeah fuck me I guess

const saveCart = () => {
  localStorage.clear();
  localStorage.setItem('MyCart', cartItems.innerHTML);
};

function cartItemClickListener(event) {
  event.target.parentElement.removeChild(event.target);
  localStorage.clear(event.target);
  updatePrice();
  saveCart();
}
// forgot to mention, but the saveCart() up there fixes an unintended behaviour in which if I load the page, add any number of items and delete any number of them again, upon reloading the cart would be emptied.

const loadCart = () => {
  cartItems.innerHTML = localStorage.getItem('MyCart');
  Array.from(cartItems.getElementsByTagName('li'))
    .forEach((item) => { item.addEventListener('click', cartItemClickListener); });
};
// https://stackoverflow.com/questions/4019894/get-all-li-elements-in-array   << this saved me

function createCartItemElement({ sku, name, salePrice }) {
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
  const convert4me = createCartItemElement({ sku: pls.id, name: pls.title, salePrice: pls.price });
  convert4me.addEventListener('click', cartItemClickListener);
  cartItems.appendChild(convert4me);
  updatePrice();
  saveCart();
};
// I do NOT understand why when I try to fetch it from outside this function it simply does not work. I do NOT get it.
// btw I got the idea of that split.string[1] from here: https://stackoverflow.com/questions/9766492/get-particular-string-part-in-javascript

const splashList = async (anItem) => {
  anItem.forEach((it) => {
    const newitem = createProductItemElement({ sku: it.id, name: it.title, image: it.thumbnail });
    // console.log(newitem.price);
    newitem.addEventListener('click', add2Cart);
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
// this is a ghost function for now. For some reason, when used, the return is completely unusable. Might fix it later. Probably. Maybe. Eventually. No.

window.onload = () => {
  fetchQuery('computador');
  loadCart();
};