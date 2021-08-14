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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}
async function fetchMercado() { // async - dizer que é a função é assíncrona (dentro do assíncrona uso await). 
  // Await - mandar o javascript aguardar a resposta 
  const items = document.querySelector('.items');
const api = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador'); // fetch criar vínculo com API - endereço da requisição 
const apiJson = await api.json(); // retorna objeto 
apiJson.results.map((produto) => items.appendChild(createProductItemElement(produto))); // Adicione o elemento retornado da função createProductItemElement(product) como filho do elemento <section class="items">
} // acessar results que é um array com os resultados da pesquisa 

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

// async function createCart() {
//  // Ao clicar nesse botão você deve realizar uma requisição para o endpoint:
//  // botão com o nome Adicionar ao carrinho!.
//  // $ItemID deve ser o valor id do item selecionado.
//      const buttonAdd = document.getElementsByClassName('item__add');
 
//   const apiItem = await fetch(`'https://api.mercadolibre.com/items/${$ItemID}'`);
//   const itemJson = await apiItem.json();
// }

window.onload = () => { 
  fetchMercado();
};
