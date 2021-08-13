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

function createProductItemElement({
  sku,
  name,
  image,
}) {
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
  event.target.parentElement.removeChild(event.target);
}

function createCartItemElement({
  sku,
  name,
  salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function jsonComputer() {
  const js = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json());
     js.results.forEach((element) => {
       const elementos = document.querySelector('.items');
      elementos.appendChild(createProductItemElement({ 
         sku: element.id,
         name: element.title,
         image: element.thumbnail }));
     });
   }

   function addventListeBotton() {
    const botton = document.querySelectorAll('.item__add');
    botton.forEach((valu) => {
      valu.addEventListener('click', async (event) => {
        const x = event.target.parentElement.firstChild.innerText;
        const carrinho = document.querySelector('.cart__items');
        const produt = await fetch(`https://api.mercadolibre.com/items/${x}`)
        .then((y) => y.json());
        carrinho.appendChild(createCartItemElement({
          sku: produt.id,
          name: produt.title,
          salePrice: produt.price,
        }));
      });
    });
  }

window.onload = async () => {
  await jsonComputer();
  await addventListeBotton();
};