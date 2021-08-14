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

function createProductItemElement(sku, name, image) {
  const section = document.createElement('section');
  section.className = 'item';
  const itens = document.querySelector('.items');
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  itens.appendChild(section);

  return section;
}
function fetchApiProduct(query) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${query}`)
    .then((response) => response.json());
}

// function adicionarInfos() {
//   // const itemSection = document.querySelector('.items');
//   fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
//     .then((response) => response.json()
//     .then((response2) => console.log(response2.results))
//     .then((computadores) => computadores.results.forEach((computador) => appendComputador(computador.id, computador.title, computador.thumbnail))));

//      .then((response) => {
//      response.results.forEach((elemento) => {
//         const informacoes = { sku: elemento.id, name: elemento.title, image: elemento.thumbnail };
//         itemSection.appendChild(createProductItemElement(informacoes));
//      });
// }
// adicionarInfos();

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// }

window.onload = () => {
  fetchApiProduct('computador').then((dados) => {
    const resultadoList = dados.results.forEach(() => {
      createProductItemElement(dados.results.id, dados.results.title, dados.results.thumbnail);
    });
    return resultadoList;
  });
};
