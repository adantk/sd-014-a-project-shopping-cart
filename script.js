const itemContainer = document.querySelector('.items');
const cart = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
const removeItemsButton = document.querySelector('.empty-cart');

// função que atualiza o preço total do carrinho de compras.
function updatePrice() {
  const cartItems = document.querySelectorAll('.cart__item');
  let precoTotal = 0;
  for (let i = 0; i < cartItems.length; i += 1) {
    const preco = Number(cartItems[i].innerText.split('$')[1]);
    precoTotal += preco;
  }
  totalPrice.innerText = precoTotal;
}

// função que salva o HTML do carrinho no localStorage.
function autoSaveCart() {
  localStorage.setItem('cart', cart.innerHTML);
}

// função que adiciona o listener no botão que remove todos os itens do carrinho.
function removeButton() {
  removeItemsButton.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = '';
    updatePrice();
    autoSaveCart();
  });
}

// função chamada no listener após o carregamento da página que permite remover o item selecionado do carrinho.
// dentro dela são chamadas as funções de atualizar o preço do carrinho e de salvar o carrinho atualizado no localStorage.
function cartItemClickListener(event) {
  event.target.remove();
  updatePrice();
  autoSaveCart();
}

// função que adiciona aos itens do carrinho, após a página ser recarregada, o listener que permite removê-los.
function addListenerAfterLoad() {
  const cartItems = document.querySelectorAll('.cart__item');
  for (let i = 0; i < cartItems.length; i += 1) {
    cartItems[i].addEventListener('click', cartItemClickListener);
  }
}

// função que recupera no localStorage os itens do carrinho antes do usuário sair da página e que os adiciona ao carrinho novamente
// assim que a página é carregada. É chamada a função para adicionar novamente o listener que possibilita remover os itens do carrinho.
function autoLoadCart() {
  const previousCart = localStorage.getItem('cart');
  cart.innerHTML = previousCart;
  addListenerAfterLoad();
}

// função auxiliar que cria o elemento 'img' do item buscado na API.
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// função auxiliar que cria um elemento customizável a partir das informações do item buscado na API.
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// função que cria, com ajuda das funções auxiliares, um elemento para ser adicionado à página contendo seu ID (sku),
// name e imagem.
function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// função que cria, a partir do produto já disponível na página, uma representação do elemento que será
// inserida no carrinho. 
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// função auxiliar que acessa a página específica de um determinado produto a partir de sei ID e retorna seu JSON.
function fetchInfos(id) {
  return fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((resp) => resp.json());
}

// função auxiliar que adiciona o um listener a cada produto já disponível na página. A função anônima dentro do listener
// coleta as informações deste produto, utiliza da função auxiliar que modela o item para o carrinho e o adiciona a partir
// do 'click'. Após a adição do produto no carrinho, são chamas as funções para atualizar o carrinho no localStorage e
// atualizar o preço total.
function itemEventListener(item, productId) {
  item.addEventListener('click', async () => {
    const itemInfo = await fetchInfos(productId);
    const itemForCart = createCartItemElement({ sku: itemInfo.id,
      name: itemInfo.title,
      salePrice: itemInfo.price,
    });
    cart.append(itemForCart);
    autoSaveCart();
    updatePrice();
  });
}

// função que adiciona dinamicamente o aviso de loading na página, que é retirado assim que a lista de produtos termina
// de carregar.
function addLoading() {
  const loadingState = document.createElement('p');
  loadingState.innerText = 'Loading...';
  loadingState.classList.add('loading');
  document.body.append(loadingState);
}

// função que remove o aviso de loading da página assim que a lista termina de carregar.
function removeLoading() {
  const loadingState = document.querySelector('.loading');
  loadingState.remove();
}

// função que recupera, através da API, a lista de computadores disponíveis no ML. A partir da resposta convertida para JSON,
// para cada elemento do array devolvido, o produto que será exibido na tela é modelado, é adicionado a esse produto um listener
// que permite que ele seja adicionado ao carrinho e por fim é acoplado no container de produtos.
// ao final da execução do forEach, é removido o aviso de loading.
function getItemsFromAPI() {
  const fetching = fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const fetchResponse = fetching.then((resp) => resp.json());
  const JSON = fetchResponse.then((respJSON) => respJSON.results.forEach((product) => {
        const item = createProductItemElement({ sku: product.id,
          name: product.title,
          image: product.thumbnail,
        });
        itemEventListener(item, product.id);
        itemContainer.append(item);
      }));
    JSON.then(() => removeLoading());
}

// funções que são chamadas imediatamente após a inicialização da página.
window.onload = () => {
  // adiciona a mensagem de loading;
  addLoading();
  // resgata os itens da API para serem exibidos na tela;
  getItemsFromAPI();
  // busca e carrega, se existir, o carrinho anterior no localStorage;
  autoLoadCart();
  // adiciona o listener ao botão de remover todos os itens do carrinho;
  removeButton();
  // atualiza o preço total da compra baseado nos itens atuais do carrinho;
  updatePrice();
};

// agradecimentos especiais ao Murilo que é um assert humano e ao Fernando que me desempacou na primeira questão! :P
