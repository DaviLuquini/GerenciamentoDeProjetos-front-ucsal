import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const DashboardProfessor = () => {
    const [activeTab, setActiveTab] = useState('projects');
    const [showNewProjectForm, setShowNewProjectForm] = useState(false);
    const [projects, setProjects] = useState([]);
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState('');
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        if (activeTab === 'projects') {
            fetchProjects();
        } else if (activeTab === 'groups') {
            fetchGroups();
        }
    }, [activeTab]);

    const fetchProjects = async () => {
        const professorId = localStorage.getItem('userId'); 

        if (!professorId) {
            setError('ID do professor não encontrado.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/projeto/listarProjetosPorId?professorId=${professorId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                setError('Erro ao carregar projetos.');
                return;
            }

            const data = await response.json();
            console.log("Projetos carregados:", data);
            setProjects(data || []); 
        } catch (err) {
            console.error('Erro na requisição:', err);
            setError('Erro ao conectar com o servidor.');
        }
    };

    const fetchGroups = async () => {
        try {
            const response = await fetch('http://localhost:8080/grupo/listarGrupos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                setError('Erro ao carregar grupos.');
                return;
            }

            const data = await response.json();
            console.log("Grupos carregados:", data);
            setGroups(data || []); 
        } catch (err) {
            console.error('Erro na requisição:', err);
            setError('Erro ao conectar com o servidor.');
        }
    };

    const getStatusText = (status) => {
        switch(status) {
            case 'AGUARDANDO_ANALISE':
                return 'Aguardando Análise';
            case 'EM_ANDAMENTO':
                return 'Em Andamento';
            case 'CONCLUIDO':
                return 'Concluído';
            case 'CANCELADO':
                return 'Cancelado';
            default:
                return status || 'Pendente';
        }
    };

    const getStatusClass = (status) => {
        switch(status) {
            case 'AGUARDANDO_ANALISE':
                return 'status-pending';
            case 'EM_ANDAMENTO':
                return 'status-in-progress';
            case 'CONCLUIDO':
                return 'status-completed';
            case 'CANCELADO':
                return 'status-cancelled';
            default:
                return 'status-pending';
        }
    };

    const handleProjectDetails = (project) => {
        console.log("Exibindo detalhes do projeto:", project);
        setSelectedProject(project);
    };

    const handleCloseDetails = () => {
        setSelectedProject(null);
    };
    
    const handleConfirmDelivery = async (project) => {
        const projetoRequest = {
            nome: project.nome,
            id: project.id
        };
    
        try {
            const response = await fetch('http://localhost:8080/projeto/confirmarEntregaProjeto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(projetoRequest)
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                setError(errorText || 'Erro ao confirmar entrega');
                return;
            }
    
            const successMessage = await response.text();
            alert(successMessage);
            fetchProjects();
        } catch (err) {
            console.error('Erro na requisição:', err);
            setError('Erro ao conectar com o servidor.');
        }
    };
    
    

    const handleNewProject = (e) => {
        e.preventDefault();
        console.log("Novo projeto submetido");
        setShowNewProjectForm(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Painel do Professor</h1>
                <div>
                    <button className="dashboard-button" onClick={() => setActiveTab('projects')}>Meus Projetos</button>
                    <button className="dashboard-button" onClick={() => setActiveTab('groups')}>Grupos Disponíveis</button>
                </div>
            </div>

            <div className="dashboard-content">
                {activeTab === 'projects' && (
                    <>
                        <div className="dashboard-header">
                            <h2>Meus Projetos</h2>
                            <button className="dashboard-button" onClick={() => setShowNewProjectForm(true)}>
                                Solicitar Novo Projeto
                            </button>
                        </div>

                        {error && <p className="error-message">{error}</p>}

                        {selectedProject && (
                            <div className="project-details-container">
                                <div className="project-details">
                                    <h3>Detalhes do Projeto</h3>
                                    <div className="project-details-content">
                                        <p><strong>Nome:</strong> {selectedProject.nome || 'N/A'}</p>
                                        <p><strong>Grupo ID:</strong> {selectedProject.grupoId || 'N/A'}</p>
                                        <p><strong>Data de Início:</strong> {formatDate(selectedProject.dataInicio)}</p>
                                        <p><strong>Status:</strong> {getStatusText(selectedProject.status)}</p>
                                        <p><strong>Objetivo:</strong> {selectedProject.objetivo || 'N/A'}</p>
                                        <p><strong>Escopo:</strong> {selectedProject.escopo || 'N/A'}</p>
                                        <p><strong>Público-Alvo:</strong> {selectedProject.publicoAlvo || 'N/A'}</p>
                                    </div>
                                    <button className="dashboard-button" onClick={handleCloseDetails}>
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        )}

                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Grupo ID</th>
                                    <th>Data de Início</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects && projects.length > 0 ? (
                                    projects.map(project => (
                                        <tr key={project.id}>
                                            <td>{project.nome || 'N/A'}</td>
                                            <td>{project.grupoId || 'N/A'}</td>
                                            <td>{formatDate(project.dataInicio)}</td>
                                            <td>
                                                <span className={`status-badge ${getStatusClass(project.status)}`}>
                                                    {getStatusText(project.status)}
                                                </span>
                                            </td>
                                            <td>
                                                <button 
                                                    className="dashboard-button"
                                                    onClick={() => handleProjectDetails(project)}
                                                >
                                                    Detalhes
                                                </button>
                                                <button 
                                                    className="dashboard-button"
                                                    onClick={() => handleConfirmDelivery(project)}
                                                >
                                                    Confirmar Entrega
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">Nenhum projeto encontrado.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </>
                )}

                {activeTab === 'groups' && (
                    <>
                        <div className="dashboard-header">
                            <h2>Grupos Disponíveis</h2>
                        </div>

                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Status</th>
                                    <th>Projetos em Andamento</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groups && groups.length > 0 ? (
                                    groups.map(group => (
                                        <tr key={group.id}>
                                            <td>{group.nome}</td>
                                            <td>
                                                <span className={`status-badge ${group.disponivel ? 'status-in-progress' : 'status-cancelled'}`}>
                                                    {group.disponivel ? 'Disponível' : 'Indisponível'}
                                                </span>
                                            </td>
                                            <td>{group.projetoId ? 1 : 0}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3">Nenhum grupo disponível.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </>
                )}
            </div>

            {showNewProjectForm && (
                <div className="dashboard-content">
                    <h2>Solicitar Novo Projeto</h2>
                    <form className="dashboard-form" onSubmit={handleNewProject}>
                        <div>
                            <label>Nome do Projeto</label>
                            <input type="text" required />
                        </div>
                        <div>
                            <label>Objetivo</label>
                            <textarea required></textarea>
                        </div>
                        <div>
                            <label>Data de Início Esperada</label>
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
                        <button type="submit" className="dashboard-button">Solicitar Projeto</button>
                        <button type="button" className="dashboard-button" onClick={() => setShowNewProjectForm(false)}>
                            Cancelar
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default DashboardProfessor;
