const items = document.querySelector('.items');
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

const appendChilds = (parent, element) => parent.appendChild(element);

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

const fetchItems = async (type = 'sites/MLB/', element = 'search?q=computador') => 
   fetch(`https://api.mercadolibre.com/${type}${element}`)
    .then((response) => response.json())
    .then((response) => response.results)
    .catch(() => { throw new Error('API retornou erros'); });
  // .then((e) => console.log(e));

const formatMap = (arr, sku = 'id', name = 'title', thing = 'thumbnail') => arr.map((elem) => ({
    sku: elem[sku],
    name: elem[name],
    image: elem[thing],
  }));
async function getItemsFromAPI() {
  try {
    const array = await fetchItems();
    const arrayMap = formatMap(array);
    arrayMap.forEach((elem) => appendChilds(items, createProductItemElement(elem)));
  } catch (error) {
    console.log(error);
  }
}
window.onload = () => { getItemsFromAPI(); };
