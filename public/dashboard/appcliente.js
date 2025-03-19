// Seleciona os elementos do DOM
const toggleButton = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');
const clientesList = document.getElementById('clientesList'); // Renomeado para clientesList
const userIdElement = document.getElementById('user-id');
const userNameElement = document.getElementById('user-name');
const criarClienteBtn = document.getElementById('criar-cliente'); // Alterado para criar-cliente
const logsCliente = document.getElementById('log-cliente'); // Alterado para log-cliente
const limparLogsBtn = document.getElementById('limparLogsBtn');

// Função para alternar a visibilidade da sidebar
function toggleSidebar() {
    sidebar.classList.toggle('close');
    toggleButton.classList.toggle('rotate');
    closeAllSubMenus();
}

// Função para alternar submenus
function toggleSubMenu(button) {
    if (!button.nextElementSibling.classList.contains('show')) {
        closeAllSubMenus();
    }
    button.nextElementSibling.classList.toggle('show');
    button.classList.toggle('rotate');
    if (sidebar.classList.contains('close')) {
        sidebar.classList.toggle('close');
        toggleButton.classList.toggle('rotate');
    }
}

// Função para fechar todos os submenus
function closeAllSubMenus() {
    Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
        ul.classList.remove('show');
        ul.previousElementSibling.classList.remove('rotate');
    });
}

// Função para limpar os logs do localStorage
function limparLogs() {
    localStorage.removeItem('actionLogs');
    if (logsCliente) {
        logsCliente.innerHTML = '';
    }
    console.log('Logs limpos com sucesso.');
}

// Adiciona o evento de clique ao botão de criar cliente
if (criarClienteBtn) {
    criarClienteBtn.addEventListener('click', criarCliente); // Alterado para criarCliente
}

// Função para obter os dados do usuário da sessão
function obterDadosUsuario() {
    fetch('/api/user')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao obter dados do usuário');
            }
            return response.json();
        })
        .then(data => {
            userIdElement.textContent = data.id;
            userNameElement.textContent = data.name;
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

// Função para criar um cliente
function criarCliente() { // Alterado para criarCliente
    const nomeCliente = document.getElementById('nomeCliente').value.trim(); // Alterado para nomeCliente
    const userName = localStorage.getItem('userName') || 'Usuário Desconhecido'; // Obtém o nome do usuário

    if (!nomeCliente) {
        alert('Por favor, insira o nome do cliente.'); // Alterado para cliente
        return;
    }

    fetch('/criar-cliente', { // Alterado para /criar-cliente
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nomeCliente }), // Alterado para nomeCliente
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao criar cliente'); // Alterado para cliente
        }
        return response.text();
    })
    .then(data => {
        alert(data);
        document.getElementById('nomeCliente').value = ''; // Limpa o campo de entrada
        adicionarClienteNaLista(nomeCliente); // Alterado para adicionarClienteNaLista
        salvarClienteNoLocalStorage(nomeCliente); // Alterado para salvarClienteNoLocalStorage
        const userName = userNameElement ? userNameElement.textContent : 'Usuário Desconhecido';
        logAction(userName, 'criou', nomeCliente);
        displayLogs();
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao criar cliente: ' + error.message); // Alterado para cliente
    });
}

// Função para adicionar o cliente à lista no HTML
function adicionarClienteNaLista(nomeCliente) { // Alterado para adicionarClienteNaLista
    if (!clientesList) { // Alterado para clientesList
        console.error('Elemento com ID "clientesList" não encontrado.'); // Alterado para clientesList
        return;
    }

    const clienteItem = document.createElement('p'); // Alterado para clienteItem
    clienteItem.innerHTML = `${nomeCliente} 
        <button class="btn-ver" onclick="irCliente('${nomeCliente}')">Ver</button>
        <button class="btn-excluir" onclick="excluirCliente('${nomeCliente}')">Excluir</button>`;
    
    const hr = document.createElement('hr');
    clientesList.appendChild(clienteItem); // Adiciona o item do cliente à lista
    clientesList.appendChild(hr); // Adiciona uma linha horizontal após o item
}

// Função para redirecionar para a página do cliente
function irCliente(nomeCliente) { // Alterado para irCliente
    const url = `../htmlCliente/${nomeCliente}.html`; // Alterado para htmlCliente
    window.location.href = url;
}

// Função para excluir cliente
function excluirCliente(nomeCliente) { // Alterado para excluirCliente
    const confirmacao = confirm(`Tem certeza que deseja excluir o cliente "${nomeCliente}"?`); // Alterado para cliente
    if (confirmacao) {
        fetch(`/excluir-cliente/${nomeCliente}`, { // Alterado para /excluir-cliente
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao excluir cliente'); // Alterado para cliente
            }
            return response.text();
        })
        .then(data => {
            alert(data);
            removerClienteDaLista(nomeCliente); // Alterado para removerClienteDaLista
            removerClienteDoLocalStorage(nomeCliente); // Alterado para removerClienteDoLocalStorage
            const userName = userNameElement ? userNameElement.textContent : 'Usuário Desconhecido';
            logAction(userName, 'apagou', nomeCliente); // Alterado para cliente
            displayLogs(); // Atualiza a exibição dos logs
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao excluir cliente: ' + error.message); // Alterado para cliente
        });
    }
}

// Função para remover o cliente da lista no HTML
function removerClienteDaLista(nomeCliente) { // Alterado para removerClienteDaLista
    const clienteItems = clientesList.getElementsByTagName('p'); // Alterado para clientesList
    for (let i = 0; i < clienteItems.length; i++) {
        if (clienteItems[i].innerText.includes(nomeCliente)) {
            if (clienteItems[i].nextSibling && clienteItems[i].nextSibling.tagName === 'HR') {
                clientesList.removeChild(clienteItems[i].nextSibling); // Alterado para clientesList
            }
            clientesList.removeChild(clienteItems[i]); // Alterado para clientesList
            break;
        }
    }
}

// Função para remover o cliente do localStorage
function removerClienteDoLocalStorage(nomeCliente) { // Alterado para removerClienteDoLocalStorage
    let clientes = JSON.parse(localStorage.getItem('clientes')) || []; // Alterado para clientes
    clientes = clientes.filter(cliente => cliente !== nomeCliente); // Alterado para cliente
    localStorage.setItem('clientes', JSON.stringify(clientes)); // Alterado para clientes
}

// Função para carregar clientes do localStorage ao carregar a página
window.onload = function() {
    const clientes = JSON.parse(localStorage.getItem('clientes')) || []; // Alterado para clientes
    clientes.forEach(nomeCliente => {
        adicionarClienteNaLista(nomeCliente); // Alterado para adicionarClienteNaLista
    });
    obterDadosUsuario(); // Chama a função para obter dados do usuário
    displayLogs(); // Exibe logs
};

// Função para salvar o cliente no localStorage
function salvarClienteNoLocalStorage(nomeCliente) { // Alterado para salvarClienteNoLocalStorage
    let clientes = JSON.parse(localStorage.getItem('clientes')) || []; // Alterado para clientes
    if (!clientes.includes(nomeCliente)) {
        clientes.push(nomeCliente); // Alterado para cliente
        localStorage.setItem('clientes', JSON.stringify(clientes)); // Alterado para clientes
    }
}

// Função para registrar ações no localStorage
function logAction(usuario, action, nomeCliente) { // Alterado para cliente
    const logs = JSON.parse(localStorage.getItem('actionLogs')) || [];
    
    // Obtém a data e hora atual
    const now = new Date();
    const dia = String(now.getDate()).padStart(2, '0');
    const mes = String(now.getMonth() + 1).padStart(2, '0');
        const ano = now.getFullYear();
    const horas = String(now.getHours()).padStart(2, '0');
    const minutos = String(now.getMinutes()).padStart(2, '0');

    // Formata a data e hora
    const dataFormatada = `${dia}-${mes}-${ano} (${horas}:${minutos})`;

    // Adiciona o log formatado
    logs.push({ 
        action: `${dataFormatada} Nome: ${usuario} ${action} o cliente: ${nomeCliente}`, // Alterado para cliente
        timestamp: now.toISOString() 
    });
    localStorage.setItem('actionLogs', JSON.stringify(logs));
}

// Função para exibir logs
function displayLogs() {
    const logs = JSON.parse(localStorage.getItem('actionLogs')) || [];
    if (logsCliente) { // Alterado para log-cliente
        logsCliente.innerHTML = ''; // Limpa a lista antes de exibir os logs
        logs.forEach(log => {
            const listItem = document.createElement('li');
            listItem.textContent = log.action; // Exibe a ação formatada
            logsCliente.appendChild(listItem); // Adiciona ao novo elemento
        });
    } else {
        console.error('Elemento com ID "log-cliente" não encontrado.'); // Mensagem de erro
    }
}

// Adiciona o evento de clique ao botão de limpar logs
if (limparLogsBtn) {
    limparLogsBtn.addEventListener('click', limparLogs);
}

// Função para limpar os logs do localStorage
function limparLogs() {
    localStorage.removeItem('actionLogs'); // Remove a chave 'actionLogs' do localStorage
    if (logsCliente) {
        logsCliente.innerHTML = ''; // Limpa a lista de logs exibida na interface
    }
    console.log('Logs limpos com sucesso.');
}

// Chama a função para obter dados do usuário ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    obterDadosUsuario(); // Chama a função para obter dados do usuário
    displayLogs(); // Exibe logs
});