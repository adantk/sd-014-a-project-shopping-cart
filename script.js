function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
// função para criar elemento
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// função para criar seção e jogar os elementos criados dentro

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const sectionItem = document.querySelector('.items');
  sectionItem.appendChild(section);
}

async function fetchApi() { 
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
.then((response) => response.json())
  .then((Object) => Object.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
      createProductItemElement({ sku, name, image });    
  }));   
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
 
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');  
  const ol = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  ol.appendChild(li);
  return li;
}

 const fetchCart = (getId) => { 
   fetch(`https://api.mercadolibre.com/items/${getId}`)
   .then((response) => response.json())
   .then((object) => { 
   createCartItemElement({ sku: object.id, name: object.title, salePrice: object.price });
   });
 }; 

const buttonClick = () => {
  const cartButton = document.querySelectorAll('.item__add');
  console.log(cartButton);
  cartButton.forEach((button) => {
  button.addEventListener('click', (event) => {
    const getId = getSkuFromProductItem(event.target.parentElement);
    console.log(getId);
    fetchCart(getId);
  });  
});
};

window.onload = async () => { 
   await fetchApi();
   await buttonClick();
};
