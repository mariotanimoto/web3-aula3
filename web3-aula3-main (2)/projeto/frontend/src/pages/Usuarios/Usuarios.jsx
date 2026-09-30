import { useState, useEffect } from 'react';
import { getUsuarios } from '../../services/usuariosService';

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [form, setForm] = useState([nome:'', email:'', senha:''])

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((prev) => ({..prev, [name]:value}));
    }

    const handleSalvar = async (e) => {
        e.preventDefault();

        try{
            await addUsuario(form);
            setForm({nome:'',email: '', senha: ''});
            await fetchusuarios();
        }catch(err){
            console.log(err);
        }
    }

    const fetchUsuarios = async () => {
        try {
            const dados = await getUsuarios();
            setUsuarios(dados);
        } catch (err) {
            console.log(err)
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    return (
        <div className="page-container">
            <h1>Lista de Usuarios</h1>

            <ul>
                {usuarios.map(user => (
                    <li key={user.id}>
                        <span>{user.nome}</span>
                    </li>
                ))}
            </ul>
        </div>

        <div className="modal-overlay">
  <h2>Cadastrar Usuário</h2>

  <form onSubmit={handleSalvar}>
    <label>
      Nome:
      <input
        type="text"
        name="nome"
        value={form.nome}
        onChange={handleChange}
        autoFocus
      />
    </label>

    <label>
      Email:
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
      />
    </label>

    <label>
      Senha:
      <input
        type="password"
        name="senha"
        value={form.senha}
        onChange={handleChange}
      />
    </label>

    <div className="modal-actions">
      <button type="submit">Salvar</button>
    </div>
  </form>
</div>

    );
}

export default Usuarios;