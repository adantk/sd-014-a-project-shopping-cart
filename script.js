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
  event.target.remove(); // src: https://stackoverflow.com/questions/62427603/remove-one-item-from-an-array-when-clicked-by-only-js
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchProdutos() { // como nao conseguia fazer o req 2, olhei o código do filipe e troquei o uso de .then pelo try/catch src: https://github.com/tryber/sd-014-a-project-shopping-cart/tree/filipe-andrade-santiago-shopping-cart
  const itens = document.querySelector('.items');
  try {
    const api = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
    const apiJson = await api.json();
    const dados = await apiJson.results;
    for (let i = 0; i < dados.length; i += 1) {
      const product = {
        sku: dados[i].id,
        name: dados[i].title,
        image: dados[i].thumbnail,
      };
      const produto = createProductItemElement(product);
      itens.appendChild(produto);
    }
  } catch (error) {
      alert(`Erro ${error}`);
  }
}

function addItemCart() {
  // console.log("AAAAAAA");
  const botao = document.querySelectorAll('.item__add');
  const carrinho = document.querySelector('.cart__items');
  botao.forEach((item) => item.addEventListener('click', async (evento) => {
      const id = getSkuFromProductItem(evento.target.parentNode);
      fetch(`https://api.mercadolibre.com/items/${id}`).then((response) => {
        response.json().then((dados) => {
            const compras = {
              sku: dados.id,
              name: dados.title,
              salePrice: dados.price,
            };
            carrinho.appendChild(createCartItemElement(compras));
        });
      });
    }));
}

window.onload = async () => {
  await fetchProdutos();
  addItemCart();
};