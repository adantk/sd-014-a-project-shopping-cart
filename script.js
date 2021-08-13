const fetch = require('node-fetch');

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
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

const fetchItemsPromise = (search) => new Promise((resolve, reject) => {
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`)
      .then((response) => {
        if (response.ok) {
        response.json()
          .then((dados) => {            
              // console.log(dados);
              resolve(dados);
          });
        } else {
            reject(new Error('fetch dont work'));
          }
      });
  });
  
const fetchItems = async (search) => {
  try {
    const resolve = await fetchItemsPromise(`${search}`);
    const { results } = resolve;

    results.forEach((item) => {
      document.querySelector('.items')
      .appendChild(createCartItemElement(item));
    });
  } catch (error) {
    console.log(error);
  }
};

// function createItemList(list) {
//   const promise = fetchItems(`${list}`);
//   const { results } = promise;
//   const sectionItems = document.querySelector('.items');
//   // const items = results.forEach((item) => {
//   const { id, title, thumbnail } = promise;
//     //  createProductItemElement({ [item].id, item.title, item.thumbnail })
//     console.log(promise);
// }

// window.onload = () => {
  fetchItems('bla');
// };
