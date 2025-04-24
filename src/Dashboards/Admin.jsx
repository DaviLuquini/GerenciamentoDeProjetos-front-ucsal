import React, { useState } from 'react';
import './Dashboard.css';

const DashboardAdmin = () => {
    const [activeTab, setActiveTab] = useState('projects');
    const [showNewProjectForm, setShowNewProjectForm] = useState(false);
    const [showNewGroupForm, setShowNewGroupForm] = useState(false);
    const [showNewProfessorForm, setShowNewProfessorForm] = useState(false);

    // Dados de exemplo (substituir por dados reais da API)
    const projects = [
        { id: 1, name: 'Projeto A', professor: 'Prof. Silva', status: 'pending', group: 'Grupo 1' },
        { id: 2, name: 'Projeto B', professor: 'Prof. Santos', status: 'in-progress', group: 'Grupo 2' },
    ];

    const groups = [
        { id: 1, name: 'Grupo 1', coordinator: 'Prof. Silva', status: 'available' },
        { id: 2, name: 'Grupo 2', coordinator: 'Prof. Santos', status: 'unavailable' },
    ];

    const professors = [
        { id: 1, name: 'Prof. Silva', department: 'Tecnologia' },
        { id: 2, name: 'Prof. Santos', department: 'Administração' },
    ];

    const handleNewProject = (e) => {
        e.preventDefault();
        // Implementar lógica de criação de projeto
        setShowNewProjectForm(false);
    };

    const handleNewGroup = (e) => {
        e.preventDefault();
        // Implementar lógica de criação de grupo
        setShowNewGroupForm(false);
    };

    const handleNewProfessor = (e) => {
        e.preventDefault();
        // Implementar lógica de criação de professor
        setShowNewProfessorForm(false);
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Painel do Administrador</h1>
                <div>
                    <button className="dashboard-button" onClick={() => setActiveTab('projects')}>Projetos</button>
                    <button className="dashboard-button" onClick={() => setActiveTab('groups')}>Grupos</button>
                    <button className="dashboard-button" onClick={() => setActiveTab('professors')}>Professores</button>
                </div>
            </div>

            <div className="dashboard-content">
                {activeTab === 'projects' && (
                    <>
                        <div className="dashboard-header">
                            <h2>Projetos</h2>
                            <button className="dashboard-button" onClick={() => setShowNewProjectForm(true)}>
                                Novo Projeto
                            </button>
                        </div>

                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Professor</th>
                                    <th>Grupo</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map(project => (
                                    <tr key={project.id}>
                                        <td>{project.name}</td>
                                        <td>{project.professor}</td>
                                        <td>{project.group}</td>
                                        <td>
                                            <span className={`status-badge status-${project.status}`}>
                                                {project.status === 'pending' ? 'Pendente' :
                                                 project.status === 'in-progress' ? 'Em Andamento' :
                                                 project.status === 'completed' ? 'Concluído' : 'Cancelado'}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="dashboard-button">Editar</button>
                                            <button className="dashboard-button">Excluir</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {activeTab === 'groups' && (
                    <>
                        <div className="dashboard-header">
                            <h2>Grupos</h2>
                            <button className="dashboard-button" onClick={() => setShowNewGroupForm(true)}>
                                Novo Grupo
                            </button>
                        </div>

                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Coordenador</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groups.map(group => (
                                    <tr key={group.id}>
                                        <td>{group.name}</td>
                                        <td>{group.coordinator}</td>
                                        <td>
                                            <span className={`status-badge ${group.status === 'available' ? 'status-in-progress' : 'status-cancelled'}`}>
                                                {group.status === 'available' ? 'Disponível' : 'Indisponível'}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="dashboard-button">Editar</button>
                                            <button className="dashboard-button">Excluir</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {activeTab === 'professors' && (
                    <>
                        <div className="dashboard-header">
                            <h2>Professores</h2>
                            <button className="dashboard-button" onClick={() => setShowNewProfessorForm(true)}>
                                Novo Professor
                            </button>
                        </div>

                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Departamento</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {professors.map(professor => (
                                    <tr key={professor.id}>
                                        <td>{professor.name}</td>
                                        <td>{professor.department}</td>
                                        <td>
                                            <button className="dashboard-button">Editar</button>
                                            <button className="dashboard-button">Excluir</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>

            {/* Formulários Modais */}
            {showNewProjectForm && (
                <div className="dashboard-content">
                    <h2>Novo Projeto</h2>
                    <form className="dashboard-form" onSubmit={handleNewProject}>
                        <div>
                            <label>Nome do Projeto</label>
                            <input type="text" required />
                        </div>
                        <div>
                            <label>Professor</label>
                            <select required>
                                {professors.map(prof => (
                                    <option key={prof.id} value={prof.id}>{prof.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Grupo</label>
                            <select required>
                                {groups.map(group => (
                                    <option key={group.id} value={group.id}>{group.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Objetivo</label>
                            <textarea required></textarea>
                        </div>
                        <div>
                            <label>Data de Início</label>
                            <input type="date" required />
                        </div>
                        <div>
                            <label>Escopo</label>
                            <textarea required></textarea>
                        </div>
                        <div>
                            <label>Público-Alvo</label>
                            <input type="text" required />
                        </div>
                        <button type="submit" className="dashboard-button">Criar Projeto</button>
                        <button type="button" className="dashboard-button" onClick={() => setShowNewProjectForm(false)}>
                            Cancelar
                        </button>
                    </form>
                </div>
            )}

            {showNewGroupForm && (
                <div className="dashboard-content">
                    <h2>Novo Grupo</h2>
                    <form className="dashboard-form" onSubmit={handleNewGroup}>
                        <div>
                            <label>Nome do Grupo</label>
                            <input type="text" required />
                        </div>
                        <div>
                            <label>Coordenador</label>
                            <select required>
                                {professors.map(prof => (
                                    <option key={prof.id} value={prof.id}>{prof.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="dashboard-button">Criar Grupo</button>
                        <button type="button" className="dashboard-button" onClick={() => setShowNewGroupForm(false)}>
                            Cancelar
                        </button>
                    </form>
                </div>
            )}

            {showNewProfessorForm && (
                <div className="dashboard-content">
                    <h2>Novo Professor</h2>
                    <form className="dashboard-form" onSubmit={handleNewProfessor}>
                        <div>
                            <label>Nome</label>
                            <input type="text" required />
                        </div>
                        <div>
                            <label>Departamento</label>
                            <input type="text" required />
                        </div>
                        <button type="submit" className="dashboard-button">Criar Professor</button>
                        <button type="button" className="dashboard-button" onClick={() => setShowNewProfessorForm(false)}>
                            Cancelar
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default DashboardAdmin;
