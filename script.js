function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElemeent(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// Requsito 01 - A função abaixo também é chamada na função mercadoFetchApi().
function createProductItemElement({ sku, name, image }) {
  const upSection = document.querySelector('.items'); // cria uma constante que retorna o elemento section de classe 'items' (localizada acima da section de classe cart) para inserir elementos filhos para ela.
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  upSection.appendChild(section); // Insere elementos(sections) filhos de upSection(section criada).

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

// Início

// Requisito 01 - 
function mercadoFetchApi(item) {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`)
    .then((r) => r.json()
      .then((products) => products.results.forEach((product) => {
        createProductItemElement({ 
          sku: product.id,
          name: product.title, 
          image: product.thumbnail,
        });
})));
}
 
window.onload = async () => {
  mercadoFetchApi('computador'); // é possível buscar outro produto da API, passando outro parâmetro nesta função.
 };
