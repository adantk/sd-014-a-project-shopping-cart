const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';

let sum = 0;

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

  return section;
}

const removeCarItems = () => {
  const btnRemoveAllItems = document.querySelector('.empty-cart');
  btnRemoveAllItems.addEventListener('click', () => {
    sum = 0;
    const price = document.getElementsByClassName('total-price');
     price.innerHTML = sum;
    const li = document.querySelectorAll('.cart__item');
    li.forEach((item) => {
      item.remove();
    });
  });
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  const price = document.querySelector('.total-price');
  const money = Number(event.target.textContent.split('$')[1]);
  sum -= money;
  price.innerHTML = sum;
  event.target.remove();
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

const createDinamicItems = () => {
  const fetchComputer = fetch(url)
  .then((response) => response.json())
  .then((computer) => computer.results);
  return fetchComputer.then((computer) => computer.forEach((pc) => {
    const createPc = createProductItemElement({ sku: pc.id, name: pc.title, image: pc.thumbnail });
    document.querySelector('.items').appendChild(createPc);
  }));
};

const createLoading = () => {
  const p = document.createElement('p');
  p.className = 'loading';
  p.innerText = 'loading...';
  document.body.appendChild(p);
};

const removeLoading = () => {
  document.querySelector('.loading').remove();
};

const totalPrice = (a) => {
  const price = document.querySelector('.total-price');
  sum += a;
  price.innerHTML = sum;
};

 const addItemCart = () => {
  const btnAddCart = document.querySelectorAll('.item__add');
  btnAddCart.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        const item = document.querySelectorAll('.item__sku')[index].textContent;
     const fetchCart = fetch(`https://api.mercadolibre.com/items/${item}`)
      .then((response) => response.json())
      .then((dados) => dados);
      return fetchCart.then((comput) => {
       const addCart = createCartItemElement({
         sku: comput.id,
         name: comput.title,
         salePrice: comput.price,
        });
        document.querySelector('.cart__items').appendChild(addCart);
        totalPrice(comput.price);
      });
    });
  });
};

window.onload = () => {
  createLoading();
  createDinamicItems().then(() => addItemCart()).then(() => removeLoading());
  removeCarItems();
};
