const listaProdutos = async () => {
  const listaDeProdutos = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$QUERY'); 
  const listaDeProdutosJson = await listaDeProdutos.json();
};
