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
  const itemSection = document.querySelector('.items');
  itemSection.appendChild(section);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const ol = document.querySelector('#cart__items');
  ol.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  ol.appendChild(li);
  return li;
}

// Requisito 1
const getList = async () => {  
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((object) => {
      object.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
        createProductItemElement({ sku, name, image });
      });
    });
};

// Requisito 2
// Requisição para o endpoint
const createFetch = (idProduct) => {
  fetch(`https://api.mercadolibre.com/items/${idProduct}`)
    .then((response) => response.json())
    .then((object) => {
    // Chama função que add item na lista ol (carrinho)
    createCartItemElement({ sku: object.id, name: object.title, salePrice: object.price });
    });
};

// Ao clicar no botão capturar a ID do produto
const clickButton = () => {
  const getButton = document.querySelectorAll('.item__add');
  console.log(getButton);
  getButton.forEach((button) => {
    button.addEventListener('click', (event) => {
      const idProduct = event.target.parentElement.firstChild.innerText;
      console.log(idProduct);
      // Chama função que fará requisição para o endpoint
      createFetch(idProduct);
    });
  });
};

// Requisito 6
const clearCart = () => {
  const ol = document.querySelector('.cart__items');
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    ol.innerHTML = '';
  });  
};

window.onload = async () => {
  await getList();
  await clickButton();
  await clearCart();
};
