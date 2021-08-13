const itemContainer = document.querySelector('.items');
const cart = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
const removeItemsButton = document.querySelector('.empty-cart');

function updatePrice() {
  const cartItems = document.querySelectorAll('.cart__item');
  let precoTotal = 0;
  for (let i = 0; i < cartItems.length; i += 1) {
    const preco = Number(cartItems[i].innerText.split('$')[1]);
    precoTotal += preco;
  }
  totalPrice.innerText = precoTotal;
}

function removeButton() {
  removeItemsButton.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    updatePrice();
  });
}

function cartItemClickListener(event) {
  event.target.remove();
  updatePrice();
}

function autoSaveCart() {
  localStorage.setItem('cart', cart.innerHTML);
}

function addListenerAfterLoad() {
  const cartItems = document.querySelectorAll('.cart__item');
  for (let i = 0; i < cartItems.length; i += 1) {
    cartItems[i].addEventListener('click', cartItemClickListener);
  }
}

function autoLoadCart() {
  const previousCart = localStorage.getItem('cart');
  cart.innerHTML = previousCart;
  addListenerAfterLoad();
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function fetchInfos(id) {
  return fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((resp) => resp.json());
}

function itemEventListener(item, productId) {
  item.addEventListener('click', async () => {
    const itemInfo = await fetchInfos(productId);
    const itemForCart = createCartItemElement({ sku: itemInfo.id,
      name: itemInfo.title,
      salePrice: itemInfo.price,
    });
    cart.append(itemForCart);
    autoSaveCart();
    updatePrice();
  });
}

function addLoading() {
  const loadingState = document.createElement('p');
  loadingState.innerText = 'Loading...';
  loadingState.classList.add('loading');
  document.body.append(loadingState);
}

function removeLoading() {
  const loadingState = document.querySelector('.loading');
  loadingState.remove();
}

function getItemsFromAPI() {
  const fetching = fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const fetchResponse = fetching.then((resp) => resp.json());
  fetchResponse.then((respJSON) => respJSON.results.forEach((product) => {
        const item = createProductItemElement({ sku: product.id,
          name: product.title,
          image: product.thumbnail,
        });
        itemEventListener(item, product.id);
        itemContainer.append(item);
      }));
    setTimeout(() => {
      removeLoading();
    }, 3000);
}

window.onload = () => {
  addLoading();
  getItemsFromAPI();
  autoLoadCart();
  removeButton();
};
