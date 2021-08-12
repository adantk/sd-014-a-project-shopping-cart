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
  const target = event.target.classList;
  const pai = document.querySelector('.cart__items');
 if (target.contains('cart__item')) {    
    pai.removeChild(event.target);
 }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function criarCarrinho() {
  const botao = document.querySelectorAll('.item__add');
  botao.forEach((itens) => {
  itens.addEventListener('click', async (event) => {
    const elemento = event.target.parentElement;
    const sku = elemento.firstChild.innerText;   
    const aPis = await fetch(`https://api.mercadolibre.com/items/${sku}`); 
    const requestJson = await aPis.json();
    document.querySelector('.cart__items').appendChild(createCartItemElement({ 
      sku: requestJson.id, 
      name: requestJson.title, 
      salePrice: requestJson.price }));   
    });
});  
}

const getFetchComputador = async () => {
 const requisição = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const responseJson = await requisição.json();
  responseJson.results.filter((array) => (document.querySelector('.items')
  .appendChild(createProductItemElement({  
     sku: array.id,   
     name: array.title,   
      image: array.thumbnail }))));
      criarCarrinho(); 
    };

window.onload = () => { 
    getFetchComputador();  
};