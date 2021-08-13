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
    // const item = event.target.parentNode;
    // const itemId = getSkuFromProductItem(item);
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
    });
  };

window.onload = () => { };

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
    Botao.addEventListener('click', (event) => {
      const getIdProduct = getSkuFromProductItem(event.target.parentNode);
      chamaFetchId(getIdProduct);
    });
    const items = document.getElementsByClassName('items')[0];
    items.appendChild(item);
    }));
};
window.onload = () => chamafetchMl('computador');