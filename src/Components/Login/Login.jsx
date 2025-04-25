import { FaUser, FaLock } from "react-icons/fa";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: username, senha: password }),
            });

            if (!response.ok) {
                setError("Credenciais inválidas ou usuário não encontrado.");
                return;
            }

            const data = await response.json();
            const { role, token, id } = data;

            localStorage.setItem('token', token); 
            localStorage.setItem("role", role);
            localStorage.setItem("userId", id);

            // Redireciona baseado no papel
            switch (role) {
                case "ADMIN":
                    navigate("/dashboard-admin");
                    break;
                case "PROFESSOR":
                    navigate("/dashboard-professor");
                    break;
                case "ALUNO":
                    navigate("/dashboard-aluno");
                    break;
                default:
                    setError("Papel de usuário desconhecido.");
                    break;
            }

        } catch (err) {
            console.error("Erro no login:", err);
            setError("Erro ao conectar com o servidor.");
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h1>Acesse a Incubadora</h1>

                <div className="input-field">
                    <input
                        type="email"
                        placeholder="E-mail"
                        required
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <FaUser className="icon" />
                </div>

                <div className="input-field">
                    <input
                        type="password"
                        placeholder="Senha"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FaLock className="icon" />
                </div>

                <div className="recall-forget">
                    <label>
                        <input type="checkbox" />
                        Lembre de mim
                    </label>
                    <a href="#">Esqueceu a senha?</a>
                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit">Entrar</button>

                <div className="signup-link">
                    <p>Não tem uma conta? <Link to="/register">Registrar</Link></p>
                </div>
            </form>
        </div>
    );
};

export default Login;
