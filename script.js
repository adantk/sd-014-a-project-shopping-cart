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
  return li;
}

function deselectButton(button) {
  const verify = button.previousSibling.previousSibling.previousSibling.innerText;
  const itensCarrinho = document.getElementsByClassName('cart__item');
  const divsTeste = Array.prototype.find.call(itensCarrinho, function (elementoTeste) {
    return elementoTeste.innerText.includes(verify);
  });
  divsTeste.addEventListener('click', (event) => { 
    document.getElementsByClassName('cart__items')[0].removeChild(event.target);
  });
}

const cartButton = () => {
  const addCarrinho = document.querySelectorAll('.item__add'); // Busca todos os botões das 'caixas' informativas dos produtos
  addCarrinho.forEach((button) => {
    button.addEventListener('click', (target) => { // Ao clicar, executa a função descrita
    const alvo = target.target.previousSibling.previousSibling.previousSibling.innerText;
    fetch(`https://api.mercadolibre.com/items/${alvo}`)
      .then((data) => data.json()) // Transforma a info recebida em JSON
      .then((json) => {
        const local = document.getElementsByClassName('cart__items');
        const infos = {
          sku: json.id,
          name: json.title,
          salePrice: json.price,
        };
        local[0].appendChild(createCartItemElement(infos));
      })
      .then(() => deselectButton(button));
    });
  });
};

const requisito1 = () => {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador') // Acessa a API do Mercado Livre
    .then((data) => data.json()) // Transforma a info recebida em JSON
    .then((json) => {
      const local = document.getElementsByClassName('items'); 
      json.results.forEach((product) => {
        const infos = { // Cons Infos vai ser o objeto parametro a ser enviado para a função createProductItemElement
          sku: product.id,
          name: product.title,
          image: product.thumbnail,
        };
        local[0].appendChild(createProductItemElement(infos)); // Chama a função createProduct... e a section criada nela (com as informações do produto) são adicionadas (appendChild) na section #items
      });
    })
    .then(() => cartButton.call());
};

window.onload = () => requisito1();
