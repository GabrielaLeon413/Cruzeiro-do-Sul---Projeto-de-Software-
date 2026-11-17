
const CHAVE_FORNECEDORES = "sistemaDoacoes.fornecedores";

function obterFornecedores() {
  return JSON.parse(localStorage.getItem(CHAVE_FORNECEDORES) || "[]");
}

function salvarFornecedores(fornecedores) {
  localStorage.setItem(CHAVE_FORNECEDORES, JSON.stringify(fornecedores));
}

function cadastrarFornecedor(dados) {
  const fornecedor = {
    id: crypto.randomUUID(),
    nome: dados.nome.trim(),
    documento: dados.documento.trim(),
    telefone: dados.telefone.trim(),
    email: dados.email.trim(),
    endereco: dados.endereco.trim(),
    dataCadastro: new Date().toISOString()
  };

  if (!fornecedor.nome || !fornecedor.documento || !fornecedor.telefone) {
    return { sucesso: false, mensagem: "Preencha os campos obrigatórios." };
  }

  const documento = fornecedor.documento.replace(/\D/g, "");

  if (documento.length !== 11 && documento.length !== 14) {
    return { sucesso: false, mensagem: "CPF ou CNPJ inválido." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fornecedor.email)) {
    return { sucesso: false, mensagem: "E-mail inválido." };
  }

  const fornecedores = obterFornecedores();

  if (fornecedores.some(f =>
    f.documento.replace(/\D/g, "") === documento
  )) {
    return { sucesso: false, mensagem: "Fornecedor já cadastrado." };
  }

  fornecedores.push(fornecedor);
  salvarFornecedores(fornecedores);

  return { sucesso: true, mensagem: "Fornecedor cadastrado com sucesso!" };
}

function excluirFornecedor(id) {
  const fornecedores = obterFornecedores();
  salvarFornecedores(fornecedores.filter(f => f.id !== id));
}

function listarFornecedores() {
  return obterFornecedores();
}
