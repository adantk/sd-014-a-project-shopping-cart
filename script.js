const olListCarr = document.querySelector('ol');
const totalPriceItens = document.querySelector('.total-price');

// requisito 5 - a funçao sumPrice serve para fazer a soma do preço usei na linha 6 acesso meu preço inicial text e depois usei parse float para transformar em numero 
// na sequencia somei essa const tot com meu parametro price, meu price busca o preço de cada item da lista atraves da chamada da função que é feita 
//  no requisito 2 entao o preço da lista mais o preço do meu total price / depois salvo com setItem com nome price
function sumPrice(price) {
  const tot = parseFloat(totalPriceItens.innerText);
  totalPriceItens.innerText = tot + parseFloat(price);
  
  localStorage.setItem('price', totalPriceItens.innerHTML);
}

// a funcao abaixo ja veio pronta no projeto ela serve para criar meu elemento imagem com classe, tag e text é chamada linha 44
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

// a funcao abaixo veio no projeto ja pronta, serve para criar meus elementos como tag classe e text sera chamada dentro da funcao da linha 32
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// a funcao abaixo ja veio pronta no projeto  eu fiz apenas uma busca pela minha classe items do html(linha35) e depois joguei minha section criada 
// nesta funcao para dentro do meu items (linha 41) que é uma section 
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

// funcao ja veio no projeto - ela é chamanda no meu requisito 2 e ela é reponsavel por capturar meu Id que foi criado com a tag span 
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// requisito 5 - a funçao abaixo ja estava no codigo fiz apenas adaptação dentro dela aproveitar o evento 
// na linha 52 a 55 criei uma const newLi que armazena um event.target.tagName (compara pelo nome da tag e tem que ser Maiuscula 'LI')
// fiz um if que verifica se nao tiver uma li nao retorna nada e caso tenha segue o codigo 
// linhas 58 ate 63 peguei meu evento no local click com o texto e armazenei em removePriceText depois fiz uma quebra da string no $ e peguei a posicçao seguint 1 
// e armazei numa const ou seja a linha 60 eu pego o texto quebro ele com split e faço um parseFloat para transformar em number 
// depois fiz uma const tot para armazenar meu texto de total price e transfomei em numero /  e em seguida fiz a subtracao 
// peguei meu totalPrices seu texto  atribuindo minha subtracao de tot por removeprice / na sequencia salvei no localStorage

function cartItemClickListener(event) {
  const newli = event.target.tagName === 'LI';
  if (!newli) {
    return;
  }
  const removePriceText = event.target.innerText;
  const removePriceItem = parseFloat(removePriceText.split('$')[1]);
  const tot = parseFloat(totalPriceItens.innerText);
  totalPriceItens.innerText = tot - removePriceItem;
  localStorage.price = tot - removePriceItem;
  event.target.remove();
} 

// a função abaixo ja veio pronta no projeto nao fiz mudancas nela ela serve para criar minhas li é chamanda no requisito 1
function createCartItemElement({
  sku,
  name,
  salePrice,
}) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.id = salePrice;
  return li;
}

// requisito 2 - a funcao addCar serve para adicionar elementos ao carrinho atraves de addEventListener chamando a funcao getSkuFromProductItem acessa 
// os intens criados sao a li filhas de ol depois a funcao faz um fetch para acessar a url e depois mudar json para acessar objeto
// e o array de objetos acessando algumas chaves depois temos um apendchild para jogar dentro da ol e em seguida fiz a soma dos itens adcionados

function addCarr() {
  const buttonAdd = document.querySelectorAll('.item__add');
  buttonAdd.forEach((botton) => {
    botton.addEventListener('click', async (event) => {
      const buscaId = getSkuFromProductItem(event.target.parentElement);
      const buscaUrl = await fetch(`https://api.mercadolibre.com/items/${buscaId}`);
      const urlJason = await buscaUrl.json();
      const novoItem = createCartItemElement({
        sku: urlJason.id,
        name: urlJason.title,  
        salePrice: urlJason.price,
      });
      olListCarr.appendChild(novoItem); // meu novo item do carrinho para dentro da ol = filha de ol
      sumPrice(novoItem.id); 
      localStorage.setItem('lista', olListCarr.innerHTML); // salvando tudo que a funcao 2 adicionou ao carrinho como lista 
    });
  });
}

// requisito 3 - esta funçao busca o botao esvazia carrinho e faz um evento escutador que se for clicado no botao 
// vai fazer minha ol.html receba uma string vazia e fiz meu total-price que busquei pela classe valer o texto 0 
// nas linhas 124 e 125 eu salvei no meu localStorage com lista valendo string vazia e meu price 0
// desta forma ao clicar no botao esvazia ele vai limpar meu ol e salvar valor 0 e strig "" minha lista

function limpaCarrinho() {
  const btnClear = document.querySelector('.empty-cart');
  btnClear.addEventListener('click', () => {
    olListCarr.innerHTML = '';
    document.querySelector('.total-price').innerText = '0';
    localStorage.lista = '';
    localStorage.price = '0';
    });
}

// requisito 4 - criei esta função para buscar os itens salvos no requisit 2 que foram adicionados ao carrinho- busca pelo gitItem
//  e depois na linha 136 criei uma const para armazenar o price se tiver se nao tiver price salvo vai trazer o valor 0
// e verifica na linha 137 que se existir a lista salva retorna minha ol = lista desta forma me retona a lista salva e o mesmo com o price se tiver uma lista vai me retornar a lista

function atualizaLocalStorage() {
  const lista = localStorage.getItem('lista');
  const precoRecuperado = (localStorage.getItem('price') || 0);
  if (lista) {
    olListCarr.innerHTML = lista;
    totalPriceItens.innerHTML = precoRecuperado;
  }
 
  const liItens = document.querySelector('.cart__items');
  liItens.innerHTML = lista;
  liItens.addEventListener('click', cartItemClickListener);
}

// requisito 1 nesta função faço uma chamada na api do mercado livre, pego a resposta transformo em Json e trago meu array results 
// depois disso fiz meu loading requisto 7 depois disso fiz um for que vai percorrer meu results e vou renomear minhas chaves para serem indentificadas no objeto
//  depois do for eu chamei minha funcao que cria minhas li e armazenei numa newItens e depois dou return

function fetchApiProduct(computador) {
  return fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${computador}`) // api dinamica pra fazer novas alterações
  .then((response) => response.json())
  .then((json) => json.results)
  .then((computers) => {
  const loading = document.querySelector('.loading'); // requisito7 -antes dos meus itens aparecerem meu texto loading sera removido ate que os itens voltem a resposta do meu api
  const body = document.querySelector('body');
  body.removeChild(loading);
    const resultadoList = computers.forEach((computer) => {
      const { id: sku, title: name, thumbnail: image,
      } = computer;
      const newItens = createProductItemElement({
        sku, name, image });
      return newItens;
    });
    return resultadoList;
  });
}

window.onload = async () => {
  await fetchApiProduct('computador');
  await addCarr(); 
  limpaCarrinho();
  atualizaLocalStorage();
};