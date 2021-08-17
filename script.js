// const appedComputer = (id, title, imageSource) => {
//   const sectionPai = document.querySelector(.'items');

//   const sectionFilha = document.createElement('section');
//   const spanId = document.createElement('span'); 
//   const spanTitle = document.createElement('span');
//   // const img = document.createElement('img');
//   const button = document.createElement('button');

//   spanId.innerText = id;
//   spanId.classList.add('item_sku');
//   spanTitle.innerHTML = title;
//   spanTitle.classList.add('item_title');
//   img.src = urlImage;
//   img.classList.add('item_image');
//   button.classList.add('item_add');
//   sectionFilha.classList.add('item');

//   sectionFilha.appendChild(spanId);
//   sectionFilha.appendChild(spanTitle);
//   sectionFilha.appendChild(img);
//   sectionFilha.appendChild(button);

//   sectionPai.appendChild(sectionFilha);
// }

const olListCarr = document.querySelector('ol');

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
  image,
}) {
  const section = document.createElement('section');
  section.className = 'item';
  const itens = document.querySelector('.items');

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  itens.appendChild(section);

  return section;
}

// requisito 1
function fetchApiProduct(computador) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${computador}`)
    .then((response) => response.json())
    .then((json) => json.results);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  // olListCarr.removeChild(event.target);
}

function createCartItemElement({
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

function addCarr() {
  const buttonAdd = document.querySelectorAll('.item__add');
  buttonAdd.forEach((botton) => {
    botton.addEventListener('click', async (event) => {
      const buscaId = getSkuFromProductItem(event.target.parentElement);
      const buscaUrl = await fetch(`https://api.mercadolibre.com/items/${buscaId}`)
        .then((response) => response.json());
      olListCarr.appendChild(createCartItemElement({
        sku: buscaUrl.id,
        name: buscaUrl.title,
        salePrice: buscaUrl.price,
      }));
    });
  });
}

window.onload = () => {
  fetchApiProduct('computador').then((computers) => {
    const resultadoList = computers.forEach((computer) => {
      const {
        id: sku,
        title: name,
        thumbnail: image,
      } = computer;
      const newItens = createProductItemElement({
        sku,
        name,
        image,
      });
      return newItens;
    });
    return resultadoList;
  })
  .then(() => addCarr());
};