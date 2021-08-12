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

function createProductItemElement({
  sku,
  name,
  image
}) {
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
  item__add
  // coloque seu código aqui
}

function createCartItemElement({
  sku,
  name,
  salePrice
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = () => {};

const fetchML = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((resposta) => {
      resposta.json().then((dados) => {
        const retornoDados = dados.results;
        retornoDados.forEach((dadosResult => {
          const obj = {
            sku: dadosResult.id,
            name: dadosResult.title,
            image: dadosResult.thumbnail
          }
          document.getElementById('boxItems').appendChild(createProductItemElement(obj));
        }))
      })
    })
}

const criarBotao = () => {
  const clickBotao = document.querySelectorAll('.item__add')
  clickBotao.forEach((botao) => {
    botao.addEventListener('click' , console.log('Click'))
  })
}

window.onload = () => {
  fetchML();
  criarBotao();
}


// let botaoAddCarrinho1 = document.querySelector("#boxItems");
// let botaoAddCarrinho2 = botaoAddCarrinho1.section
// botaoAddCarrinho.addEventListener('click' , function(event) {
//   console.log('teste')
// })


