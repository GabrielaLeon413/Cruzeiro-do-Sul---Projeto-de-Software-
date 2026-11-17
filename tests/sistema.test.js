
const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

let fornecedores;
let estoque;

function criarAmbiente() {
  const dados = new Map();

  const contexto = vm.createContext({
    localStorage: {
      getItem: (chave) => dados.get(chave) || null,
      setItem: (chave, valor) => dados.set(chave, valor)
    },
    crypto: {
      randomUUID: () => "id-teste-" + Math.random()
    }
  });

  const arquivoFornecedores = fs.readFileSync(
    path.join(__dirname, "../src/src/js/fornecedores.js"),
    "utf8"
  );

  const arquivoEstoque = fs.readFileSync(
    path.join(__dirname, "../src/src/js/estoque.js"),
    "utf8"
  );

  vm.runInContext(
    arquivoFornecedores +
    "\nglobalThis.api = { cadastrarFornecedor, listarFornecedores, excluirFornecedor };",
    contexto
  );

  fornecedores = contexto.api;

  vm.runInContext(
    arquivoEstoque +
    "\nglobalThis.api = { obterEstoque, registrarEntrada, registrarSaida };",
    contexto
  );

  estoque = contexto.api;
}

beforeEach(() => {
  criarAmbiente();
});

function fornecedorValido() {
  return {
    nome: "Fornecedor Teste",
    documento: "12345678901",
    telefone: "11999999999",
    email: "teste@email.com",
    endereco: "Rua Teste"
  };
}

// TESTES DE FORNECEDORES

test("deve cadastrar um fornecedor válido", () => {
  const resultado = fornecedores.cadastrarFornecedor(fornecedorValido());

  assert.equal(resultado.sucesso, true);
  assert.equal(fornecedores.listarFornecedores().length, 1);
});

test("deve rejeitar nome vazio", () => {
  const dados = fornecedorValido();
  dados.nome = " ";

  const resultado = fornecedores.cadastrarFornecedor(dados);

  assert.equal(resultado.sucesso, false);
});

test("deve rejeitar CPF ou CNPJ inválido", () => {
  const dados = fornecedorValido();
  dados.documento = "12345";

  const resultado = fornecedores.cadastrarFornecedor(dados);

  assert.equal(resultado.sucesso, false);
});

test("deve rejeitar e-mail inválido", () => {
  const dados = fornecedorValido();
  dados.email = "email-invalido";

  const resultado = fornecedores.cadastrarFornecedor(dados);

  assert.equal(resultado.sucesso, false);
});

test("deve impedir cadastro de documento duplicado", () => {
  fornecedores.cadastrarFornecedor(fornecedorValido());

  const resultado = fornecedores.cadastrarFornecedor(fornecedorValido());

  assert.equal(resultado.sucesso, false);
});

test("deve excluir um fornecedor cadastrado", () => {
  fornecedores.cadastrarFornecedor(fornecedorValido());

  const fornecedor = fornecedores.listarFornecedores()[0];
  fornecedores.excluirFornecedor(fornecedor.id);

  assert.equal(fornecedores.listarFornecedores().length, 0);
});

// TESTES DE ESTOQUE

test("deve registrar entrada de produto", () => {
  estoque.registrarEntrada("Arroz", 10);

  assert.equal(estoque.obterEstoque()[0].quantidade, 10);
});

test("deve somar entradas do mesmo produto", () => {
  estoque.registrarEntrada("Arroz", 10);
  estoque.registrarEntrada("Arroz", 5);

  assert.equal(estoque.obterEstoque()[0].quantidade, 15);
});

test("deve registrar saída de produto", () => {
  estoque.registrarEntrada("Feijão", 10);
  const resultado = estoque.registrarSaida("Feijão", 3);

  assert.equal(resultado, "Saída registrada com sucesso!");
  assert.equal(estoque.obterEstoque()[0].quantidade, 7);
});

test("deve impedir saída maior que o estoque disponível", () => {
  estoque.registrarEntrada("Leite", 5);
  const resultado = estoque.registrarSaida("Leite", 10);

  assert.equal(resultado, "Estoque insuficiente!");
  assert.equal(estoque.obterEstoque()[0].quantidade, 5);
});
