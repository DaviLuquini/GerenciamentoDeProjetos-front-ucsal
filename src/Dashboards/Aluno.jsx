import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const DashboardAluno = () => {
    const [activeTab, setActiveTab] = useState('projects');
    const [projects, setProjects] = useState([]);
    const [grupo, setGrupo] = useState(null); // ✅ Novo estado
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

    const alunoId = localStorage.getItem('userId');

    const fetchStudentProjects = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!alunoId) {
                throw new Error('ID do aluno não encontrado no localStorage');
            }

            const response = await fetch(`http://localhost:8080/projeto/listarProjetosPorAlunoId?alunoId=${alunoId}`);
            if (!response.ok) throw new Error(`Erro ao buscar projetos: ${response.status}`);

            const data = await response.json();
            setProjects(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchGrupoDoAluno = async () => {
        try {
            setLoading(true);
            setError(null);
    
            if (!alunoId) {
                throw new Error('ID do aluno não encontrado no localStorage');
            }
    
            const response = await fetch(`http://localhost:8080/grupo/listarGrupoPorAlunoId?alunoId=${alunoId}`);
            if (!response.ok) throw new Error(`Erro ao buscar grupo: ${response.status}`);
    
            const data = await response.json();
            setGrupo(data); 
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };    

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'projects') fetchStudentProjects();
        if (tab === 'group') fetchGrupoDoAluno(); 
    };

    const handleUpdateProgress = async (project) => {
        try {
            const response = await fetch('http://localhost:8080/projeto/atualizarProjeto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: project.id,
                    nome: project.nome,
                    status: 'FINALIZADO'
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            fetchStudentProjects();
        } catch (err) {
            alert(`Erro ao atualizar projeto: ${err.message}`);
        }
    };

    useEffect(() => {
        if (activeTab === 'projects') fetchStudentProjects();
    }, []);

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        } catch {
            return dateString;
        }
    };

    const getStatusText = (status) => {
        const statusMap = {
            'EM_ANDAMENTO': 'Em Andamento',
            'PENDENTE': 'Pendente',
            'FINALIZADO': 'Finalizado',
            'CANCELADO': 'Cancelado'
        };
        return statusMap[status] || status;
    };

    const getProgressFromStatus = (status) => {
        switch (status) {
            case 'PENDENTE': return 0;
            case 'EM_ANDAMENTO': return 50;
            case 'FINALIZADO': return 100;
            case 'CANCELADO': return 0;
            default: return 0;
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Painel do Aluno</h1>
                <div>
                    <button className="dashboard-button" onClick={() => handleTabChange('projects')}>
                        Meus Projetos
                    </button>
                    <button className="dashboard-button" onClick={() => handleTabChange('group')}>
                        Meu Grupo
                    </button>
                </div>
            </div>

            <div className="dashboard-content">
                {/* ABA DE PROJETOS */}
                {activeTab === 'projects' && (
                    <>
                        <div className="dashboard-header">
                            <h2>Meus Projetos</h2>
                        </div>

                        {loading && <p>Carregando projetos...</p>}
                        {error && (
                            <div className="error-message">
                                <p>Erro ao carregar projetos: {error}</p>
                                <button className="dashboard-button" onClick={fetchStudentProjects}>
                                    Tentar novamente
                                </button>
                            </div>
                        )}
                        {!loading && !error && projects.length === 0 && <p>Nenhum projeto encontrado.</p>}

                        <div className="dashboard-cards">
                            {!loading && !error && projects.map(project => {
                                const progress = getProgressFromStatus(project.status);
                                return (
                                    <div key={project.id} className="dashboard-card">
                                        <h2>{project.nome}</h2>
                                        <p><strong>Objetivo:</strong> {project.objetivo}</p>
                                        <p><strong>Público-Alvo:</strong> {project.publicoAlvo}</p>
                                        <p><strong>Status:</strong>
                                            <span className={`status-badge status-in-progress status-${project.status.toLowerCase()}`}>
                                                {getStatusText(project.status)}
                                            </span>
                                        </p>
                                        <p><strong>Data de Início:</strong> {formatDate(project.dataInicio)}</p>

                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                                            <span>{progress}%</span>
                                        </div>

                                        <div className="card-actions">
                                            <button className="dashboard-button" onClick={() => handleUpdateProgress(project)}>
                                                Atualizar Progresso
                                            </button>
                                            <button className="dashboard-button" onClick={() => setSelectedProject(project)}>
                                                Detalhes
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {selectedProject && (
                            <div className="dashboard-details">
                                <h3>Detalhes do Projeto: {selectedProject.nome}</h3>
                                <p><strong>Grupo ID:</strong> {selectedProject.grupoId}</p>
                                <p><strong>Professor ID:</strong> {selectedProject.professorId}</p>
                                <p><strong>Escopo:</strong> {selectedProject.escopo}</p>
                                <button className="dashboard-button" onClick={() => setSelectedProject(null)}>
                                    Fechar Detalhes
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* ABA DE GRUPO */}
                {activeTab === 'group' && (
                    <>
                        <div className="dashboard-header">
                            <h2>Meu Grupo</h2>
                        </div>

                        {loading && <p>Carregando grupo...</p>}
                        {error && <p className="error-message">Erro ao carregar grupo: {error}</p>}
                        {!loading && !error && grupo && (
                            <div className="dashboard-card">
                                <h2>{grupo.nome}</h2>
                                <p><strong>Professor ID:</strong> {grupo.professorId || 'Não atribuído'}</p>
                                <p><strong>Projeto ID:</strong> {grupo.projetoId || 'Não atribuído'}</p>
                                <p><strong>Status:</strong>
                                    <span className="status-badge status-in-progress">
                                        {grupo.disponivel ? 'Ativo' : 'Inativo'}
                                    </span>
                                </p>
                                <p><strong>Membros:</strong></p>
                                <ul>
                                    {grupo.alunosIds.map((id, index) => (
                                        <li key={index}>Aluno #{id}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default DashboardAluno;
