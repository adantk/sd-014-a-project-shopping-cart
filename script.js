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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// window.onload = () => { };

function appendProductsOnCart() {
  const buttonsAddToCart = document.querySelectorAll('.item__add');
  buttonsAddToCart.forEach((button) => {
    button.addEventListener('click', (event) => {
      const itemID = event.target.parentNode.children[0].innerText;
      fetch(`https://api.mercadolibre.com/items/${itemID}`)
        .then((response) => response.json())
        .then((response) => {
          const listOfCart = document.querySelector('.cart__items');
          const infosOfProduct = { 
            sku: response.id,
            name: response.title,
            salePrice: response.price,
          };
          const itemCart = createCartItemElement(infosOfProduct);
          listOfCart.appendChild(itemCart);
        });
    });
  });
}

function process() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((response) => response.results)
    .then((products) => {
      products.forEach((product) => {
        const items = document.querySelector('.items');
        const infosOfProduct = {
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        };
        items.appendChild(createProductItemElement(infosOfProduct));
      });
    })
    .then(() => {
      appendProductsOnCart();
    });
}

process();
