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

function fetchApiSection() {
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
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

// item.forEach(() => button.addEventListener('click', () => {
//   console.log('teste');
// }));
function fetchApiList(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => {
      response.json()
        .then((data) => {
          document.querySelector('.cart__items')
          .appendChild(createCartItemElement({
            sku: data.id,
            name: data.title,
            salePrice: data.price,
          }));
        });
    });
}

// document.querySelectorAll('.item__add').forEach((item) => {
//   item.addEventListener('click', () => {
//     const procuctId = document.querySelector('.item__sku').innerHTML;
//     fetchApiList(procuctId);
//   });
// });

window.onload = () => { 
  fetchApiSection();
};
