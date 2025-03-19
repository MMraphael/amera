
// Rolagem de entrar para o login
document.getElementById("scrollBtn").addEventListener("click", function() {
  document.getElementById("login-box").scrollIntoView({ behavior: 'smooth' }); // Corrigido para 'loginForm'
});

// Egg
document.querySelector('.egg').addEventListener("click", function() { // Corrigido para '.egg'
  alert('Não era para isso estar aqui... Made with </code> and coffee');
});

//IR PARA DASHBOARD
function irDash() {
  window.location.href = 'dashboard/dashboard.html';
}

//IR SAIBA MAIS
function irSaber() {
  window.location.href = "about/about.html";
}


//ANIMAÇÃO FADEIN
document.addEventListener('DOMContentLoaded', function() {
  const element = document.querySelector('.logo', 'sub', 'btn', 'navigator');
  element.classList.add('fadein');
})


// LOGIN 

document.getElementById('loginButton').addEventListener('click', async () => {
  const id = parseInt(document.getElementById('userId').value);
  const name = document.getElementById('userName').value;

  const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, name })
  });

  const result = await response.json();
  const messageDiv = document.getElementById('message');

  if (response.ok) {
      // Redireciona para o dashboard.html
      window.location.href = 'dashboard/dashboard.html';
  } else {
      messageDiv.textContent = result.message;
      messageDiv.style.color = 'red';
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const myLink = document.getElementById('toggle-btn');
  if (myLink) {
      myLink.addEventListener('click', () => {
          console.log('Botão clicado');
      });
  }
});
