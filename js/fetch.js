const apiCallBack = async () => { // async = funçao com sincronia, um espera o proximo
  const getEndPoint = await `https://api.mercadolibre.com/sites/MLB/search?q=computador`; // const para manipular a API na linha do fetch.
  const getFetch = await fetch(getEndPoint); // const para salvar o retorno do fetch
  const getJson = await getFetch.json();
  return await getJson.results;
}

module.exports = {
  apiCallBack,
}
console.log(apiCallBack());