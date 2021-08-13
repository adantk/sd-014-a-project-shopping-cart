function createProductImageElement(imageSource) { // callback lista de itens
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) { // callback lista de itens
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ // cria lista de itens
  sku,
  name,
  image,
}) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) { // retorna a SKU do pai
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) { // função para apagar linha selecionada
  // coloque seu código aqui
  // arr.splice(arr.indexOf(event.target.innerText.substring(5,18)),1)
  // localStorage.list = JSON.stringify(arr)
  event.target.remove();
}

function createCartItemElement({ // cria lista
  sku,
  name,
  salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
let arr = [];
let total = 0;
const removeChild = () => {
  const carIt = document.getElementsByClassName('cart__items');
  while (carIt[0].firstChild) {
    carIt[0].removeChild(document.getElementsByClassName('cart__items')[0].firstChild);
  }
};

const listItem = (id) => {
  fetch(`https://api.mercadolibre.com/items/${id}`).then((resposta) => resposta.json())

    .then((dados) => {
      document.getElementsByClassName('cart__items')[0].appendChild(createCartItemElement({
        sku: dados.id,
        name: dados.title,
        salePrice: dados.price,
      }));
      total += dados.price;
      console.log(total);
    });
};

const findId = (e) => {
  listItem(getSkuFromProductItem(e.target.parentNode));
  // arr.push(getSkuFromProductItem(e.target.parentNode));
  // localStorage.setItem('list', JSON.stringify(arr));
};
const callFetch = () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(url).then((resposta) => resposta.json())

    .then((dados) => {
      const contItem = document.getElementsByClassName('items');
      const btnAdd = document.getElementsByClassName('item__add');
      dados.results.forEach((cur, i) => {
        contItem[0].appendChild(createProductItemElement({
          sku: cur.id,
          name: cur.title,
          image: cur.thumbnail,
        }));
        btnAdd[i].addEventListener('click', findId);
      });
    });
};

callFetch();
window.onload = () => {
  document.getElementsByClassName('empty-cart')[0].addEventListener('click', removeChild);
  arr = localStorage.getItem('list');
  arr = JSON.parse(arr);
  // arr.forEach((cur)=> listItem(cur))
};