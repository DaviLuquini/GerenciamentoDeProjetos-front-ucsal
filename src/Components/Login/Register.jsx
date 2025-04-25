import { useState } from "react";
import { FaUser, FaLock, FaEnvelope, FaUserTag } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        userType: "aluno", // valor padrão
        grupoId: ""
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        // Validate full name
        if (!formData.fullName.trim()) {
            newErrors.fullName = "Nome completo é obrigatório";
            isValid = false;
        }

        // Validate email
        if (!formData.email.trim()) {
            newErrors.email = "E-mail é obrigatório";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "E-mail inválido";
            isValid = false;
        }

        // Validate password
        if (!formData.password) {
            newErrors.password = "Senha é obrigatória";
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = "Senha deve ter pelo menos 6 caracteres";
            isValid = false;
        }

        // Validate password confirmation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "As senhas não correspondem";
            isValid = false;
        }

        // Validate grupoID 
        if (formData.userType === "aluno" && !formData.grupoId.trim()) {
            newErrors.grupoId = "ID do grupo é obrigatório para alunos";
            isValid = false;
        }


        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (validateForm()) {
            // Definir o endpoint com base no tipo de usuário
            let endpoint = "";
            switch (formData.userType) {
                case "administrador":
                    endpoint = 'http://localhost:8080/registro/admin';
                    break;
                case "professor":
                    endpoint = 'http://localhost:8080/registro/professor';
                    break;
                case "aluno":
                    endpoint = 'http://localhost:8080/registro/aluno';
                    break;
                default:
                    setErrors({ api: "Tipo de usuário inválido" });
                    return;
            }

            // Enviar dados para o endpoint correto
            fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    nome: formData.fullName,
                    senha: formData.password,
                    tipoUsuario: formData.userType,
                    ...(formData.userType === "aluno" && { grupoId: formData.grupoId })
                }),
            })
                .then(response => response.text())
                .then(text => {
                    console.log("Resposta do servidor:", text);
                    if (text.toLowerCase().includes("sucesso")) {
                        navigate("/");
                    } else {
                        setErrors({ api: text || "Erro no registro" });
                    }
                })
                .catch(error => {
                    setErrors({ api: "Erro ao conectar com o servidor" });
                    console.error('Error:', error);
                });
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h1>Registrar na Incubadora</h1>

                <div className="input-field">
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Nome Completo"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                    />
                    <FaUserTag className="icon" />
                    {errors.fullName && <p className="error-message">{errors.fullName}</p>}
                </div>

                <div className="input-field">
                    <input
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        required
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <FaEnvelope className="icon" />
                    {errors.email && <p className="error-message">{errors.email}</p>}
                </div>

                <div className="input-field">
                    <input
                        type="password"
                        name="password"
                        placeholder="Senha"
                        required
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <FaLock className="icon" />
                    {errors.password && <p className="error-message">{errors.password}</p>}
                </div>

                <div className="input-field">
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirme a Senha"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                    <FaLock className="icon" />
                    {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                </div>

                {/* Dropdown para escolher o tipo de usuário */}
                <div className="input-field">
                    <label>Tipo de Usuário</label>
                    <select
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                    >
                        <option value="aluno">Aluno</option>
                        <option value="professor">Professor</option>
                        <option value="administrador">Administrador</option>
                    </select>
                </div>

                {formData.userType === "aluno" && (
                    <div className="input-field">
                        <input
                            type="text"
                            name="grupoId"
                            placeholder="ID do Grupo"
                            value={formData.grupoId}
                            onChange={handleChange}
                        />
                        {errors.grupoId && <p className="error-message">{errors.grupoId}</p>}
                    </div>
                )}


                {errors.api && <p className="error-message api-error">{errors.api}</p>}

                <button type="submit">Registrar</button>

                <div className="login-link">
                    <p>Já tem uma conta? <Link to="/">Entrar</Link></p>
                </div>
            </form>
        </div>
    );
};

export default Register;
