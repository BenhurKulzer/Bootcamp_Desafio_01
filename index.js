const express = require('express');
const server = express();

// Converte o retorno para JSON
server.use(express.json());

// Dados default estruturados em JSON
let numberOfRequests = 0;
const projects = [];

// Middlewares
function checkProjectExists (req, res, next) {
    const { id } = req.params;
    const project = projects.find(p => p.id == id);

    if (!project) {
        return res.status(400).json({ error: "Projeto não encontrado" });
    }

    return next();
}

function logRequests (req, res, next) {
    numberOfRequests++;

    console.log(`Numero de Reqs: ${numberOfRequests}`);

    return next();
}

server.use(logRequests);

// Recupera os dados do JSON e lista
server.get('/projects', (req, res) => {
    return res.json(projects);
})

// Envia requisição POST ao server cadastrando dados informados no JSON
server.post('/projects', (req, res) => {
    const { id, title } = req.body;

    const project = {
        id,
        title,
        tasks: []
    };

    projects.push(project);

    return res.json(project);
})

// Envia requisição POST ao server cadastrando TASKS
server.post('/projects/:id/tasks', (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id == id);

    project.tasks.push(title);

    return res.json(project);
})

// Altera o valor da posição informada no JSON
server.put('/projects/:id', (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id == id);

    project.title = title;

    return res.json(project);
})

// Deleta o valor da posição informada no JSON
server.delete('/projects/:id', (req, res) => {
    const { id } = req.params;

    const projectIndex = projects.findIndex(p => p.id == id);

    projects.splice(projectIndex, 1);

    return res.send();
})

server.listen(3000);