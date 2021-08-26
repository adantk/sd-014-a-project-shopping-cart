const sectionPaiHtml = document.querySelector('.items');
const listaDeCompra = document.querySelector('.cart__items');
const ITEM_URL = 'https://api.mercadolibre.com/items';

const fetchProductItens = async (itenID) => {
  const item = await fetch(`${ITEM_URL}/${itenID}`);
  return item.json();
};

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

function cartItemClickListener() {
  document.querySelector('li').remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  // return li;
  return listaDeCompra.appendChild(li);
}

const addButtonClickListener = (sku) => { /**/
  fetchProductItens(sku)
    .then((item) => {
      createCartItemElement({
        sku: item.id,
        name: item.title,
        salePrice: item.price,
      });
    });
};

const createCustomElementButton = (className, titulo, sku) => {
  const button = document.createElement('button');
  button.className = className;
  button.innerText = titulo;
  button.addEventListener('click', () => {
    addButtonClickListener(sku);
  });

  return button;
};

function createProductItemElement(sku, name, image) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElementButton('item__add', 'Adicionar ao carrinho!', sku));

  // return section;
  sectionPaiHtml.appendChild(section);
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const buscandoProdutos = async () => {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const data = await response.json();
  data.results.forEach((produto) => {
    createProductItemElement(produto.id, produto.title, produto.thumbnail);
  });
};
// const buscandoProduto = async (sku) => {
//   const response = await fetch(`https://api.mercadolibre.com/sites/$SITE_ID/search?q=Motorola%20G6${sku}`);
//   const data = await response.json();
//   data.results.forEach((produto) => {
//     createCartItemElement(produto.id, produto.title, produto.price);
//   });
// };

buscandoProdutos();

window.onload = () => {

};
