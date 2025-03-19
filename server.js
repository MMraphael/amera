const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Rota para criar um fornecedor
app.post('/criar-fornecedor', (req, res) => {
    const { nomeFornecedor } = req.body;

    // Verifica se o nome do fornecedor foi fornecido
    if (!nomeFornecedor) {
        console.error('Nome do fornecedor não fornecido.');
        return res.status(400).send('Nome do fornecedor é obrigatório.');
    }

    const dirPath = path.join(__dirname, 'public', 'htmlForne');
    const filePath = path.join(dirPath, `${nomeFornecedor}.html`);
    const templatePath = path.join(__dirname, 'public', 'template', 'index.html'); // Caminho do template

    console.log(`Tentando criar o arquivo em: ${filePath}`);

    // Verifica se o diretório existe, se não, cria
    if (!fs.existsSync(dirPath)) {
        console.log(`Diretório ${dirPath} não existe. Criando...`);
        fs.mkdirSync(dirPath, { recursive: true });
    }

    // Lê o arquivo template
    fs.readFile(templatePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo template:', err);
            return res.status(500).send('Erro ao criar o fornecedor.');
        }

        // Substitui o placeholder no template pelo nome do fornecedor
        const newContent = data.replace(/\${nomeFornecedor}/g, nomeFornecedor);

        // Escreve o novo arquivo HTML
        fs.writeFile(filePath, newContent, (err) => {
            if (err) {
                console.error('Erro ao criar o arquivo:', err);
                return res.status(500).send('Erro ao criar o arquivo do fornecedor.');
            }
            console.log(`Fornecedor "${nomeFornecedor}" criado com sucesso!`);
            res.send(`Fornecedor "${nomeFornecedor}" criado com sucesso!`);
        });
    });
});

// Rota para excluir um fornecedor
app.delete('/excluir-fornecedor/:nomeFornecedor', (req, res) => {
    const nomeFornecedor = req.params.nomeFornecedor;
    const filePath = path.join(__dirname, 'public', 'htmlForne', `${nomeFornecedor}.html`);

    fs.unlink(filePath, (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).send(`Fornecedor "${nomeFornecedor}" não encontrado.`);
            }
            return res.status(500).send('Erro ao excluir o arquivo do fornecedor.');
        }
        res.send(`Fornecedor "${nomeFornecedor}" excluído com sucesso!`);
    });
});

// Rota para criar um cliente
app.post('/criar-cliente', (req, res) => {
    const { nomeCliente } = req.body; // Altera para nomeCliente

    // Verifica se o nome do cliente foi fornecido
    if (!nomeCliente) {
        console.error('Nome do cliente não fornecido.');
        return res.status(400).send('Nome do cliente é obrigatório.');
    }

    const dirPath = path.join(__dirname, 'public', 'htmlCliente'); // Altera para htmlCliente
    const filePath = path.join(dirPath, `${nomeCliente}.html`); // Altera para nomeCliente
    const templatePath = path.join(__dirname, 'public', 'template', 'index.html'); // Caminho do template

    console.log(`Tentando criar o arquivo em: ${filePath}`);

    // Verifica se o diretório existe, se não, cria
    if (!fs.existsSync(dirPath)) {
        console.log(`Diretório ${dirPath} não existe. Criando...`);
        fs.mkdirSync(dirPath, { recursive: true });
    }

    // Lê o arquivo template
    fs.readFile(templatePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo template:', err);
            return res.status(500).send('Erro ao criar o cliente.');
        }

        // Substitui o placeholder no template pelo nome do cliente
        const newContent = data.replace(/\${nomeFornecedor}/g, nomeCliente); // Altera para nomeCliente

        // Escreve o novo arquivo HTML
        fs.writeFile(filePath, newContent, (err) => {
            if (err) {
                console.error('Erro ao criar o arquivo:', err);
                return res.status(500).send('Erro ao criar o arquivo do cliente.');
            }
            console.log(`Cliente "${nomeCliente}" criado com sucesso!`);
            res.send(`Cliente "${nomeCliente}" criado com sucesso!`);
        });
    });
});

// Rota para excluir um cliente
app.delete('/excluir-cliente/:nomeCliente', (req, res) => {
    const nomeCliente = req.params.nomeCliente; // Renomeado para nomeCliente
    const filePath = path.join(__dirname, 'public', 'htmlCliente', `${nomeCliente}.html`); // Renomeado para htmlCliente

    fs.unlink(filePath, (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).send(`Cliente "${nomeCliente}" não encontrado.`);
            }
            return res.status(500).send('Erro ao excluir o arquivo do cliente.');
        }
        res.send(`Cliente "${nomeCliente}" excluído com sucesso!`);
    });
});

// Usuários cadastrados
const users = [
    { id: 1, name: 'adm' }
];

// Rota da página de login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota de autenticação
app.post('/login', (req, res) => {
    const { id, name } = req.body;
    console.log(`Tentativa de login: ID=${id}, Nome=${name}`); // Log para depuração

    const user = users.find(user => user.id === parseInt(id) && user.name === name);
    if (user) {
        req.session.loggedin = true;
        req.session.userId = user.id;
        req.session.userName = user.name;
        console.log(`Usuário ${name} autenticado com sucesso!`); // Log para depuração
        return res.redirect('/dashboard/dashboard.html');
    }
    console.log(`Falha na autenticação para ID=${id}, Nome=${name}`); // Log para depuração
    res.status(401).send('ID ou nome inválidos');
});

// Rota do dashboard
app.get('/dashboard/dashboard.html', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
    } else {
        res.redirect('/');
    }
});

// Rota do perfil
app.get('/profile', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname, 'public', 'profile.html'));
    } else {
        res.redirect('/');
    }
});

// Rota para obter dados do usuário
app.get('/api/user', (req, res) => {
    if (req.session.loggedin) {
        res.json({ id: req.session.userId, name: req.session.userName });
    } else {
        res.status(401).json({ message: 'Usuário não autenticado' });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});