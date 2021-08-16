const carrinho = document.querySelector('.cart__items');

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
// Questão 5
// function totalSomado() {
//   const totalSomados = document.createElement('span');
//   let somatorio = 0;
//   if (document.querySelector('.total-price')) {
//     document.querySelector('.total-price').remove();
//   }
//   cartItems.forEach((i) => {
//     const itemPrice = i.innerText.split('$')[1];
//     somatorio += parseFloat(itemPrice);
//   });
//   totalSomados.innerText = `${somatorio}`;
//   totalSomados.className = 'total-price';
//   document.querySelector('.cart').appendChild(totalSomados);
// }

// requisito 3
function cartItemClickListener(event) { // coloque seu código aqui
  event.target.remove();
}

// Questao 2. resolvida.....
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const criarBtn = () => {
  const botao = document.querySelectorAll('.item__add');
  botao.forEach((element) =>
    element.addEventListener('click', async (event) => {
      const produtos = event.target.parentElement;
      const id = produtos.firstChild.innerText;

      const productApi = await fetch(`https://api.mercadolibre.com/items/${id}`)
      const retornoJson = await productApi.json();
      carrinho.appendChild(createCartItemElement(retornoJson));
      localStorage.setItem('stored', carrinho.innerHTML);
    }));
};

//Resolvendo a questão 1.....
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const sectionItem = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );
  sectionItem.appendChild(section);
  return sectionItem;
}

const transJson = async () => {
  const loading = createCustomElement('h1', 'loading', 'loading');
  loading.className = 'loading';
  document.body.appendChild(loading);
  const responseRaw = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const responseJson = await responseRaw.json();
  const arrayRates = responseJson.results;

  arrayRates.forEach((product) => {
    createProductItemElement(product);
  });
  criarBtn();
  loading.remove();
};
// 

// requisito 4.
const localstorage = () => {
  if (localStorage.getItem('stored')) {
    carrinho.innerHTML
      += localStorage.getItem('stored');
  }
};
// Requisito 6....
document.getElementById('empty-cart').addEventListener('click', () => {
  carrinho.innerText = '';
  document.getElementById('total-price').innerText = 0;
  localStorage.clear();
});

window.onload = async () => {
  transJson();
  localstorage();
};