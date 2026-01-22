document.getElementById('btnLogin').addEventListener('click', async () => {
  const usuario = document.getElementById('usuario').value;
  const senha = document.getElementById('senha').value;

  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usuario, senha })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.erro);
      return;
    }

    alert('Bem-vindo ' + data.usuario.nome);

    // aqui depois você redireciona para a tela principal
    // window.location.href = 'dashboard.html';

  } catch (err) {
    alert('Erro ao conectar com o servidor');
  }
});
