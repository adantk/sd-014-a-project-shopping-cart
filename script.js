const cartItems = document.querySelector('.cart__items');

function atualizaCart() {
  localStorage.setItem('cartItems', cartItems.innerHTML);
}

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
  event.target.remove();
  atualizaCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = () => {
  const itensSalvos = localStorage.getItem('cartItems');
  cartItems.innerHTML = itensSalvos;
};

function buttonToAdd() {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const id = event.target.parentNode.children[0].innerText;
      fetch(`https://api.mercadolibre.com/items/${id}`)
        .then((response) => response.json())
        .then((response) => {
          const item = { sku: response.id, name: response.title, salePrice: response.price };
          cartItems.appendChild(createCartItemElement(item));
          atualizaCart();
        });
    });
  });
}
buttonToAdd();
// Novamente utilizei o código do colega Fernando Nascimento como base: https://github.com/tryber/sd-014-a-project-shopping-cart/pull/13/commits/5baa9c7e66f014808a2503d37b7a66bb9f8c81ac
// 1 - Primeiramente, guardamos em uma variável todos os botões criados na função createProductItemElement();
// 2 -  Em seguida, para cada botão, adicionamos um evento de clique, fazendo com que seja criado um item filho dentro do carrinho(lista não ordenada com a classe .cart__items) para cada clique em um item da loja;
// 3 - Logo a seguir, criamos uma variável para guardar o id do alvo daquele evento;
// 4- Buscamos a URL da API utilizando a requisição fetch, juntamente com o template literals, para que a mudança do final do link possa ser feita conforme o id capturado anteriormente.
// 5 - Com a URL validada, o conteúdo é transformada em json.
// 6 - Com a transformação do conteúdo para json, criamos uma variável que guarda atributos(sku, name, salePrice) e seus respectivos valores(id, name, price) e, assim, montamos de forma dinâmica no HTML os itens do carrinho criados na função createCartItemElement();

function fetchMercadoLivre() {
  const componenteHTML = document.querySelector('.items');
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((response) => response.results.forEach((resultado) => {
      componenteHTML.appendChild(createProductItemElement({
        sku: resultado.id,
        name: resultado.title,
        image: resultado.thumbnail,
      }));
    }))
    .then(() => {
      buttonToAdd();
    });
}
fetchMercadoLivre();
// Código do requisito um baseado no trabalho do colega Fernando: https://github.com/tryber/sd-014-a-project-shopping-cart/pull/13/commits/114096fa1902021e1d50006347d430cb73d69e73
// 1 - Guardamos em uma variável a resultado do resgate do elemento com a classe 'items'.
// 2 - Buscamos a URL pedida no enunciado a partir da requisição fetch();
// 3 - Se a URL passada é válida, então transformamos o resultado da busca da URL em json;
// 4 - Se o json é gerado, então pegamos o atributo 'results' dentro do json e, para cada objeto contido dentro da array, teremos um elemento novo, resultado da função createProductItemElement(), dentro da section com classe 'items' com os atributos e valores id, título e imagem;
// 5 - Por final, fazemos a chamada da função que adiciona os itens da lista de computadores para a carrinho.