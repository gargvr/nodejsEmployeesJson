const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

app.get('/employee/:id', (req, res) => {
    const employeeId = (req.params.id).toString();
    const employees = JSON.parse(fs.readFileSync('./data/employees.json', 'utf8'));
    const employee = employees.find(e => e.EmployeeID === employeeId);
    if (!employee) {
        return res.status(404).send({ err: 'Employees not found.' });
    }
    res.send(employee);
});

app.get('/project/:id', (req, res) => {
    const projectId = (req.params.id).toString();
    const projects = JSON.parse(fs.readFileSync('./data/project.json', 'utf8'));
    const project = projects.find(p => p.projectID === projectId);
    if (!project) {
        return res.status(404).send({ err: 'Project not found.' });
    }
    res.send(project);
});

app.get('/getemployeedetails', async (req, res) => {
    const employeeId = (req.query.id).toString();
    const employeePromise = fetch(`http://localhost:3000/employee/${employeeId}`);
    const employee = await employeePromise
        .then(res => res.json());
    const projectId = employee.ProjectID;
    const projectPromise = fetch(`http://localhost:3000/project/${projectId}`);
    const project = await projectPromise.then(res => res.json());
    res.send([employee, project]);
});

app.get('/', async (req, res) => {
    res.send('Welcome to employees admin portal!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));