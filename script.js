const ol = document.querySelector('.cart__items');

function createProductImageElement(imageSource) { 
  const img = document.createElement('img'); // cria imagem 
  img.className = 'item__image'; // classe da imagem
  img.src = imageSource; // fonte 
  return img; 
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function save() {
  localStorage.setItem('save', ol.innerHTML); //  definindo key e value (chave:'save' e valor: conteúdo da lista)
}

function cartItemClickListener(event) {
  event.target.remove(); // Element.remove()método remove o elemento da árvore a que pertence.
  save();
   }
 
  function createCartItemElement({ id: sku, title: name, price: salePrice }) { //  createCartItemElement() para criar os componentes HTML referentes a um item do carrinho.
    const li = document.createElement('li');
     li.className = 'cart__item';
     li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
     li.addEventListener('click', cartItemClickListener);
     return li;
   }
  
  // 2. Adicione o produto ao carrinho de compras
  async function createCart(event) {
     // Cada produto na página HTML possui um botão com o nome Adicionar ao carrinho!
      const $ItemID = event.target.parentElement.firstChild.innerText; // $ItemID deve ser o valor id do item selecionado.
    
      const apiItem = await fetch(`https://api.mercadolibre.com/items/${$ItemID}`);
      const itemJson = await apiItem.json();
      ol.appendChild(createCartItemElement(itemJson)); 
      save();
      // Adicione o elemento retornado da função createCartItemElement(product) como filho do elemento <ol class="cart__items">.
    }
    function createProductItemElement({ id: sku, title: name, thumbnail: image }) { // thumbnail: chave da imagem, sku: campo id, title: nome do produto retornados pela API
      const section = document.createElement('section'); // cria sessão 
      section.className = 'item'; // com classe item
      // para cada sessão tem dois spans, um com sku e um com title, uma imagem e um botão
      section.appendChild(createCustomElement('span', 'item__sku', sku));
      section.appendChild(createCustomElement('span', 'item__title', name));
      section.appendChild(createProductImageElement(image));
      section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
      const buttonAdd = section.querySelector('.item__add'); 
      // Ao clicar nesse botão você deve realizar uma requisição para o endpoint:
       buttonAdd.addEventListener('click', createCart);
      return section;
    }
    // 1. Crie uma listagem de produtos
    // Mostre a palavra "loading..." em algum lugar da página apenas durante a requisição à API. O elemento mostrado durante o carregamento da página deve, obrigatóriamente, ter a classe loading.
    
    async function fetchMercado() { // async - dizer que é a função é assíncrona (dentro do assíncrona uso await). 
     // const carreg = document.createElement('h1');
    const load = createCustomElement('p', 'loading', 'loading...');
    document.body.appendChild(load);
    
      // Await - mandar o javascript aguardar a resposta 
      const items = document.querySelector('.items');
    const api = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador'); // fetch criar vínculo com API - endereço da requisição 
    const apiJson = await api.json(); // retorna objeto 
    load.remove();
    apiJson.results.forEach((produto) => items.appendChild(createProductItemElement(produto))); // Adicione o elemento retornado da 
    
    // função createProductItemElement(product) como filho do elemento <section class="items">
    } // acessar results que é um array com os resultados da pesquisa. Utilizando forEach porque map me traz um novo array que não será usado.  
    // forEach executa uma dada função em cada elemento de um array
    
    // 6. Crie um botão para limpar carrinho de compras
    function clear() {
      const btn = document.querySelector('.empty-cart');
      btn.addEventListener('click', () => {
      ///  const lista = document.querySelector('.cart__items');
       ol.innerHTML = '';
       save();
    });
    }

 function recup() {
 const salvo = localStorage.getItem('save'); // getItem: obtem o valor da chave. Armazenada em uma variável
  ol.innerHTML = salvo; //  esta variável é igual ao conteúdo de ol. InnerHTML retorna todo o texto e o HTML de um elemento, no caso: lista ordenada.
 }

    // function getSkuFromProductItem(item) {
    //   return item.querySelector('span.item__sku').innerText;
    // }
    
    window.onload = () => { 
      fetchMercado();
      clear();
      recup();
      const linha = document.querySelectorAll('.cart__item');
      //    1) Deverá ser possível remover items do carrinho ao clicar sobre eles mesmo após regarregar a página
      // quando salvo o conteúdo, salvo apenas o innerHTML, por isso é necessário adicionar o escutador de evento para cada linha;
      linha.forEach((element) => element.addEventListener('click', cartItemClickListener));
     };