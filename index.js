const express = require('express');
const path = require('path')
const fs = require('fs/promises')
const app = express();

const jsonPath = path.resolve('./file/tasks.json')

app.use(express.json());

app.get('/tasks', async (req, res) => {
    // obtener el json 
    const jsonFile = await fs.readFile(jsonPath, 'utf8');
    // enviar la respuesta
    res.send(jsonFile);
});

app.post('/tasks', async (req, res) => {
    const task = req.body;
    const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
    task.id = tasksArray[tasksArray.length - 1].id + 1;
    tasksArray.push(task);
    await fs.writeFile(jsonPath, JSON.stringify(tasksArray))
    res.end();
});

app.put('/tasks', async (req, res) => {
    const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
    const taskIndex = tasksArray.findIndex(task => task.id === req.body.id);
    if (taskIndex >= 0) {
        tasksArray[taskIndex].status = req.body.status;
    }
    await fs.writeFile(jsonPath, JSON.stringify(tasksArray))
    res.send('Tarea actualizado')
})

app.delete('/tasks', async (req, res) => {
    const tasksArray = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
    const taskIndex = tasksArray.findIndex(task => task.id === req.body.id);
    if (taskIndex >= 0) {
        tasksArray.splice(taskIndex, 1)
    }
    await fs.writeFile(jsonPath, JSON.stringify(tasksArray))
    res.send('Tarea eliminada')
})

const PORT = 8000;
app.listen(PORT, () => {
    console.log('servidor corriendo con express');
}); 