// Função responsavel pela criação da imagem do elemento:
function createProductImageElement(imageSource) {
  const img = document.createElement('img'); // Criação de uma imagem
  img.className = 'item__image'; // Classe inserida na img
  img.src = imageSource; // tag imagem recebe imagem passada pelo parametro
  return img; // função retorna imagem
}

// Função responsável por criar elementos, classes e inserir texto no elemento:
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element); // criação de elemento que for passada pelo parametro
  e.className = className; // criação de classe do elemento nomeada conforme parametro
  e.innerText = innerText; // innerText adicionada pelo parametro
  return e; // retorno do elemento criado
}

/* Função responsável por adicionar o elemento criado na função acima numa section, 
com os paramentros definidos: */
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section'); // criação de uma section
  section.className = 'item'; // adição de uma classe na section

  section.appendChild(createCustomElement('span', 'item__sku', sku)); // inserido o elemento criado na section
  section.appendChild(createCustomElement('span', 'item__title', name)); // inserindo o elemento na section
  section.appendChild(createProductImageElement(image)); // inserindo imagem na section
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')); 
  // inserindo um botão na section
  const sectionItens = document.querySelector('.items');
  sectionItens.appendChild(section);
  return section; // retorno da section/sections
}

/* Função que insere texto no item passado pelo parametro, que
  deve ser um elemento 'span' e com a classe 'item_sku': */
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
  // retorno do texto do item passado para lista do carrinho
}

const itensStorage = () => {
  const ol = document.querySelector('#cart__items');
  localStorage.setItem('itens', ol.innerHTML);
};

// Função que remove a li que que estiver no carrinho quando for clicada.
function cartItemClickListener(event) {
  const ol = document.querySelector('#cart__items');
  ol.removeChild(event.target);
  itensStorage();
}

const storageList = () => {
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = localStorage.getItem('itens');
  const li = document.querySelectorAll('.cart__item');
  li.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
};

// Função que cria li, adiciona classe, texto e possui um escutador para a função acima:
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requisito 2 . 1:
const addItem = (idItem) => {
  const ol = document.querySelector('.cart__items');
  fetch(`https://api.mercadolibre.com/items/${idItem}`)
    .then((response) => response.json()
      .then((id) => {
        ol.appendChild(createCartItemElement({ // Cria uma li com dados do produto
          sku: id.id, name: id.title, salePrice: id.price, 
        }));
      })).then(() => itensStorage()); // Insere o item do carrinho no local storage
};

// Requisito 2 . 2:
const buttonCar = () => {
  const addCar = document.querySelectorAll('.item__add');
  addCar.forEach((botao) => {
    botao.addEventListener('click', (event) => {
      addItem(getSkuFromProductItem(event.target.parentElement));
    });
  });
};

// Requisito 1 - Cria a lista de produtos no site:
const productsList = (item) => {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`)
    .then((response) => response.json()
      .then((computers) => computers.results.forEach((computer) => {
        createProductItemElement({ 
          sku: computer.id,
          name: computer.title,
          image: computer.thumbnail });
      }))
      .then(() => buttonCar()));
};

window.onload = () => {
  productsList('computador');
  storageList();
};
