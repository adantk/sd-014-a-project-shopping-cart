function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource.results;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
// const {
//   sku,
//   name,
//   image
// } = product;



function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
 
  return section;
}

const getProduct = (search) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`)
  .then((response) =>
    response.json().then((searchResult) => {
      searchResult.results.forEach((product) => {
        const listItems = document.getElementsByClassName('items')[0];
        listItems.appendChild(createProductItemElement({
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        }));
      });
    })
  );
};


function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}


const addProduct = async () => {
await getProduct('computador');
}

window.onload = () => {
  addProduct();
};