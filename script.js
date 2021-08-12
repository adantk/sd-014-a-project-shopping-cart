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

window.onload = () => { };

const componenteHTML = document.querySelector('.items');
fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
.then((response) => response.json())
.then((response) => response.results.forEach((resultado) => {
  componenteHTML.appendChild(createProductItemElement({
    sku: resultado.id,
    name: resultado.title,
    image: resultado.thumbnail,
  }));
}));
  // Código do requisito um baseado no trabalho do colega Fernando: https://github.com/tryber/sd-014-a-project-shopping-cart/pull/13/commits/114096fa1902021e1d50006347d430cb73d69e73
  // 1 - Guardamos em uma variável a resultado do resgate do elemento com a classe 'items'.
  // 2 - Buscamos a URL pedida no enunciado a partir da requisição fetch();
  // 3 - Se a URL passada é válida, então transformamos o resultado da busca da URL em json;
  // 4 - Se o json é gerado, então pegamos o atributo 'results' dentro do json e, para cada objeto contido dentro da array, teremos um elemento novo, resultado da função createProductItemElement(), dentro da section com classe 'items' com os atributos e valores id, título e imagem;