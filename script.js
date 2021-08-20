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

  const ItensClass = document.querySelector('.items');
  ItensClass.appendChild(section);
  
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
const capOl = document.querySelector('.cart__items');

const fetchAPI = async () => {
  const responseComputer = await fetch(
    'https://api.mercadolibre.com/sites/MLB/search?q=computador',
  );
  const data = await responseComputer.json();
    data.results.forEach(({ id: sku, title: name, thumbnail: image }) => {
    createProductItemElement({ sku, name, image });
  });
  };

  const fetchId = async (id) => {
    try {
        const responseRaw = await fetch(
          `https://api.mercadolibre.com/items/${id}`,
        );
        const responseJson = await responseRaw.json();
        const a = { sku: responseJson.id, name: responseJson.title, salePrice: responseJson.price };
        capOl.appendChild(createCartItemElement(a));
    } catch (error) {
        console.log(error);
    }
};

const manipEvents = () => {
  const searchButton = document.querySelectorAll('.item__add');
  searchButton.forEach((item) => item.addEventListener('click', async (event) => {
    const getSku = getSkuFromProductItem(event.target.parentElement);
    await fetchId(getSku);
  })); 
};
window.onload = async () => { 
  await fetchAPI();
  await manipEvents();
};
