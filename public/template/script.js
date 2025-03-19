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




    // Função para criar fornecedor
    function criarFornecedor() {
        const nome = document.getElementById('nomeFornecedor').value;
        const id = document.getElementById('idFornecedor').value;
        const especificacao = document.getElementById('especificacaoFornecedor').value;

        if (!nome || !id || !especificacao) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        const fornecedor = {
            id: id,
            nome: nome,
            especificacao: especificacao,
            informacoes: [],
            checkboxes: []
        };

        // Armazenar fornecedor no localStorage
        localStorage.setItem(id, JSON.stringify(fornecedor));
        atualizarListaFornecedores();
        limparCampos();
    }

    // Função para atualizar a lista de fornecedores
    function atualizarListaFornecedores() {
        const fornecedoresList = document.getElementById('fornecedoresList');
        fornecedoresList.innerHTML = '';

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const fornecedor = JSON.parse(localStorage.getItem(key));

            const div = document.createElement('div');
            div.innerHTML = `
                <strong>${fornecedor.nome}</strong> (ID: ${fornecedor.id})
                <button onclick="abrirModal('${fornecedor.id}')">Ver Detalhes</button>
                <button onclick="excluirFornecedor('${fornecedor.id}')">Excluir Fornecedor</button>
            `;
            fornecedoresList.appendChild(div);
        }
    }

    // Função para abrir o modal
    function abrirModal(id) {
        const fornecedor = JSON.parse(localStorage.getItem(id));
        document.getElementById('modal-conteudo').innerHTML = `
            <p><strong>Nome:</strong> ${fornecedor.nome}</p>
            <p><strong>ID:</strong> ${fornecedor.id}</p>
            <p><strong>Especificação:</strong> ${fornecedor.especificacao}</p>
            <h3>Informações:</h3>
            <ul id="informacoes-list"></ul>
        `;
        fornecedor.informacoes.forEach((info, index) => {
            const li = document.createElement('li');
            li.textContent = info;
            li.innerHTML += ` <button onclick="editarInformacao('${id}', ${index})">Editar</button>
                             <button onclick="excluirInformacao('${id}', ${index})">Excluir</button>`;
            document.getElementById('informacoes-list').appendChild(li);
        });

        // Limpar checkboxes
        const checkboxContainer = document.getElementById('checkbox-container');
        checkboxContainer.innerHTML = '';
        fornecedor.checkboxes.forEach((checkbox, index) => {
            const div = document.createElement('div');
            div.innerHTML = `
                <input type="checkbox" checked> ${checkbox}
                <button onclick="editarCheckbox('${id}', ${index})">Editar</button>
                <button onclick="excluirCheckbox('${id}', ${index})">Excluir</button>
            `;
            checkboxContainer.appendChild(div);
        });

        // Armazenar o ID do fornecedor no modal
        document.getElementById('modal').setAttribute('data-id', id);
        document.getElementById('modal').style.display = 'block';
    }

    // Função para fechar o modal
    function fecharModal() {
        document.getElementById('modal').style.display = 'none';
    }

    // Função para adicionar informação
    function adicionarInformacao() {
        const id = document.getElementById('modal').getAttribute('data-id');
        const novaInformacao = document.getElementById('novaInformacao').value;

        if (!novaInformacao) {
            alert("Por favor, escreva uma informação.");
            return;
        }

        const fornecedor = JSON.parse(localStorage.getItem(id));
        // Remover informação antiga se existir
        const index = fornecedor.informacoes.indexOf(novaInformacao);
        if (index > -1) {
            fornecedor.informacoes.splice(index, 1);
        }
        fornecedor.informacoes.push(novaInformacao);
        localStorage.setItem(id, JSON.stringify(fornecedor));
        atualizarListaFornecedores();
        fecharModal();
    }

    // Função para editar informação
    function editarInformacao(id, index) {
        const fornecedor = JSON.parse(localStorage.getItem(id));
        const novaInformacao = prompt("Digite a nova informação:", fornecedor.informacoes[index]);

        if (novaInformacao) {
            fornecedor.informacoes[index] = novaInformacao;
            localStorage.setItem(id, JSON.stringify(fornecedor));
            atualizarListaFornecedores();
            abrirModal(id); // Reabre o modal para mostrar a lista atualizada
        }
    }

    // Função para excluir informação
    function excluirInformacao(id, index) {
        const fornecedor = JSON.parse(localStorage.getItem(id));
        fornecedor.informacoes.splice(index, 1); // Remove a informação pelo índice
        localStorage.setItem(id, JSON.stringify(fornecedor));
        atualizarListaFornecedores();
        abrirModal(id); // Reabre o modal para mostrar a lista atualizada
    }

    // Função para excluir fornecedor
    function excluirFornecedor(id) {
        if (confirm("Tem certeza que deseja excluir este fornecedor?")) {
            localStorage.removeItem(id); // Remove o fornecedor do localStorage
            atualizarListaFornecedores(); // Atualiza a lista de fornecedores
        }
    }

    // Função para adicionar checkbox
    function adicionarCheckbox() {
        const id = document.getElementById('modal').getAttribute('data-id');
        const fornecedor = JSON.parse(localStorage.getItem(id));
        const novoCheckbox = prompt("Digite a informação do checkbox:");

        if (novoCheckbox) {
            fornecedor.checkboxes.push(novoCheckbox);
            localStorage.setItem(id, JSON.stringify(fornecedor));
            atualizarListaFornecedores();
            abrirModal(id); // Reabre o modal para mostrar a nova informação
        }
    }

    // Função para editar checkbox
    function editarCheckbox(id, index) {
        const fornecedor = JSON.parse(localStorage.getItem(id));
        const novoCheckbox = prompt("Digite a nova informação do checkbox:", fornecedor.checkboxes[index]);

        if (novoCheckbox) {
            fornecedor.checkboxes[index] = novoCheckbox;
            localStorage.setItem(id, JSON.stringify(fornecedor));
            atualizarListaFornecedores();
            abrirModal(id); // Reabre o modal para mostrar a lista atualizada
        }
    }

    // Função para excluir checkbox
    function excluirCheckbox(id, index) {
        const fornecedor = JSON.parse(localStorage.getItem(id));
        fornecedor.checkboxes.splice(index, 1); // Remove o checkbox pelo índice
        localStorage.setItem(id, JSON.stringify(fornecedor));
        atualizarListaFornecedores();
        abrirModal(id); // Reabre o modal para mostrar a lista atualizada
    }

    // Função para limpar campos do formulário
    function limparCampos() {
        document.getElementById('nomeFornecedor').value = '';
        document.getElementById('idFornecedor').value = '';
        document.getElementById('especificacaoFornecedor').value = '';
    }

    // Inicializa a lista de fornecedores ao carregar a página
    window.onload = function() {
        atualizarListaFornecedores();
    };
