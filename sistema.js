// ===== SISTEMA E2E HOME BROKER - VERSÃO INTEGRADA =====
// Combina funcionalidades existentes com layout moderno

// Variáveis globais
var usuarios = {};
var usuarioAtual = null;
var carteira = {};
var extrato = [];
var ordens = [];

// Preços dos ativos
var precos = {
  PETR4: 28.50,
  VALE3: 72.30,
  ITUB4: 31.20,
  BBDC4: 27.80,
  ABEV3: 14.25,
  MGLU3: 3.45,
  BBAS3: 49.10,
  LREN3: 18.30
};

var ativos = ['PETR4', 'VALE3', 'ITUB4', 'BBDC4', 'ABEV3', 'MGLU3', 'BBAS3', 'LREN3'];

// Função para debug
function debug(msg, data) {
  console.log('[E2E] ' + msg, data || '');
}

// Função para criar popup estilizado
function criarPopupEstilizado(titulo, mensagem, callback) {
  // Remover popup existente se houver
  var popupExistente = document.getElementById('popup-overlay');
  if (popupExistente) {
    popupExistente.remove();
  }
  
  // Criar overlay
  var overlay = document.createElement('div');
  overlay.id = 'popup-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
  `;
  
  // Criar popup
  var popup = document.createElement('div');
  popup.style.cssText = `
    background: linear-gradient(135deg, #181A20 0%, #2A2D35 100%);
    border: 2px solid #F0B90B;
    border-radius: 15px;
    padding: 30px;
    max-width: 400px;
    width: 90%;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    animation: slideIn 0.3s ease;
    position: relative;
  `;
  
  // Criar conteúdo do popup
  popup.innerHTML = `
    <div style="margin-bottom: 20px;">
      <img src="Imagem/logo-fundo-escuro.jpeg" alt="E2E Logo" style="width: 60px; height: 60px; margin-bottom: 15px; border-radius: 10px;">
    </div>
    <h2 style="color: #F0B90B; margin: 0 0 15px 0; font-size: 24px; font-weight: bold;">${titulo}</h2>
    <p style="color: #FFFFFF; margin: 0 0 25px 0; font-size: 16px; line-height: 1.5;">${mensagem}</p>
    <button id="popup-btn" style="
      background: linear-gradient(135deg, #F0B90B 0%, #FFD700 100%);
      color: #181A20;
      border: none;
      padding: 12px 30px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(240, 185, 11, 0.3);
    ">OK</button>
  `;
  
  // Adicionar estilos de animação
  var style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideIn {
      from { transform: translateY(-50px) scale(0.9); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  // Adicionar ao DOM
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
  
  // Evento de clique no botão
  document.getElementById('popup-btn').addEventListener('click', function() {
    overlay.remove();
    if (callback) callback();
  });
  
  // Fechar ao clicar no overlay
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      overlay.remove();
      if (callback) callback();
    }
  });
}

// Função para formatar CPF
function formatarCPF(input) {
  let value = input.value.replace(/\D/g, '');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  input.value = value;
}

// Funções de validação
function validarCPF(cpf) {
  return cpf.replace(/\D/g, '').length === 11;
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarSenha(senha) {
  return senha.length >= 8 && /[A-Z]/.test(senha) && /\d/.test(senha);
}

// Carregar dados do localStorage
function carregarDados() {
  try {
    const dadosSalvos = localStorage.getItem('e2eHomeBroker');
    if (dadosSalvos) {
      const dados = JSON.parse(dadosSalvos);
      usuarios = dados.usuarios || {};
      carteira = dados.carteira || {};
      extrato = dados.extrato || [];
      ordens = dados.ordens || [];
    }
    
    // Criar usuários de demonstração se não existirem
    if (!usuarios['111.111.111-11']) {
      usuarios['111.111.111-11'] = {
        nome: 'Conta A',
        cpf: '111.111.111-11',
        email: 'contaa@demo.com',
        senha: '123',
        saldo: 10000.00
      };
    }
    
    if (!usuarios['222.222.222-22']) {
      usuarios['222.222.222-22'] = {
        nome: 'Conta B',
        cpf: '222.222.222-22',
        email: 'contab@demo.com',
        senha: '456',
        saldo: 15000.00
      };
    }
    
    debug('Dados carregados', { usuarios: Object.keys(usuarios).length, carteira: Object.keys(carteira).length });
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
}

// Salvar dados no localStorage
function salvarDados() {
  try {
    const dados = {
      usuarios,
      carteira,
      extrato,
      ordens
    };
    localStorage.setItem('e2EHomeBroker', JSON.stringify(dados));
    debug('Dados salvos');
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
  }
}

// Função para mostrar mensagens
function mostrarMensagem(elementId, texto, tipo) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = texto;
    element.className = tipo;
    setTimeout(() => {
      element.textContent = '';
      element.className = '';
    }, 5000);
  }
}

// Função de cadastro
function realizarCadastro() {
  const nome = document.getElementById('nome').value.trim();
  const cpf = document.getElementById('cpf').value.trim();
  const email = document.getElementById('email').value.trim();
  const celular = document.getElementById('celular').value.trim();
  const senha = document.getElementById('senha').value;
  const confirmarSenha = document.getElementById('confirmarSenha').value;
  
  // Validações
  if (!nome || !cpf || !email || !celular || !senha || !confirmarSenha) {
    mostrarMensagem('msgCadastro', 'Todos os campos são obrigatórios', 'error');
    return;
  }
  
  if (!validarCPF(cpf)) {
    mostrarMensagem('msgCadastro', 'CPF inválido', 'error');
    return;
  }
  
  if (!validarEmail(email)) {
    mostrarMensagem('msgCadastro', 'E-mail inválido', 'error');
    return;
  }
  
  if (!validarSenha(senha)) {
    mostrarMensagem('msgCadastro', 'Senha deve ter pelo menos 8 caracteres, uma maiúscula e um número', 'error');
    return;
  }
  
  if (senha !== confirmarSenha) {
    mostrarMensagem('msgCadastro', 'Senhas não coincidem', 'error');
    return;
  }
  
  if (usuarios[cpf]) {
    mostrarMensagem('msgCadastro', 'CPF já cadastrado', 'error');
    return;
  }
  
  // Criar usuário
  usuarios[cpf] = {
    nome,
    cpf,
    email,
    celular,
    senha,
    saldo: 5000.00 // Saldo inicial
  };
  
  salvarDados();
  
  criarPopupEstilizado(
    'Cadastro Realizado!',
    'Sua conta foi criada com sucesso. Você pode fazer login agora.',
    () => {
      window.location.href = 'login.html';
    }
  );
}

// Função de login
function realizarLogin() {
  const cpf = document.getElementById('cpfLogin').value.trim();
  const senha = document.getElementById('senhaLogin').value;
  
  if (!cpf || !senha) {
    mostrarMensagem('loginMsg', 'CPF e senha são obrigatórios', 'error');
    return;
  }
  
  const usuario = usuarios[cpf];
  
  if (!usuario || usuario.senha !== senha) {
    mostrarMensagem('loginMsg', 'CPF ou senha incorretos', 'error');
    return;
  }
  
  usuarioAtual = usuario;
  salvarDados();
  
  // Redirecionar para o dashboard
  window.location.href = 'dashboard.html';
}

// Função de logout
function logout() {
  usuarioAtual = null;
  window.location.href = 'login.html';
}

// Função para executar ordem
function executarOrdem() {
  if (!usuarioAtual) {
    mostrarMensagem('mensagem', 'Usuário não autenticado', 'error');
    return;
  }
  
  const tipo = document.getElementById('tipo').value;
  const ativo = document.getElementById('ativo').value;
  const quantidade = parseInt(document.getElementById('quantidade').value);
  const valor = parseFloat(document.getElementById('valor').value);
  
  if (!ativo || !quantidade || !valor) {
    mostrarMensagem('mensagem', 'Todos os campos são obrigatórios', 'error');
    return;
  }
  
  if (quantidade % 100 !== 0) {
    mostrarMensagem('mensagem', 'Quantidade deve ser múltipla de 100', 'error');
    return;
  }
  
  const total = quantidade * valor;
  
  if (tipo === 'Compra') {
    if (usuarioAtual.saldo < total) {
      mostrarMensagem('mensagem', 'Saldo insuficiente', 'error');
      return;
    }
    
    usuarioAtual.saldo -= total;
    
    if (!carteira[ativo]) {
      carteira[ativo] = { quantidade: 0, valorMedio: 0 };
    }
    
    const valorTotalAnterior = carteira[ativo].quantidade * carteira[ativo].valorMedio;
    const valorTotalNovo = valorTotalAnterior + total;
    carteira[ativo].quantidade += quantidade;
    carteira[ativo].valorMedio = valorTotalNovo / carteira[ativo].quantidade;
    
  } else { // Venda
    if (!carteira[ativo] || carteira[ativo].quantidade < quantidade) {
      mostrarMensagem('mensagem', 'Quantidade insuficiente para venda', 'error');
      return;
    }
    
    usuarioAtual.saldo += total;
    carteira[ativo].quantidade -= quantidade;
    
    if (carteira[ativo].quantidade === 0) {
      delete carteira[ativo];
    }
  }
  
  // Registrar no extrato
  extrato.push({
    data: new Date().toLocaleString(),
    tipo,
    ativo,
    quantidade,
    valor,
    total
  });
  
  salvarDados();
  atualizarDashboard();
  
  mostrarMensagem('mensagem', `Ordem de ${tipo.toLowerCase()} executada com sucesso!`, 'success');
  
  // Limpar formulário
  document.getElementById('quantidade').value = '';
  document.getElementById('valor').value = '';
}

// Função para alterar senha
function alterarSenha() {
  if (!usuarioAtual) {
    mostrarMensagem('senhaMsg', 'Usuário não autenticado', 'error');
    return;
  }
  
  const novaSenha = document.getElementById('novaSenha').value;
  
  if (novaSenha.length < 3) {
    mostrarMensagem('senhaMsg', 'Senha deve ter pelo menos 3 caracteres', 'error');
    return;
  }
  
  usuarioAtual.senha = novaSenha;
  salvarDados();
  
  mostrarMensagem('senhaMsg', 'Senha alterada com sucesso!', 'success');
  document.getElementById('novaSenha').value = '';
}

// Função para atualizar dashboard
function atualizarDashboard() {
  if (!usuarioAtual) return;
  
  // Atualizar informações do usuário
  document.getElementById('username').textContent = usuarioAtual.nome;
  document.getElementById('saldo').textContent = usuarioAtual.saldo.toFixed(2);
  
  // Atualizar book de ofertas
  atualizarBookOfertas();
  
  // Atualizar carteira
  atualizarCarteira();
  
  // Atualizar extrato
  atualizarExtrato();
  
  // Atualizar ordens
  atualizarOrdens();
  
  // Preencher ativos
  preencherAtivos();
}

// Função para atualizar book de ofertas
function atualizarBookOfertas() {
  const tbody = document.querySelector('#book tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  ativos.forEach(ativo => {
    const preco = precos[ativo];
    const variacao = (Math.random() - 0.5) * 10; // Simulação de variação
    const precoAtual = preco + variacao;
    
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${ativo}</td>
      <td>${precoAtual.toFixed(2)}</td>
      <td class="${variacao >= 0 ? 'positive' : 'negative'}">${variacao >= 0 ? '+' : ''}${variacao.toFixed(2)}%</td>
    `;
  });
}

// Função para atualizar carteira
function atualizarCarteira() {
  const portfolioEmpty = document.getElementById('portfolioEmpty');
  const tableWrapper = document.querySelector('#carteira').parentElement;
  const tbody = document.querySelector('#carteira tbody');
  const valorTotalElement = document.getElementById('valorTotal');
  
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  const ativosCarteira = Object.keys(carteira);
  let valorTotal = 0;
  
  if (ativosCarteira.length === 0) {
    portfolioEmpty.style.display = 'block';
    tableWrapper.style.display = 'none';
    valorTotalElement.textContent = 'R$ 0,00';
    return;
  }
  
  portfolioEmpty.style.display = 'none';
  tableWrapper.style.display = 'block';
  
  ativosCarteira.forEach(ativo => {
    const posicao = carteira[ativo];
    const precoAtual = precos[ativo];
    const valorTotalAtivo = posicao.quantidade * precoAtual;
    valorTotal += valorTotalAtivo;
    
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${ativo}</td>
      <td>${posicao.quantidade}</td>
      <td>R$ ${precoAtual.toFixed(2)}</td>
      <td>R$ ${valorTotalAtivo.toFixed(2)}</td>
    `;
  });
  
  valorTotalElement.textContent = `R$ ${valorTotal.toFixed(2)}`;
}

// Função para atualizar extrato
function atualizarExtrato() {
  const tbody = document.querySelector('#extrato tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  extrato.slice(-10).reverse().forEach(operacao => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${operacao.data}</td>
      <td>${operacao.tipo}</td>
      <td>${operacao.ativo}</td>
      <td>${operacao.quantidade}</td>
      <td>R$ ${operacao.valor.toFixed(2)}</td>
      <td>R$ ${operacao.total.toFixed(2)}</td>
    `;
  });
}

// Função para atualizar ordens
function atualizarOrdens() {
  const tbody = document.querySelector('#ordens tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  ordens.slice(-5).reverse().forEach((ordem, index) => {
    const row = tbody.insertRow();
    row.innerHTML = `
      <td>${ordem.data}</td>
      <td>${ordem.tipo}</td>
      <td>${ordem.ativo}</td>
      <td>${ordem.quantidade}</td>
      <td>R$ ${ordem.valor.toFixed(2)}</td>
      <td><button class="btn-cancel" onclick="cancelarOrdem(${ordens.length - 1 - index})">Cancelar</button></td>
    `;
  });
}

// Função para cancelar ordem
function cancelarOrdem(index) {
  ordens.splice(index, 1);
  salvarDados();
  atualizarOrdens();
}

// Função para preencher ativos
function preencherAtivos() {
  const select = document.getElementById('ativo');
  if (!select) return;
  
  select.innerHTML = '<option value="">Selecione um ativo</option>';
  
  ativos.forEach(ativo => {
    const option = document.createElement('option');
    option.value = ativo;
    option.textContent = `${ativo} - R$ ${precos[ativo].toFixed(2)}`;
    select.appendChild(option);
  });
}

// Função para atualizar preços
function atualizarPrecos() {
  ativos.forEach(ativo => {
    const variacao = (Math.random() - 0.5) * 0.1; // Variação de ±5%
    precos[ativo] = Math.max(0.01, precos[ativo] * (1 + variacao));
  });
}

// Função para toggle de senha
function toggleSenha(inputId, element) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    element.textContent = '🙈';
  } else {
    input.type = 'password';
    element.textContent = '👁️';
  }
}

// Função para mostrar recuperação de senha
function showRecuperarSenha() {
  criarPopupEstilizado(
    'Recuperação de Senha',
    'Entre em contato com o suporte para recuperar sua senha.',
    null
  );
}

// Função para verificar localStorage
function verificarLocalStorage() {
  if (typeof(Storage) !== "undefined") {
    debug('localStorage disponível');
    return true;
  } else {
    debug('localStorage não disponível');
    return false;
  }
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
  debug('Sistema iniciado');
  
  if (!verificarLocalStorage()) {
    alert('Seu navegador não suporta localStorage. Algumas funcionalidades podem não funcionar.');
    return;
  }
  
  carregarDados();
  
  // Se estiver na página de dashboard, inicializar
  if (window.location.pathname.includes('dashboard.html')) {
    // Simular carregamento
    setTimeout(() => {
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }
      
      atualizarDashboard();
      
      // Atualizar preços a cada 30 segundos
      setInterval(atualizarPrecos, 30000);
      setInterval(atualizarDashboard, 30000);
    }, 2000);
  }
  
  // Se estiver na página de login, verificar se já está logado
  if (window.location.pathname.includes('login.html')) {
    const dadosSalvos = localStorage.getItem('e2EHomeBroker');
    if (dadosSalvos) {
      const dados = JSON.parse(dadosSalvos);
      if (dados.usuarioAtual) {
        usuarioAtual = dados.usuarioAtual;
        window.location.href = 'dashboard.html';
      }
    }
  }
});

// Função para formatar CPF (para inputs)
function formatarCPFInput(input) {
  let value = input.value.replace(/\D/g, '');
  if (value.length <= 11) {
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = value;
  }
}
