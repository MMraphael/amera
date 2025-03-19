//SLIDEBAR

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


// CALENDÁRIO

const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let selectedDay = null; // Variável para armazenar o dia selecionado

    function renderCalendar() {
        const daysContainer = document.querySelector('.days');
        const monthYearElement = document.getElementById('month-year');

        // Limpa o conteúdo anterior
        daysContainer.innerHTML = '';
        monthYearElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        const startDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Adiciona elementos vazios para os dias antes do primeiro dia do mês
        for (let i = 0; i < startDay; i++) {
            const emptyElement = document.createElement('div');
            emptyElement.classList.add('empty');
            daysContainer.appendChild(emptyElement);
        }

        // Adiciona os dias do mês
        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = i;
            dayElement.onclick = function() {
                selectedDay = i; // Armazena o dia selecionado
                document.getElementById('notes-input').value = getNotesForDay(i) || ''; // Carrega anotações se existirem
            };
            daysContainer.appendChild(dayElement);

            // Renderiza anotações se existirem
            renderNotesForDay(dayElement, i);
        }
    }

    function renderNotesForDay(dayElement, day) {
        const notes = getNotesForDay(day);
        if (notes) {
            const noteCard = document.createElement('div');
            noteCard.classList.add('card');
            noteCard.innerHTML = `
                <p>${notes}</p>
                <button class="delete-btn" data-day="${day}">Excluir</button>
            `;
            dayElement.appendChild(noteCard);

            // Adiciona o event listener para o botão de excluir
            const deleteButton = noteCard.querySelector('.delete-btn');
            deleteButton.addEventListener('click', function() {
                const dayToDelete = this.getAttribute('data-day');
                deleteNote(dayToDelete);
            });
        }
    }

    function getNotesForDay(day) {
        const notes = JSON.parse(localStorage.getItem('calStorage')) || {};
        return notes[`${currentYear}-${currentMonth + 1}-${day}`]; // Formato: YYYY-MM-DD
    }

    function saveNotes() {
        const notes = document.getElementById('notes-input').value;
        if (!selectedDay) {
            alert('Por favor, selecione um dia para salvar as anotações.');
            return;
        }

        // Recupera as anotações existentes do localStorage
        const allNotes = JSON.parse(localStorage.getItem('calStorage')) || {};
        allNotes[`${currentYear}-${currentMonth + 1}-${selectedDay}`] = notes; // Formato: YYYY-MM-DD

        // Salva as anotações no localStorage
        localStorage.setItem('calStorage', JSON.stringify(allNotes));
        alert('Anotações salvas: ' + notes);

        // Renderiza o card para o dia selecionado
        renderCalendar(); // Re-renderiza o calendário para mostrar o novo card
    }

    function deleteNote(day) {
        const allNotes = JSON.parse(localStorage.getItem('calStorage')) || {};
        delete allNotes[`${currentYear}-${currentMonth + 1}-${day}`]; // Remove a nota do dia específico
        localStorage.setItem('calStorage', JSON.stringify(allNotes)); // Atualiza o localStorage
        renderCalendar(); // Re-renderiza o calendário para refletir a exclusão
    }

    function changeMonth(direction) {
        currentMonth += direction;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    }

        // Garante que o calendário seja renderizado após o carregamento do DOM
        document.addEventListener('DOMContentLoaded', function() {
          renderCalendar();
      });


      // Função para registrar ações de anotações no localStorage
function logAnotacao(usuario, action, nomeAnotacao) {
    const logs = JSON.parse(localStorage.getItem('anotacaoLogs')) || [];
    
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
        action: `${dataFormatada} Nome: ${usuario} ${action} a anotação: ${nomeAnotacao}`, 
        timestamp: now.toISOString() 
    });
    localStorage.setItem('anotacaoLogs', JSON.stringify(logs));
}

// Função para criar uma anotação
function criarAnotacao() {
    const nomeAnotacao = document.getElementById('nomeAnotacao').value.trim();
    const userName = localStorage.getItem('userName') || 'Usuário Desconhecido';

    if (!nomeAnotacao) {
        alert('Por favor, insira o nome da anotação.');
        return;
    }

    // Aqui você deve adicionar a lógica para criar a anotação no backend
    fetch('/criar-anotacao', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nomeAnotacao }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao criar anotação');
        }
        return response.text();
    })
    .then(data => {
        alert(data);
        logAnotacao(userName, 'criou', nomeAnotacao); // Log da criação da anotação
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao criar anotação: ' + error.message);
    });
}

// Função para excluir uma anotação
function excluirAnotacao(nomeAnotacao) {
    const confirmacao = confirm(`Tem certeza que deseja excluir a anotação "${nomeAnotacao}"?`);
    if (confirmacao) {
        fetch(`/excluir-anotacao/${nomeAnotacao}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao excluir anotação');
            }
            return response.text();
        })
        .then(data => {
            alert(data);
            const userName = localStorage.getItem('userName') || 'Usuário Desconhecido';
            logAnotacao(userName, 'excluiu', nomeAnotacao); // Log da exclusão da anotação
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao excluir anotação: ' + error.message);
        });
    }
}