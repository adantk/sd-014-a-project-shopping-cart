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
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function findID(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((dados) => {
      const dataObj = { sku: dados.id, name: dados.title, salePrice: dados.price };
      const makeCart = createCartItemElement(dataObj);
      const ol = document.querySelector('.cart__items');
      ol.appendChild(makeCart);
    });
}

function searchData() {
  const item = document.querySelector('.items');
      fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => (response.json()))
    .then((data) => {
      const create = (data.results.forEach((pcs) => {
        const objs = { sku: pcs.id, name: pcs.title, image: pcs.thumbnail };
        const makeItem = createProductItemElement(objs);
        const btn = makeItem.lastChild;
        btn.addEventListener('click', (event) => { 
          const getId = getSkuFromProductItem(event.target.parentNode);
          findID(getId);
        });
        return item.appendChild(makeItem);    
      }));
      return create;
    });
  }
  
  searchData();

window.onload = () => { };