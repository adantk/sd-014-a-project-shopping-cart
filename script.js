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
  image
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
  // coloque seu código aqui
  console.log('funciona')
}

function createCartItemElement({
  sku,
  name,
  salePrice
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const callFetch = () => {
  fetch("https://api.mercadolibre.com/sites/MLB/search?q=computador").then((resposta) => {
    return resposta.json()
    })
    .then((dados) => {
      dados.results.forEach((cur)=>{
        document.getElementsByClassName('items')[0].appendChild(createProductItemElement({sku: cur.id,name: cur.title,image: cur.thumbnail}))
      })
  })
}
const listItem = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`).then((resposta) => {
    return resposta.json()
  })
  .then((dados)=>{
    document.getElementsByClassName('cart__items')[0].appendChild(createCartItemElement({sku:dados.id,name: dados.title,salePrice: dados.price}))
  })
}
callFetch()
listItem('MLB1341706310')
window.onload = () => {
  
};