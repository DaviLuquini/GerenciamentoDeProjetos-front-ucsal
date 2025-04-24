import React, { useState } from 'react';
import './Dashboard.css';

const DashboardAluno = () => {
    const [activeTab, setActiveTab] = useState('projects');

    // Dados de exemplo (substituir por dados reais da API)
    const projects = [
        { 
            id: 1, 
            name: 'Projeto A', 
            professor: 'Prof. Silva',
            status: 'in-progress',
            startDate: '2024-04-01',
            deadline: '2024-06-01',
            progress: 60
        },
        { 
            id: 2, 
            name: 'Projeto B', 
            professor: 'Prof. Santos',
            status: 'pending',
            startDate: '2024-05-01',
            deadline: '2024-07-01',
            progress: 0
        },
    ];

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Painel do Aluno</h1>
                <div>
                    <button className="dashboard-button" onClick={() => setActiveTab('projects')}>Meus Projetos</button>
                    <button className="dashboard-button" onClick={() => setActiveTab('group')}>Meu Grupo</button>
                </div>
            </div>

            <div className="dashboard-content">
                {activeTab === 'projects' && (
                    <>
                        <div className="dashboard-header">
                            <h2>Meus Projetos</h2>
                        </div>

                        <div className="dashboard-cards">
                            {projects.map(project => (
                                <div key={project.id} className="dashboard-card">
                                    <h2>{project.name}</h2>
                                    <p><strong>Professor:</strong> {project.professor}</p>
                                    <p><strong>Status:</strong> 
                                        <span className={`status-badge status-${project.status}`}>
                                            {project.status === 'pending' ? 'Pendente' :
                                             project.status === 'in-progress' ? 'Em Andamento' :
                                             project.status === 'completed' ? 'Concluído' : 'Cancelado'}
                                        </span>
                                    </p>
                                    <p><strong>Data de Início:</strong> {project.startDate}</p>
                                    <p><strong>Prazo:</strong> {project.deadline}</p>
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill"
                                            style={{ width: `${project.progress}%` }}
                                        ></div>
                                        <span>{project.progress}%</span>
                                    </div>
                                    <div className="card-actions">
                                        <button className="dashboard-button">Atualizar Progresso</button>
                                        <button className="dashboard-button">Detalhes</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'group' && (
                    <>
                        <div className="dashboard-header">
                            <h2>Meu Grupo</h2>
                        </div>

                        <div className="dashboard-card">
                            <h2>Grupo 1</h2>
                            <p><strong>Coordenador:</strong> Prof. Silva</p>
                            <p><strong>Membros:</strong></p>
                            <ul>
                                <li>João Silva</li>
                                <li>Maria Santos</li>
                                <li>Pedro Oliveira</li>
                            </ul>
                            <p><strong>Status:</strong> 
                                <span className="status-badge status-in-progress">Ativo</span>
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DashboardAluno;
