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

// Requisito 1.2
function addElement(item) { // adicionando elemento 
  const itemElement = createProductItemElement(item); // cria elemento item
  const itemsElement = document.querySelector('.items'); // chamando a class 'items'
  itemsElement.appendChild(itemElement); // 'items' para filho da section 'item'
}
// Requisito 1.1
const apiMercadoLivre = async () => { // função assíncrona
  const responseRaw = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador'); // URL Mercado Livre Brasil
  const responseJson = await responseRaw.json(); // retorna a consulta JSON
  
  const result = Object.entries(responseJson.results); // entries transformou em array
  
  result.forEach((elemento) => { // vai percorrer cada elemento do result 
    // console.log(elemento[1].id);
    const item = { // substituindo os valores dos parâmetros
      sku: elemento[1].id,
      name: elemento[1].title,
      image: elemento[1].thumbnail,
    };
    addElement(item); // chamando a função que cria um 
  });
};

window.onload = () => {
  apiMercadoLivre(); 
};
