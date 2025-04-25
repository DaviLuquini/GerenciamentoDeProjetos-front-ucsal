import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const DashboardAdmin = () => {
    const [activeTab, setActiveTab] = useState('projects');
    const [showNewProjectForm, setShowNewProjectForm] = useState(false);
    const [showNewGroupForm, setShowNewGroupForm] = useState(false);
    const [showNewProfessorForm, setShowNewProfessorForm] = useState(false);
    const [projects, setProjects] = useState([]);
    const [groups, setGroups] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [error, setError] = useState('');

    const [nomeProjeto, setNomeProjeto] = useState('');
    const [objetivo, setObjetivo] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [escopo, setEscopo] = useState('');
    const [publicoAlvo, setPublicoAlvo] = useState('');
    const [selectedProfessor, setSelectedProfessor] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');

    const [newGroup, setNewGroup] = useState({
        nome: '',
        professorId: '',
        projetoId: '',
        alunosIds: '',
        disponivel: true,
    });

    const [newProfessor, setNewProfessor] = useState({
        nome: '',
        email: '',
        senha: '',
    });


    useEffect(() => {
        if (activeTab === 'projects') {
            fetchProjects();
        } else if (activeTab === 'groups') {
            fetchGroups();
        } else if (activeTab === 'professors') {
            fetchProfessors();
        }
    }, [activeTab]);

    const fetchProjects = async () => {
        try {
            const response = await fetch('http://localhost:8080/projeto/listar', {
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

    const fetchProfessors = async () => {
        try {
            const response = await fetch('http://localhost:8080/professor/listarProfessores', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                setError('Erro ao carregar professores.');
                return;
            }

            const data = await response.json();
            console.log("Professores carregados:", data);
            setProfessors(data || []);
        } catch (err) {
            console.error('Erro na requisição:', err);
            setError('Erro ao conectar com o servidor.');
        }
    };

    const getStatusText = (status) => {
        switch (status) {
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
        switch (status) {
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

    const handleNewProject = async (e) => {
        e.preventDefault();

        if (!selectedProfessor) {
            setError('Selecione um professor para o projeto.');
            return;
        }

        const novoProjeto = {
            nome: nomeProjeto,
            objetivo,
            escopo,
            publicoAlvo,
            dataInicio,
            professorId: selectedProfessor,
            grupoId: selectedGroup || null
        };

        try {
            const response = await fetch('http://localhost:8080/administrador/cadastrarProjeto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(novoProjeto),
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                setError(errorMsg || 'Erro ao criar projeto.');
                return;
            }

            await fetchProjects();
            setShowNewProjectForm(false);
            resetProjectForm();
        } catch (err) {
            console.error('Erro na requisição:', err);
            setError('Erro ao conectar com o servidor.');
        }
    };




    const resetProjectForm = () => {
        setNomeProjeto('');
        setObjetivo('');
        setDataInicio('');
        setEscopo('');
        setPublicoAlvo('');
        setSelectedProfessor('');
        setSelectedGroup('');
    };

    const handleNewGroup = async (e) => {
        e.preventDefault();

        // transforma os IDs de alunos para um array de números
        const alunosArray = newGroup.alunosIds
            .split(',')
            .map(id => parseInt(id.trim()))
            .filter(id => !isNaN(id));

        try {
            const response = await fetch('http://localhost:8080/administrador/cadastrarGrupo', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newGroup,
                    alunosIds: alunosArray,
                }),
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                alert(errorMsg || 'Erro ao criar grupo.');
                return;
            }

            setShowNewGroupForm(false);
        } catch (err) {
            alert('Erro de conexão com o servidor.');
        }
    };


    const handleNewProfessor = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/administrador/cadastrarProfessor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(newProfessor),
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                alert(errorMsg || 'Erro ao criar professor.');
                return;
            }

            fetchProfessors();
            setShowNewProfessorForm(false);
            setNewProfessor({ nome: '', email: '', senha: '' });
        } catch (error) {
            alert('Erro de conexão com o servidor.');
        }
    };

    const handleDeleteProject = async (projectNome) => {
        const confirmDelete = window.confirm(`Você tem certeza que deseja deletar o projeto "${projectNome}"?\nIsso também irá deletar todos os grupos vinculados a ele.`);

        if (!confirmDelete) return;
        try {
            const response = await fetch(`http://localhost:8080/administrador/deletarProjeto?nome=${encodeURIComponent(projectNome)}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                setError(errorMsg || 'Erro ao excluir projeto.');
                return;
            }

            await fetchProjects();
        } catch (err) {
            console.error('Erro na requisição:', err);
            setError('Erro ao conectar com o servidor.');
        }
    };

    const handleDeleteGrupo = async (grupoNome) => {
        try {
            const response = await fetch(`http://localhost:8080/administrador/desativarGrupo?nome=${encodeURIComponent(grupoNome)}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                setError(errorMsg || 'Erro ao excluir grupo.');
                return;
            }

            await fetchGroups();
        } catch (err) {
            console.error('Erro na requisição:', err);
            setError('Erro ao conectar com o servidor.');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
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

            {error && <p className="error-message">{error}</p>}

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
                                    <th>Professor ID</th>
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
                                            <td>{project.professorId || 'N/A'}</td>
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
                                                    onClick={() => handleDeleteProject(project.nome)}
                                                >
                                                    Excluir
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">Nenhum projeto encontrado.</td>
                                    </tr>
                                )}
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
                                    <th>Status</th>
                                    <th>Projeto ID</th>
                                    <th>Ações</th>
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
                                            <td>{group.projetoId || 'N/A'}</td>
                                            <td>
                                                <button
                                                    className="dashboard-button"
                                                    onClick={() => handleDeleteGrupo(group.nome)}
                                                >
                                                    Excluir
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">Nenhum grupo disponível.</td>
                                    </tr>
                                )}
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
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {professors && professors.length > 0 ? (
                                    professors.map(professor => (
                                        <tr key={professor.id}>
                                            <td>{professor.id}</td>
                                            <td>{professor.nome || 'N/A'}</td>
                                            <td>{professor.email || 'N/A'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">Nenhum professor encontrado.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </>
                )}
            </div>

            {/* Formulário de Novo Projeto */}
            {showNewProjectForm && (
                <div className="dashboard-content">
                    <h2>Novo Projeto</h2>
                    <form className="dashboard-form" onSubmit={handleNewProject}>
                        <div>
                            <label>Nome do Projeto</label>
                            <input
                                type="text"
                                value={nomeProjeto}
                                onChange={e => setNomeProjeto(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Professor</label>
                            <select
                                value={selectedProfessor}
                                onChange={e => setSelectedProfessor(e.target.value)}
                                required
                            >
                                <option value="">Selecione um professor</option>
                                {professors.map(prof => (
                                    <option key={prof.id} value={prof.id}>{prof.nome || prof.email}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Grupo</label>
                            <select
                                value={selectedGroup}
                                onChange={e => setSelectedGroup(e.target.value)}
                            >
                                <option value="">Selecione um grupo</option>
                                {groups.filter(group => group.disponivel).map(group => (
                                    <option key={group.id} value={group.id}>{group.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Objetivo</label>
                            <textarea
                                value={objetivo}
                                onChange={e => setObjetivo(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label>Data de Início</label>
                            <input
                                type="date"
                                value={dataInicio}
                                onChange={e => setDataInicio(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label>Escopo</label>
                            <textarea
                                value={escopo}
                                onChange={e => setEscopo(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label>Público-Alvo</label>
                            <input
                                type="text"
                                value={publicoAlvo}
                                onChange={e => setPublicoAlvo(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="dashboard-button">Criar Projeto</button>
                        <button
                            type="button"
                            className="dashboard-button"
                            onClick={() => {
                                setShowNewProjectForm(false);
                                resetProjectForm();
                            }}
                        >
                            Cancelar
                        </button>
                    </form>
                </div>
            )}

            {/* Formulário de Novo Grupo */}
            {showNewGroupForm && (
                <div className="dashboard-content">
                    <h2>Novo Grupo</h2>
                    <form className="dashboard-form" onSubmit={handleNewGroup}>
                        <div>
                            <label>Nome do Grupo</label>
                            <input
                                type="text"
                                required
                                value={newGroup.nome}
                                onChange={(e) => setNewGroup({ ...newGroup, nome: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>ID do Professor</label>
                            <input
                                type="number"
                                required
                                value={newGroup.professorId}
                                onChange={(e) => setNewGroup({ ...newGroup, professorId: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>ID do Projeto</label>
                            <input
                                type="number"
                                required
                                value={newGroup.projetoId}
                                onChange={(e) => setNewGroup({ ...newGroup, projetoId: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>IDs dos Alunos (separados por vírgula)</label>
                            <input
                                type="text"
                                value={newGroup.alunosIds}
                                onChange={(e) => setNewGroup({ ...newGroup, alunosIds: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Disponível</label>
                            <input
                                type="checkbox"
                                checked={newGroup.disponivel}
                                onChange={(e) => setNewGroup({ ...newGroup, disponivel: e.target.checked })}
                            />
                        </div>
                        <button type="submit" className="dashboard-button">Criar Grupo</button>
                        <button type="button" className="dashboard-button" onClick={() => setShowNewGroupForm(false)}>
                            Cancelar
                        </button>
                    </form>
                </div>
            )}

            {/* Formulário de Novo Professor */}
            {showNewProfessorForm && (
                <div className="dashboard-content">
                    <h2>Novo Professor</h2>
                    <form className="dashboard-form" onSubmit={handleNewProfessor}>
                        <div>
                            <label>Nome</label>
                            <input
                                type="text"
                                required
                                value={newProfessor.nome}
                                onChange={(e) => setNewProfessor({ ...newProfessor, nome: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Email</label>
                            <input
                                type="email"
                                required
                                value={newProfessor.email}
                                onChange={(e) => setNewProfessor({ ...newProfessor, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Senha</label>
                            <input
                                type="password"
                                required
                                value={newProfessor.senha}
                                onChange={(e) => setNewProfessor({ ...newProfessor, senha: e.target.value })}
                            />
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