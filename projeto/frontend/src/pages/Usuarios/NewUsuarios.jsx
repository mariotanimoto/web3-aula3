import { useState, useEffect, useCallback } from 'react';
import { getUsuarios, addUsuario } from '../../services/usuariosService';
import './Usuarios.css';

const initialForm = { nome: '', email: '', senha: '' };

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success') => {
        const id = crypto.randomUUID();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const dismissToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const fetchUsuarios = useCallback(async () => {
        setIsLoading(true);
        try {
            const dados = await getUsuarios();
            setUsuarios(dados);
        } catch (err) {
            console.error(err);
            showToast('Não foi possível carregar os usuários.', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const openModal = () => setIsModalOpen(true);

    const closeModal = () => {
        setIsModalOpen(false);
        setForm(initialForm);
    };

    const handleSalvar = async (e) => {
        e.preventDefault();

        if (!form.nome || !form.email || !form.senha) {
            showToast('Preencha todos os campos antes de salvar.', 'error');
            return;
        }

        setIsSaving(true);
        try {
            await addUsuario(form);
            showToast('Usuário cadastrado com sucesso!', 'success');
            closeModal();
            await fetchUsuarios();
        } catch (err) {
            console.error(err);
            showToast('Erro ao cadastrar usuário. Tente novamente.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, [fetchUsuarios]);

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Lista de Usuários</h1>
                <button className="btn-primary" onClick={openModal}>
                    Novo usuário
                </button>
            </div>

            {isLoading ? (
                <p className="empty-state">Carregando usuários...</p>
            ) : usuarios.length === 0 ? (
                <p className="empty-state">Nenhum usuário cadastrado ainda.</p>
            ) : (
                <ul className="user-list">
                    {usuarios.map((user) => (
                        <li key={user.id} className="user-list-item">
                            <span className="user-name">{user.nome}</span>
                            <span className="user-email">{user.email}</span>
                        </li>
                    ))}
                </ul>
            )}

            {isModalOpen && (
                <div
                    className="modal-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) closeModal();
                    }}
                >
                    <div className="modal-content" role="dialog" aria-modal="true">
                        <div className="modal-header">
                            <h2>Cadastrar Usuário</h2>
                            <button
                                type="button"
                                className="modal-close"
                                onClick={closeModal}
                                aria-label="Fechar"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSalvar}>
                            <label>
                                Nome
                                <input
                                    type="text"
                                    name="nome"
                                    value={form.nome}
                                    onChange={handleChange}
                                    autoFocus
                                />
                            </label>

                            <label>
                                Email
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                            </label>

                            <label>
                                Senha
                                <input
                                    type="password"
                                    name="senha"
                                    value={form.senha}
                                    onChange={handleChange}
                                />
                            </label>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={closeModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary" disabled={isSaving}>
                                    {isSaving ? 'Salvando...' : 'Salvar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="toast-container">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`toast toast-${toast.type}`}
                        onClick={() => dismissToast(toast.id)}
                    >
                        {toast.message}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Usuarios;