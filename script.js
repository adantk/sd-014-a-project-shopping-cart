const itemsClass = document.querySelector('.items');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
// a
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

const splashList = async (anItem) => {
  // const toElement = createProductItemElement({ sku: anItem[0].id, name: anItem[0].title, image: anItem[0].thumbnail });
  // itemsClass.appendChild(toElement);

  anItem.forEach((it) => {
    // window.alert(listing.title)
    const newitem = createProductItemElement({ sku: it.id, name: it.title, image: it.thumbnail });
    itemsClass.appendChild(newitem);
  });

  // for (key of anItem) {
  //   const newitem = createProductImageElement({ sku: key.id, name: key.title, image: key.thumbnail })
  //   itemsClass.appendChild(newitem)
  // }
};

const fetchtList = async (search) => {
  await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`)
    .then((response) => response.json())
    .then((rlist) => splashList(rlist.results))
    .catch((oops) => window.alert(`oops: ${oops}`));
};

window.onload = () => {
  fetchtList('computador');
};