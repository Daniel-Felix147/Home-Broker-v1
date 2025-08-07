// Variáveis globais
let usuarios = [
    { cpf: '111.111.111-11', senha: '123', nome: 'Conta A', saldo: 10000 },
    { cpf: '222.222.222-22', senha: '456', nome: 'Conta B', saldo: 15000 }
];

let usuarioLogado = null;
let carteira = {};
  let extrato = [];
  let ordens = [];

// Função para alternar tema escuro/claro
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle i');
    
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        themeToggle.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-theme');
        themeToggle.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    }
}

// Carregar tema salvo
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.querySelector('.theme-toggle i');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.className = 'fas fa-sun';
    }
}

// Função para verificar hash na URL e abrir modal de cadastro
function checkHashAndOpenModal() {
    if (window.location.hash === '#cadastro') {
        setTimeout(() => {
            showCadastroModal();
        }, 500);
    }
}

// Funções do Modal de Cadastro
function showCadastroModal() {
    const modal = document.getElementById('cadastroModal');
    modal.style.display = 'flex';
    resetCadastroForm();
}

function closeCadastroModal() {
    const modal = document.getElementById('cadastroModal');
    modal.style.display = 'none';
    resetCadastroForm();
}

// Fechar modal ao clicar fora
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('cadastroModal');
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeCadastroModal();
        }
    });
    
    // Carregar tema salvo
    loadTheme();
    
    // Verificar hash na URL para abrir modal de cadastro
    checkHashAndOpenModal();
});

// Função para resetar formulário de cadastro
function resetCadastroForm() {
    document.getElementById('cadastroForm').reset();
    document.getElementById('cadastroMsg').textContent = '';
    document.getElementById('cadastroSuccess').textContent = '';
    
    // Limpar mensagens de erro
    const errorElements = document.querySelectorAll('#cadastroModal .error');
    errorElements.forEach(el => el.textContent = '');
    
    // Resetar validação visual
    const inputWrappers = document.querySelectorAll('#cadastroModal .input-icon-wrapper');
    inputWrappers.forEach(wrapper => {
        wrapper.classList.remove('valid', 'invalid');
    });
    
    // Resetar barra de força
    const strengthBar = document.getElementById('senhaStrengthBar');
    strengthBar.className = 'strength-bar';
    strengthBar.querySelector('div').style.width = '0%';
    
    // Desabilitar botão
    document.getElementById('btnCriarConta').disabled = true;
}

// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    // Validar primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let dv1 = resto < 2 ? 0 : resto;
    
    // Validar segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let dv2 = resto < 2 ? 0 : resto;
    
    return cpf.charAt(9) == dv1 && cpf.charAt(10) == dv2;
}

// Função para validar telefone
function validarTelefone(telefone) {
    const telefoneLimpo = telefone.replace(/\D/g, '');
    return telefoneLimpo.length >= 10 && telefoneLimpo.length <= 11;
}

// Função para validar força da senha
function validarForcaSenha(senha) {
    let pontos = 0;
    
    if (senha.length >= 8) pontos += 2;
    if (/[A-Z]/.test(senha)) pontos += 1;
    if (/[a-z]/.test(senha)) pontos += 1;
    if (/[0-9]/.test(senha)) pontos += 1;
    if (/[^A-Za-z0-9]/.test(senha)) pontos += 1;
    
    if (pontos <= 2) return 'weak';
    if (pontos <= 4) return 'medium';
    return 'strong';
}

// Função para atualizar validação visual
function atualizarValidacaoVisual(campo, isValid, mensagem = '') {
    const wrapper = campo.closest('.input-icon-wrapper');
    const msgElement = wrapper.nextElementSibling;
    
    wrapper.classList.remove('valid', 'invalid');
    
    if (campo.value.trim() === '') {
        wrapper.classList.remove('valid', 'invalid');
        if (msgElement && msgElement.classList.contains('error')) {
            msgElement.textContent = '';
        }
        return;
    }
    
    if (isValid) {
        wrapper.classList.add('valid');
        if (msgElement && msgElement.classList.contains('error')) {
            msgElement.textContent = '';
        }
    } else {
        wrapper.classList.add('invalid');
        if (msgElement && msgElement.classList.contains('error')) {
            msgElement.textContent = mensagem;
        }
    }
}

// Função para validar cadastro com validação visual
function validarCadastro() {
    const nome = document.getElementById('cadNome');
    const cpf = document.getElementById('cadCpf');
    const email = document.getElementById('cadEmail');
    const cel = document.getElementById('cadCel');
    const senha = document.getElementById('cadSenha');
    const senha2 = document.getElementById('cadSenha2');
    
    let todosValidos = true;
    
    // Validar nome
    const nomeValido = nome.value.trim().length >= 3;
    atualizarValidacaoVisual(nome, nomeValido, 'Nome deve ter pelo menos 3 caracteres');
    if (!nomeValido) todosValidos = false;
    
    // Validar CPF
    const cpfValido = validarCPF(cpf.value);
    atualizarValidacaoVisual(cpf, cpfValido, 'CPF inválido');
    if (!cpfValido) todosValidos = false;
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailValido = emailRegex.test(email.value);
    atualizarValidacaoVisual(email, emailValido, 'Email inválido');
    if (!emailValido) todosValidos = false;
    
    // Validar telefone
    const celValido = validarTelefone(cel.value);
    atualizarValidacaoVisual(cel, celValido, 'Telefone inválido');
    if (!celValido) todosValidos = false;
    
    // Validar senha
    const senhaValida = senha.value.length >= 8 && /[A-Z]/.test(senha.value) && /[0-9]/.test(senha.value);
    atualizarValidacaoVisual(senha, senhaValida, 'Senha deve ter pelo menos 8 caracteres, 1 maiúscula e 1 número');
    if (!senhaValida) todosValidos = false;
    
    // Atualizar barra de força da senha
    const strengthBar = document.getElementById('senhaStrengthBar');
    const strength = validarForcaSenha(senha.value);
    strengthBar.className = `strength-bar ${strength}`;
    
    // Validar confirmação de senha
    const senha2Valida = senha2.value === senha.value && senha.value !== '';
    atualizarValidacaoVisual(senha2, senha2Valida, 'Senhas não coincidem');
    if (!senha2Valida) todosValidos = false;
    
    // Habilitar/desabilitar botão
    document.getElementById('btnCriarConta').disabled = !todosValidos;
    
    return todosValidos;
}

// Função para validar campo individual quando usuário interage
function validarCampo(campo, tipo) {
    let isValid = false;
    let mensagem = '';
    
    switch(tipo) {
        case 'nome':
            isValid = campo.value.trim().length >= 3;
            mensagem = 'Nome deve ter pelo menos 3 caracteres';
            break;
        case 'cpf':
            isValid = validarCPF(campo.value);
            mensagem = 'CPF inválido';
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(campo.value);
            mensagem = 'Email inválido';
            break;
        case 'telefone':
            isValid = validarTelefone(campo.value);
            mensagem = 'Telefone inválido';
            break;
        case 'senha':
            isValid = campo.value.length >= 8 && /[A-Z]/.test(campo.value) && /[0-9]/.test(campo.value);
            mensagem = 'Senha deve ter pelo menos 8 caracteres, 1 maiúscula e 1 número';
            break;
        case 'senha2':
            const senha = document.getElementById('cadSenha');
            isValid = campo.value === senha.value && senha.value !== '';
            mensagem = 'Senhas não coincidem';
            break;
    }
    
    atualizarValidacaoVisual(campo, isValid, mensagem);
    
    // Atualizar barra de força se for senha
    if (tipo === 'senha') {
        const strengthBar = document.getElementById('senhaStrengthBar');
        const strength = validarForcaSenha(campo.value);
        strengthBar.className = `strength-bar ${strength}`;
    }
    
    // Verificar se todos os campos estão válidos para habilitar botão
    verificarFormularioCompleto();
}

// Função para verificar se todo o formulário está válido
function verificarFormularioCompleto() {
    const nome = document.getElementById('cadNome');
    const cpf = document.getElementById('cadCpf');
    const email = document.getElementById('cadEmail');
    const cel = document.getElementById('cadCel');
    const senha = document.getElementById('cadSenha');
    const senha2 = document.getElementById('cadSenha2');
    
    const todosValidos = 
        nome.value.trim().length >= 3 &&
        validarCPF(cpf.value) &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) &&
        validarTelefone(cel.value) &&
        senha.value.length >= 8 && /[A-Z]/.test(senha.value) && /[0-9]/.test(senha.value) &&
        senha2.value === senha.value && senha.value !== '';
    
    document.getElementById('btnCriarConta').disabled = !todosValidos;
}

// Função para criar conta (melhorada)
function criarConta() {
    if (!verificarFormularioCompleto()) {
        return;
    }
    
    const btnCriarConta = document.getElementById('btnCriarConta');
    const btnText = document.getElementById('btnCriarContaText');
    const btnLoading = document.getElementById('btnCriarContaLoading');
    const msgElement = document.getElementById('cadastroMsg');
    const successElement = document.getElementById('cadastroSuccess');
    
    // Mostrar loading
    btnCriarConta.disabled = true;
    btnText.style.display = 'none';
    btnLoading.classList.remove('hidden');
    msgElement.textContent = '';
    successElement.textContent = '';
    
    // Simular processamento
    setTimeout(() => {
        const nome = document.getElementById('cadNome').value;
        const cpf = document.getElementById('cadCpf').value;
        const email = document.getElementById('cadEmail').value;
        const cel = document.getElementById('cadCel').value;
        const senha = document.getElementById('cadSenha').value;
        
        // Verificar se CPF já existe
        if (usuarios.find(u => u.cpf === cpf)) {
            msgElement.textContent = 'CPF já cadastrado!';
            btnCriarConta.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.classList.add('hidden');
            return;
        }
        
        // Adicionar novo usuário
        usuarios.push({
            cpf: cpf,
            senha: senha,
            nome: nome,
            saldo: 5000, // Saldo inicial
            carteira: {},
            extrato: [],
            ordens: []
        });
        
        // Mostrar sucesso
        successElement.textContent = 'Conta criada com sucesso! Você pode fazer login agora.';
        
        // Resetar formulário após 2 segundos
        setTimeout(() => {
            closeCadastroModal();
        }, 2000);
        
    }, 1500);
}

// Função para validar login com interação
function validarLogin() {
    const cpf = document.getElementById('cpf');
    const senha = document.getElementById('senha');
    const msgElement = document.getElementById('loginMsg');
    
    // Só mostrar erro se ambos os campos tiverem conteúdo
    if (cpf.value.trim() && senha.value.trim()) {
        const usuario = usuarios.find(u => u.cpf === cpf.value && u.senha === senha.value);
        
        if (!usuario) {
            msgElement.textContent = 'CPF ou senha incorretos!';
            return false;
        } else {
            msgElement.textContent = '';
            return true;
        }
    }
    
    return false;
}

// Função de login modificada
  function login() {
    const cpf = document.getElementById('cpf').value;
    const senha = document.getElementById('senha').value;
    const msgElement = document.getElementById('loginMsg');
    
    // Limpar mensagem anterior
    msgElement.textContent = '';
    
    const usuario = usuarios.find(u => u.cpf === cpf && u.senha === senha);
    
    if (usuario) {
        usuarioLogado = usuario;
      document.getElementById('login').classList.add('hidden');
      document.getElementById('portal').classList.remove('hidden');
        document.getElementById('username').textContent = usuario.nome;
        document.getElementById('saldo').textContent = usuario.saldo.toFixed(2);
        
        // Inicializar dados
        inicializarDados();
        
        msgElement.textContent = '';
    } else {
        // Só mostrar erro se ambos os campos tiverem conteúdo
        if (cpf.trim() && senha.trim()) {
            msgElement.textContent = 'CPF ou senha incorretos!';
        }
    }
}

// Função para mostrar/ocultar senha
function toggleSenha(campoId, elemento) {
    const campo = document.getElementById(campoId);
    if (campo.type === 'password') {
        campo.type = 'text';
        elemento.textContent = '🙈';
    } else {
        campo.type = 'password';
        elemento.textContent = '👁️';
    }
}

// Função de logout
  function logout() {
    usuarioLogado = null;
    document.getElementById('portal').classList.add('hidden');
    document.getElementById('login').classList.remove('hidden');
    document.getElementById('cpf').value = '';
    document.getElementById('senha').value = '';
    document.getElementById('loginMsg').textContent = '';
}

// Função para mostrar recuperação de senha
function showRecuperarSenha() {
    document.getElementById('login').classList.add('hidden');
    document.getElementById('recuperarSenha').classList.remove('hidden');
}

// Função para mostrar login
function showLogin() {
    document.getElementById('recuperarSenha').classList.add('hidden');
    document.getElementById('login').classList.remove('hidden');
}

// Função para validar recuperação de senha
function validarRecuperacaoSenha() {
    const cpf = document.getElementById('recCpf');
    const email = document.getElementById('recEmail');
    const msgElement = document.getElementById('recuperarSenhaMsg');
    const successElement = document.getElementById('recuperarSenhaSuccess');
    
    // Limpar mensagens
    msgElement.textContent = '';
    successElement.textContent = '';
    
    // Só validar se ambos os campos tiverem conteúdo
    if (cpf.value.trim() && email.value.trim()) {
        const usuario = usuarios.find(u => u.cpf === cpf.value);
        
        if (usuario) {
            successElement.textContent = 'Email de recuperação enviado!';
    } else {
            msgElement.textContent = 'CPF não encontrado!';
        }
    }
}

// Função para recuperar senha modificada
function recuperarSenha() {
    const cpf = document.getElementById('recCpf').value;
    const email = document.getElementById('recEmail').value;
    const msgElement = document.getElementById('recuperarSenhaMsg');
    const successElement = document.getElementById('recuperarSenhaSuccess');
    
    // Limpar mensagens
    msgElement.textContent = '';
    successElement.textContent = '';
    
    // Só processar se ambos os campos tiverem conteúdo
    if (cpf.trim() && email.trim()) {
        const usuario = usuarios.find(u => u.cpf === cpf);
        
        if (usuario) {
            successElement.textContent = 'Email de recuperação enviado!';
        } else {
            msgElement.textContent = 'CPF não encontrado!';
        }
    }
}

// Função para alterar senha
function alterarSenha() {
    const novaSenha = document.getElementById('novaSenha').value;
    const msgElement = document.getElementById('senhaMsg');
    
    if (novaSenha.length < 6) {
        msgElement.textContent = 'Senha deve ter pelo menos 6 caracteres!';
        return;
    }
    
    if (!/[A-Z]/.test(novaSenha) || !/[0-9]/.test(novaSenha)) {
        msgElement.textContent = 'Senha deve conter pelo menos 1 maiúscula e 1 número!';
        return;
    }
    
    usuarioLogado.senha = novaSenha;
    msgElement.textContent = 'Senha alterada com sucesso!';
    document.getElementById('novaSenha').value = '';
}

// Função para inicializar dados
function inicializarDados() {
    // Inicializar carteira (cada usuário tem carteira própria)
    if (!usuarioLogado.carteira) {
        usuarioLogado.carteira = {
            'PETR4': 100,
            'VALE3': 50,
            'ITUB4': 200
        };
    }
    carteira = usuarioLogado.carteira;
    
    // Inicializar extrato (cada usuário tem extrato próprio)
    if (!usuarioLogado.extrato) {
        usuarioLogado.extrato = [];
    }
    extrato = usuarioLogado.extrato;
    
    // Inicializar ordens (cada usuário tem ordens próprias)
    if (!usuarioLogado.ordens) {
        usuarioLogado.ordens = [];
    }
    ordens = usuarioLogado.ordens;
    
    // Inicializar book de ofertas
    const bookData = [
        { ativo: 'PETR4', preco: 28.50 },
        { ativo: 'VALE3', preco: 67.80 },
        { ativo: 'ITUB4', preco: 32.15 },
        { ativo: 'BBDC4', preco: 15.90 },
        { ativo: 'ABEV3', preco: 12.45 }
    ];
    
    const bookBody = document.querySelector('#book tbody');
    bookBody.innerHTML = '';
    
    bookData.forEach(item => {
        const row = bookBody.insertRow();
        row.insertCell(0).textContent = item.ativo;
        row.insertCell(1).textContent = item.preco.toFixed(2);
    });
    
    // Atualizar carteira
    atualizarCarteira();
    
    // Atualizar extrato
    atualizarExtrato();
    
    // Atualizar ordens
    atualizarOrdens();
}

// Função para atualizar carteira
function atualizarCarteira() {
    const carteiraBody = document.querySelector('#carteira tbody');
    carteiraBody.innerHTML = '';
    
    for (const [ativo, quantidade] of Object.entries(carteira)) {
        // Só mostrar ativos com quantidade maior que zero
        if (quantidade > 0) {
            const row = carteiraBody.insertRow();
            row.insertCell(0).textContent = ativo;
            row.insertCell(1).textContent = quantidade;
        }
    }
}

// Função para atualizar extrato
function atualizarExtrato() {
    const extratoBody = document.querySelector('#extrato tbody');
    extratoBody.innerHTML = '';
    
    extrato.forEach(operacao => {
        const row = extratoBody.insertRow();
        row.insertCell(0).textContent = operacao.tipo;
        row.insertCell(1).textContent = operacao.ativo;
        row.insertCell(2).textContent = operacao.quantidade;
        row.insertCell(3).textContent = operacao.valorTotal.toFixed(2);
    });
}

// Função para atualizar ordens
function atualizarOrdens() {
    const ordensBody = document.querySelector('#ordens tbody');
    ordensBody.innerHTML = '';
    
    ordens.forEach((ordem, index) => {
        const row = ordensBody.insertRow();
        row.insertCell(0).textContent = ordem.tipo;
        row.insertCell(1).textContent = ordem.ativo;
        row.insertCell(2).textContent = ordem.quantidade;
        row.insertCell(3).textContent = ordem.valor.toFixed(2);
        row.insertCell(4).textContent = ordem.cotacao.toFixed(2);
        row.insertCell(5).textContent = ordem.status;
        
        const acaoCell = row.insertCell(6);
        if (ordem.status === 'Pendente') {
            const btnCancelar = document.createElement('button');
            btnCancelar.textContent = 'Cancelar';
            btnCancelar.className = 'btn-cancelar';
            btnCancelar.onclick = () => cancelarOrdem(index);
            acaoCell.appendChild(btnCancelar);
        }
    });
}

// Função para executar operação
function executarOperacao() {
    const tipo = document.getElementById('tipo').value;
    const ativo = document.getElementById('ativo').value;
    const quantidade = parseInt(document.getElementById('quantidade').value);
    const valor = parseFloat(document.getElementById('valor').value);
    const msgElement = document.getElementById('mensagem');

    if (!ativo || !quantidade || !valor) {
        msgElement.textContent = 'Preencha todos os campos!';
        return;
    }

    if (quantidade % 100 !== 0) {
        msgElement.textContent = 'Quantidade deve ser múltipla de 100!';
        return;
    }

    if (quantidade <= 0 || valor <= 0) {
        msgElement.textContent = 'Quantidade e valor devem ser maiores que zero!';
        return;
    }

    const valorTotal = quantidade * valor;
    
    // Validações específicas por tipo de operação
    if (tipo === 'Compra') {
        if (valorTotal > usuarioLogado.saldo) {
            msgElement.textContent = 'Saldo insuficiente!';
            return;
        }
    } else if (tipo === 'Venda') {
        const quantidadeDisponivel = carteira[ativo] || 0;
        if (quantidade > quantidadeDisponivel) {
            msgElement.textContent = `Quantidade insuficiente! Você possui apenas ${quantidadeDisponivel} ações de ${ativo}`;
            return;
        }
    }

    // Criar ordem
    const ordem = {
        tipo: tipo,
        ativo: ativo,
        quantidade: quantidade,
        valor: valor,
        cotacao: valor,
        status: 'Pendente'
    };
    
    ordens.push(ordem);
    usuarioLogado.ordens = ordens; // Atualizar ordens do usuário
    atualizarOrdens(); // Atualizar interface imediatamente
    
    // Simular execução
    setTimeout(() => {
        ordem.status = 'Executada';
        
        if (tipo === 'Compra') {
            usuarioLogado.saldo -= valorTotal;
            carteira[ativo] = (carteira[ativo] || 0) + quantidade;
        } else {
            usuarioLogado.saldo += valorTotal;
            carteira[ativo] = (carteira[ativo] || 0) - quantidade;
            
            // Remover ativo da carteira se quantidade chegar a zero
            if (carteira[ativo] <= 0) {
                delete carteira[ativo];
            }
        }
        
        // Atualizar carteira do usuário
        usuarioLogado.carteira = carteira;
        
        // Adicionar ao extrato
        extrato.push({
            tipo: tipo,
            ativo: ativo,
            quantidade: quantidade,
            valorTotal: valorTotal
        });
        
        // Atualizar extrato do usuário
        usuarioLogado.extrato = extrato;
        
        // Atualizar ordens do usuário
        usuarioLogado.ordens = ordens;
        
        // Atualizar interface
        document.getElementById('saldo').textContent = usuarioLogado.saldo.toFixed(2);
        atualizarCarteira();
        atualizarExtrato();
        atualizarOrdens();
        
        msgElement.textContent = 'Ordem executada com sucesso!';
        setTimeout(() => msgElement.textContent = '', 3000);
        
    }, 2000);
    
    msgElement.textContent = 'Ordem enviada! Aguardando execução...';
    setTimeout(() => msgElement.textContent = '', 3000);
}

// Função para cancelar ordem
function cancelarOrdem(index) {
    ordens.splice(index, 1);
    usuarioLogado.ordens = ordens; // Atualizar ordens do usuário
    atualizarOrdens();
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar opções de ativos
    const ativoSelect = document.getElementById('ativo');
    const ativos = ['PETR4', 'VALE3', 'ITUB4', 'BBDC4', 'ABEV3'];
    
    ativos.forEach(ativo => {
        const option = document.createElement('option');
        option.value = ativo;
        option.textContent = ativo;
        ativoSelect.appendChild(option);
    });
    
    // Adicionar eventos de validação para campos de cadastro
    const cadastroFields = [
        { id: 'cadNome', tipo: 'nome' },
        { id: 'cadCpf', tipo: 'cpf' },
        { id: 'cadEmail', tipo: 'email' },
        { id: 'cadCel', tipo: 'telefone' },
        { id: 'cadSenha', tipo: 'senha' },
        { id: 'cadSenha2', tipo: 'senha2' }
    ];
    
    cadastroFields.forEach(field => {
        const elemento = document.getElementById(field.id);
        if (elemento) {
            // Validar quando usuário sai do campo (blur)
            elemento.addEventListener('blur', function() {
                if (this.value.trim()) {
                    validarCampo(this, field.tipo);
                }
            });
            
            // Validar quando usuário digita (input) - apenas para senha2
            if (field.tipo === 'senha2') {
                elemento.addEventListener('input', function() {
                    if (this.value.trim()) {
                        validarCampo(this, field.tipo);
                    }
                });
            }
            
            // Validar senha em tempo real para barra de força
            if (field.tipo === 'senha') {
                elemento.addEventListener('input', function() {
                    const strengthBar = document.getElementById('senhaStrengthBar');
                    const strength = validarForcaSenha(this.value);
                    strengthBar.className = `strength-bar ${strength}`;
                    verificarFormularioCompleto();
                });
            }
        }
    });
    
    // Adicionar eventos para campos de login
    const cpfLogin = document.getElementById('cpf');
    const senhaLogin = document.getElementById('senha');
    
    if (cpfLogin && senhaLogin) {
        // Validar login quando ambos os campos tiverem conteúdo
        [cpfLogin, senhaLogin].forEach(campo => {
            campo.addEventListener('input', function() {
                const msgElement = document.getElementById('loginMsg');
                if (cpfLogin.value.trim() && senhaLogin.value.trim()) {
                    validarLogin();
  } else {
                    msgElement.textContent = '';
                }
            });
        });
    }
    
    // Adicionar eventos para recuperação de senha
    const recCpf = document.getElementById('recCpf');
    const recEmail = document.getElementById('recEmail');
    
    if (recCpf && recEmail) {
        [recCpf, recEmail].forEach(campo => {
            campo.addEventListener('blur', function() {
                if (recCpf.value.trim() && recEmail.value.trim()) {
                    validarRecuperacaoSenha();
                }
            });
        });
    }
    
    // Carregar tema salvo
    loadTheme();
});