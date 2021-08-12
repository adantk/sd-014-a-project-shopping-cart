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

function createProductItemElement(sku, name, image ) {
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

 async function FilterFetch (url, chave) { // filtra saida do fetch em json por chave retornando um valor
  const response = await fetch(`${url}`);
   const data = await response.json();
   return data[chave];
}


async function requestionApiMl(valorBusca) {
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=$${valorBusca}`;
  let ItensResults = await FilterFetch(url, 'results');// array com todos resultados de acordo com a busca
  ItensResults.forEach(item => {
    const elementItems = document.querySelector('.items');
    const { id, title: nameItem, thumbnail: ImgItem} = item;
    elementItems.appendChild(createProductItemElement(id, nameItem, ImgItem));
  })
} 

requestionApiMl('computador');

window.onload = () => { };
