
const CHAVE_FORNECEDORES = "sistemaDoacoes.fornecedores";

function obterFornecedores() {
  return JSON.parse(
    localStorage.getItem(CHAVE_FORNECEDORES) || "[]"
  );
}

function cadastrarFornecedor(dados) {
  if (!dados.nome || !dados.telefone) {
    return "Preencha os campos obrigatórios.";
  }

  const fornecedores = obterFornecedores();

  const novoFornecedor = {
    id: Date.now(),
    nome: dados.nome.trim(),
    telefone: dados.telefone.trim(),
    email: dados.email ? dados.email.trim() : "",
    dataCadastro: new Date().toISOString()
  };

  fornecedores.push(novoFornecedor);

  localStorage.setItem(
    CHAVE_FORNECEDORES,
    JSON.stringify(fornecedores)
  );

  return "Fornecedor cadastrado com sucesso!";
}
