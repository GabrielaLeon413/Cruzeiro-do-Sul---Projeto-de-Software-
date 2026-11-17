
const CHAVE_ESTOQUE = "sistemaDoacoes.estoque";

function obterEstoque() {
  return JSON.parse(localStorage.getItem(CHAVE_ESTOQUE) || "[]");
}

function registrarEntrada(produto, quantidade) {
  const estoque = obterEstoque();

  let item = estoque.find(p => p.nome === produto);

  if (item) {
    item.quantidade += Number(quantidade);
  } else {
    estoque.push({
      nome: produto,
      quantidade: Number(quantidade)
    });
  }

  localStorage.setItem(CHAVE_ESTOQUE, JSON.stringify(estoque));
  return "Entrada registrada com sucesso!";
}

function registrarSaida(produto, quantidade) {
  const estoque = obterEstoque();
  const item = estoque.find(p => p.nome === produto);

  if (!item || item.quantidade < Number(quantidade)) {
    return "Estoque insuficiente!";
  }

  item.quantidade -= Number(quantidade);

  localStorage.setItem(CHAVE_ESTOQUE, JSON.stringify(estoque));
  return "Saída registrada com sucesso!";
}
