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

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => {
      response.json()
        .then((data) => {
          document.querySelector('.cart__items').appendChild(createCartItemElement({
            sku: data.id,
            name: data.title,
            salePrice: data.price,
          }));
      });
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btnAdd = (createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  btnAdd.addEventListener('click', () => {
    const btnParent = btnAdd.parentElement;
  const productId = btnParent.firstChild.innerText;
  addToCart(productId);
  // console.log(productId);
  });
  section.appendChild(btnAdd);

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

function addProducts() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => {
      response.json()
        .then((data) => {
          data.results.map(((product) => document.querySelector('.items')
          .appendChild(createProductItemElement({
            sku: product.id,
            name: product.title,
            image: product.thumbnail,
          }))));
        });
    });
}

// function addToCart(id) {
//   fetch(`https://api.mercadolibre.com/items/${id}`)
//     .then((response) => {
//       response.json()
//         .then((data) => {
//           document.querySelector('.cart__items').appendChild(createCartItemElement({
//             sku: data.id,
//             name: data.title,
//             saleprice: data.price,
//           }));
//       });
//     });
// }

// function teste() {
// document.querySelectorAll('.item__add').forEach((btn) => {
//   btn.addEventListener('click', () => {
//   const btnParent = btn.parentElement;
//   const productId = btnParent.firstChild.innerText;
//   addToCart(productId);
//   console.log(productId);
// });
// });
// }

window.onload = () => { 
  addProducts();
};
