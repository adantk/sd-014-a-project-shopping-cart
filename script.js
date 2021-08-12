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

function getSkuFromProductItem(item) {
  const addButton = item.target.parentNode;
  return addButton.querySelector('span.item__sku').innerText;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  section.addEventListener('click', getSkuFromProductItem);
  return section;
}

const requestEndpoint = (idProductAdd) => {
   fetch(`https://api.mercadolibre.com/items/${idProductAdd}`)
   .then((response) => response.json());
}

const requestProduct = () => {
  requestEndpoint(getSkuFromProductItem);
}

function cartItemClickListener(event) {
  
  
}



function createCartItemElement({sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fetchProduct = (search) => {
 return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`)
  .then((response) => response.json().then((searchResult) => searchResult.results));
  
};

const loadElements = async (search) => {
  const result = await fetchProduct(search);
  result.forEach(({id, title, thumbnail}) => document.querySelector('.items')
    .appendChild(createProductItemElement({ sku: id, name: title, image: thumbnail })));
};
  
//       .forEach((product) => {
//         document.querySelector('.items').appendChild(createProductItemElement({
//           sku: product.id, name: product.title, image: product.thumbnail }));
//           document.querySelector('.item__add').addEventListener('click', getSkuFromProductItem );
//       });
//     })
//   );
// };

const addProduct = async () => {
await fetchProduct('computador');
await loadElements();
};

window.onload = () => {
    loadElements('computador');
};