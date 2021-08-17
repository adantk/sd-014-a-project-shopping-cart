const salvaListaLS = () => {
  localStorage.clear();
  const getOl2 = document.getElementsByClassName('cart__items')[0];
  if (getOl2.childElementCount > 0) {
    for (let index = 0; index < getOl2.children.length; index += 1) {
      localStorage.setItem(`chave ${[index]}`, getOl2.children[index].innerHTML);
    }
  } else {
    localStorage.clear();
  }  
};

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

const soma = async () => {
  const getItemsCarrinho = document.querySelectorAll('.cart__item');
  const arr = [];
  await getItemsCarrinho.forEach((item) => {
    arr.push(parseFloat(item.innerText.split('| PRICE: $')[1]));
  });
  const precoT = await arr.reduce((acc, numero) => acc + numero, 0);
  document.querySelector('.total-price').innerText = `${precoT}`;
};

  function cartItemClickListener(event) {
    // coloque seu código aqui
    event.target.remove();
    salvaListaLS();
    soma();
  }
  
  function createCartItemElement({ sku, name, salePrice }) {
    const li = document.createElement('li');
    li.className = 'cart__item';
    li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
    li.addEventListener('click', cartItemClickListener);
    return li;
  }

  const fetchId = (id) => 
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((resposta) => resposta.json());

const chamaFetchId = async (id) => {
  await fetchId(id)
    .then((obj) => {
    const { id: sku, title: name, price: salePrice } = obj;
    const lista = createCartItemElement({ sku, name, salePrice });
    const getOl = document.getElementsByClassName('cart__items')[0];
    getOl.appendChild(lista);
    soma();
    });
  };
  
const fetchML = (pesquisa) => 
    fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${pesquisa}`)
    .then((resposta) => resposta.json());

const chamafetchMl = async (pesquisa) => {
    await fetchML(pesquisa)
    .then((obj) => {
        const { results } = obj;
        return results;
    })
    .then((results) => results.forEach((resultado) => {
        const { id: sku, title: name, thumbnail: image } = resultado;
    const item = createProductItemElement({ sku, name, image });
    const Botao = item.getElementsByClassName('item__add')[0];
    Botao.addEventListener('click', async (event) => {
      const getIdProduct = getSkuFromProductItem(event.target.parentNode);
      await chamaFetchId(getIdProduct);
      await salvaListaLS();
    });
    const items = document.getElementsByClassName('items')[0];
    items.appendChild(item);
    }));
};

const recriaLi = () => {
  const getOl3 = document.getElementsByClassName('cart__items')[0];
  for (let index = 0; index < localStorage.length; index += 1) {
  const li2 = document.createElement('li');
  li2.className = 'cart__item';
  li2.innerText = localStorage.getItem(`chave ${index}`);
  li2.addEventListener('click', cartItemClickListener);
  getOl3.appendChild(li2);
  }
};

const apagaLi = () => {
  const botaoClear = document.getElementsByClassName('empty-cart');
  botaoClear[0].addEventListener('click', () => {
    const getLista = document.querySelectorAll('.cart__item');
    getLista.forEach((item) => item.remove());
    soma();
  });
};

window.onload = async () => {
  const createLoading = document.createElement('p');
  createLoading.classList.add('loading');
  createLoading.innerHTML = 'loading';
  document.body.append(createLoading);
  await chamafetchMl('computador');
  document.getElementsByClassName('loading')[0].remove();
  recriaLi();
  apagaLi();
};
