const usuario = localStorage.getItem('usuario');

if (!usuario) {
  window.location.href = 'login.html';
}

document.getElementById('usuarioLogado').innerText = usuario;

function logout() {
  localStorage.clear();
  window.location.href = 'login.html';
}

function abrirTela(tela) {
  const conteudo = document.getElementById('conteudo');

  if (tela === 'caixa') {
    conteudo.innerHTML = '<h2>Caixa</h2><p>Abrir / Fechar caixa</p>';
  }

  if (tela === 'vendas') {
    conteudo.innerHTML = '<h2>Vendas</h2><p>Registrar vendas</p>';
  }

  if (tela === 'combustiveis') {
    conteudo.innerHTML = '<h2>Combustíveis</h2><p>Gerenciar combustíveis</p>';
  }
}
