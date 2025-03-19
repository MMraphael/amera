const toggleButton = document.getElementById('toggle-btn')
const sidebar = document.getElementById('sidebar')

function toggleSidebar(){
  sidebar.classList.toggle('close')
  toggleButton.classList.toggle('rotate')

  closeAllSubMenus()
}

function toggleSubMenu(button){

  if(!button.nextElementSibling.classList.contains('show')){
    closeAllSubMenus()
  }

  button.nextElementSibling.classList.toggle('show')
  button.classList.toggle('rotate')

  if(sidebar.classList.contains('close')){
    sidebar.classList.toggle('close')
    toggleButton.classList.toggle('rotate')
  }
}

function closeAllSubMenus(){
  Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
    ul.classList.remove('show')
    ul.previousElementSibling.classList.remove('rotate')
  })
}


const fornecedoresList = document.getElementById('fornecedoresList');
const userIdElement = document.getElementById('user-id');
const userNameElement = document.getElementById('user-name');
const criarFornecedorBtn = document.getElementById('criarFornecedorBtn');
const logsList = document.getElementById('logs-list');
const limparLogsBtn = document.getElementById('limparLogsBtn');

// Função para limpar os logs do localStorage
function limparLogs() {
    localStorage.removeItem('actionLogs');
    if (logsList) {
        logsList.innerHTML = '';
    }
    console.log('Logs limpos com sucesso.');
}

// Adiciona o evento de clique ao botão de criar fornecedor
if (criarFornecedorBtn) {
    criarFornecedorBtn.addEventListener('click', criarForne);
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

// Função para criar um fornecedor
function criarForne() {
    const nomeFornecedor = document.getElementById('nomeFornecedor').value.trim();
    const userName = localStorage.getItem('userName') || 'Usuário Desconhecido'; // Obtém o nome do usuário

    if (!nomeFornecedor) {
        alert('Por favor, insira o nome do fornecedor.');
        return;
    }

    fetch('/criar-fornecedor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nomeFornecedor }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao criar fornecedor');
        }
        return response.text();
    })
    .then(data => {
        alert(data);
        document.getElementById('nomeFornecedor').value = ''; // Limpa o campo de entrada
        adicionarFornecedorNaLista(nomeFornecedor); // Adiciona o fornecedor à lista
        salvarFornecedorNoLocalStorage(nomeFornecedor); // Salva o fornecedor no localStorage
        const userName = userNameElement ? userNameElement.textContent : 'Usuário Desconhecido';
        logAction(userName, 'criou', nomeFornecedor);
        displayLogs();
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao criar fornecedor: ' + error.message);
    });
}

// Função para adicionar o fornecedor à lista no HTML
function adicionarFornecedorNaLista(nomeFornecedor) {
    if (!fornecedoresList) {
        console.error('Elemento com ID "fornecedoresList" não encontrado.');
        return;
    }

    const fornecedorItem = document.createElement('p');
    fornecedorItem.innerHTML = `${nomeFornecedor} 
        <button class="btn-ver" onclick="irEmpresa('${nomeFornecedor}')">Ver</button>
        <button class="btn-excluir" onclick="excluirFornecedor('${nomeFornecedor}')">Excluir</button>`;
    
    const hr = document.createElement('hr');
    fornecedoresList.appendChild(fornecedorItem);
    fornecedoresList.appendChild(hr);
}

// Função para redirecionar para a página do fornecedor
function irEmpresa(nomeFornecedor) {
    const url = `../htmlForne/${nomeFornecedor}.html`;
    window.location.href = url;
}

// Função para excluir fornecedor
function excluirFornecedor(nomeFornecedor) {
    const confirmacao = confirm(`Tem certeza que deseja excluir o fornecedor "${nomeFornecedor}"?`);
    if (confirmacao) {
        fetch(`/excluir-fornecedor/${nomeFornecedor}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao excluir fornecedor');
            }
            return response.text();
        })
        .then(data => {
            alert(data);
            removerFornecedorDaLista(nomeFornecedor);
            removerFornecedorDoLocalStorage(nomeFornecedor);
            const userName = userNameElement ? userNameElement.textContent : 'Usuário Desconhecido';
            logAction(userName, 'apagou', nomeFornecedor);
            displayLogs();
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao excluir fornecedor: ' + error.message);
        });
    }
}

// Função para remover o fornecedor da lista no HTML
function removerFornecedorDaLista(nomeFornecedor) {
    const fornecedorItems = fornecedoresList.getElementsByTagName('p');
    for (let i = 0; i < fornecedorItems.length; i++) {
        if (fornecedorItems[i].innerText.includes(nomeFornecedor)) {
            if (fornecedorItems[i].nextSibling && fornecedorItems[i].nextSibling.tagName === 'HR') {
                fornecedoresList.removeChild(fornecedorItems[i].nextSibling);
            }
            fornecedoresList.removeChild(fornecedorItems[i]);
            break;
        }
    }
}

// Função para remover o fornecedor do localStorage
function removerFornecedorDoLocalStorage(nomeFornecedor) {
    let fornecedores = JSON.parse(localStorage.getItem('fornecedores')) || [];
    fornecedores = fornecedores.filter(fornecedor => fornecedor !== nomeFornecedor);
    localStorage.setItem('fornecedores', JSON.stringify(fornecedores));
}

// Função para carregar fornecedores do localStorage ao carregar a página
window.onload = function() {
    const fornecedores = JSON.parse(localStorage.getItem('fornecedores')) || [];
    fornecedores.forEach(nomeFornecedor => {
        adicionarFornecedorNaLista(nomeFornecedor);
    });
    obterDadosUsuario(); // Chama a função para obter dados do usuário
    displayLogs(); // Exibe logs
};

// Função para salvar o fornecedor no localStorage
function salvarFornecedorNoLocalStorage(nomeFornecedor) {
    let fornecedores = JSON.parse(localStorage.getItem('fornecedores')) || [];
    if (!fornecedores.includes(nomeFornecedor)) {
        fornecedores.push(nomeFornecedor);
        localStorage.setItem('fornecedores', JSON.stringify(fornecedores));
    }
}

// Função para registrar ações no localStorage
function logAction(usuario, action, nomeFornecedor) {
    const logs = JSON.parse(localStorage.getItem('actionLogs')) || [];
    
    // Obtém a data e hora atual
    const now = new Date();
    const dia = String(now.getDate()).padStart(2, '0');
    const mes = String(now.getMonth() + 1).padStart(2, '0'); // Meses começam em 0
    const ano = now.getFullYear();
    const horas = String(now.getHours()).padStart(2, '0');
    const minutos = String(now.getMinutes()).padStart(2, '0');

    // Formata a data e hora
    const dataFormatada = `${dia}-${mes}-${ano} (${horas}:${minutos})`;

    // Adiciona o log formatado
    logs.push({ 
        action: `${dataFormatada} Nome: ${usuario} ${action} o fornecedor: ${nomeFornecedor}`, 
        timestamp: now.toISOString() 
    });
    localStorage.setItem('actionLogs', JSON.stringify(logs));
}

// Função para exibir logs
function displayLogs() {
    const logs = JSON.parse(localStorage.getItem('actionLogs')) || [];
    if (logsList) {
        logsList.innerHTML = ''; // Limpa a lista antes de exibir os logs
        logs.forEach(log => {
            const listItem = document.createElement('li');
            listItem.textContent = log.action; // Exibe a ação formatada
            logsList.appendChild(listItem);
        });
    } else {
        console.error('Elemento com ID "logs-list" não encontrado.');
    }
}

// Adiciona o evento de clique ao botão de limpar logs
if (limparLogsBtn) {
    limparLogsBtn.addEventListener('click', limparLogs);
}

// Função para limpar os logs do localStorage
function limparLogs() {
    localStorage.removeItem('actionLogs'); // Remove a chave 'actionLogs' do localStorage
    if (logsList) {
        logsList.innerHTML = ''; // Limpa a lista de logs exibida na interface
    }
    console.log('Logs limpos com sucesso.');
}

// Chama a função para obter dados do usuário ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    obterDadosUsuario(); // Chama a função para obter dados do usuário
    displayLogs(); // Exibe logs
});

//////////// DASHBOARD

// script.js
document.addEventListener('DOMContentLoaded', () => {
    const formAtividade = document.querySelector('#form-atividade');
    const showActivitiesButton = document.getElementById('showActivitiesButton');
    const activityModal = document.getElementById('activityModal');
    const closeModal = document.querySelector('.close');
    const activityTableBody = document.querySelector('#activityTable tbody');
    let editingIndex = null; // Para armazenar o índice da atividade sendo editada

    // Load activities from localStorage
    function loadActivities() {
        const activities = JSON.parse(localStorage.getItem('activities')) || [];
        activityTableBody.innerHTML = ""; // Clear existing table

        activities.forEach((activity, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" ${activity.completed ? 'checked' : ''} data-index="${index}"></td>
                <td>${activity.subject}</td>
                <td>${activity.business}</td>
                <td>${activity.priority}</td>
                <td>${activity.contactPerson}</td>
                <td>${activity.email}</td>
                <td>${formatPhone(activity.phone)}</td>
                <td>
                    <button class="edit-button" data-index="${index}">Editar</button>
                    <button class="delete-button" data-index="${index}">Excluir</button>
                </td>
            `;
            activityTableBody.appendChild(row);
        });

        // Add event listeners to checkboxes
        const checkboxes = activityTableBody.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (event) => {
                const index = event.target.getAttribute('data-index');
                toggleActivityCompletion(index);
            });
        });

        // Add event listeners to edit and delete buttons
        const editButtons = activityTableBody.querySelectorAll('.edit-button');
        editButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                editActivity(index);
            });
        });

        const deleteButtons = activityTableBody.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const index = event.target.getAttribute('data-index');
                deleteActivity(index);
            });
        });
    }

    // Save activity to localStorage
    function saveActivity(activity) {
        const activities = JSON.parse(localStorage.getItem('activities')) || [];
        activities.push(activity);
        localStorage.setItem('activities', JSON.stringify(activities));
    }

    // Toggle activity completion
    function toggleActivityCompletion(index) {
        const activities = JSON.parse(localStorage.getItem('activities')) || [];
        activities[index].completed = !activities[index].completed; // Toggle completion status
        localStorage.setItem('activities', JSON.stringify(activities));
        loadActivities(); // Reload activities to reflect changes
    }

    // Format phone number
    function formatPhone(phone) {
        if (!phone) return '';
        const cleaned = ('' + phone).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
        return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
    }

    // Handle adding a new activity
    formAtividade.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission
        const formData = new FormData(this);
        const newActivity = {
            completed: formData.get('Concluido') === 'on', // Convert checkbox value
            subject: formData.get('Assunto'),
            business: formData.get('negocio'),
            priority: formData.get('Prioridade'),
            contactPerson: formData.get('Contato'),
            email: formData.get('Email'),
            phone: formData.get('Telefone')
        };

        if (editingIndex !== null) {
            // Edit existing activity
            const activities = JSON.parse(localStorage.getItem('activities')) || [];
            activities[editingIndex] = newActivity; // Update the activity
            localStorage.setItem('activities', JSON.stringify(activities));
            editingIndex = null; // Reset editing index
        } else {
            // Save new activity
            saveActivity(newActivity);
        }

        loadActivities(); // Reload activities after saving
        this.reset(); // Reset the form
        activityModal.style.display = 'none'; // Close the modal after saving
    });

// Edit activity
function editActivity(index) {
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    const activity = activities[index];

    // Preencher o formulário com os dados da atividade
    formAtividade.elements['Assunto'].value = activity.subject;
    formAtividade.elements['negocio'].value = activity.business;
    formAtividade.elements['Prioridade'].value = activity.priority;
    formAtividade.elements['Contato'].value = activity.contactPerson;
    formAtividade.elements['Email'].value = activity.email;
    formAtividade.elements['Telefone'].value = activity.phone;
    formAtividade.elements['Concluido'].checked = activity.completed; // Corrigido para 'Concluido'

    editingIndex = index; // Armazenar o índice da atividade sendo editada
    activityModal.style.display = 'none'; // Fechar o modal ao editar
}

    // Delete activity
    function deleteActivity(index) {
        const activities = JSON.parse(localStorage.getItem('activities')) || [];
        activities.splice(index, 1); // Remove a atividade do array
        localStorage.setItem('activities', JSON.stringify(activities));
        loadActivities(); // Reload activities after deletion
    }

    // Show activities in modal
    showActivitiesButton.addEventListener('click', () => {
        loadActivities(); // Load activities when showing the modal
        activityModal.style.display = 'block'; // Show the modal
    });

    // Close the modal
    closeModal.addEventListener('click', () => {
        activityModal.style.display = 'none';
        editingIndex = null; // Reset editing index when closing modal
        formAtividade.reset(); // Reset the form when closing the modal
    });

    // Close the modal if the user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target === activityModal) {
            activityModal.style.display = 'none';
            editingIndex = null; // Reset editing index when closing modal
            formAtividade.reset(); // Reset the form when closing the modal
        }
    });

    // Initialize the page and load activities
    loadActivities();
});