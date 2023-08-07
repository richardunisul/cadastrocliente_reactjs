// Import de bibliotecas
import './App.css';
import {BrowserRouter, Routes, Route, Outlet, Link, useNavigate, useParams} from "react-router-dom";
import { useState , useEffect } from 'react';
// Define o endereço do servidor
const endereco_servidor = 'http://localhost:8000';

function NoPage() {
 return (
   <div>
    <h2>404 - Página não encontrada</h2>
   </div>
  );
};
function Layout(){
     return (
      <>
       <h1>Menu principal</h1>
       <nav>   
        <ol>
         <li>
          <Link to="/frmcadastrocliente/-1">Incluir</Link>
         </li>     
         <li>
          <Link to="/listarcliente">Listar(Alterar, Excluir)</Link>
         </li>     
        </ol> 
        <hr />   
       </nav>
       <Outlet />
      </>
     )
    };
    function FrmCadastroCliente(){

         const { alterarId } = useParams(); //Recupera o parâmetro do componente  // Estados inciais das variáveis do componente   
         const [nome, setNome] = useState('');
         const [cpf, setCpf] = useState('');
         const [resultado, setResultado] = useState(''); 
         useEffect(() => {// Consulta o cliente para alterar
          const getCliente = async () => {
           if (alterarId > 0) {//Se foi passado um parâmetro
            const response = await                
                             fetch(`${endereco_servidor}/cliente/${alterarId}`);
            const data = await response.json();
            setNome(data.nome);  //Atualiza os dados
            setCpf(data.cpf);
           } 
          };
          getCliente(); 
         }, [alterarId]);
// Submissão do formulário inserir
 const handleSubmitInsert = (event) =>{
    event.preventDefault();
    const dados = {
        'nome': nome,
        'cpf' : cpf
    }
 
        //Endereço da API + campos em JSON 
        fetch(`${endereco_servidor}/cliente`, {
            method : 'post',
            headers : {'Content-Type': 'application/json'},
            body: JSON.stringify(dados)}) //Converte os dados para JSON
           .then((response) => response.json()) //Converte a resposta para JSON
           .then((data) => setResultado(data.message)); // Atribui a resposta ao resultado
      
        // Limpa os campos do formulário.
        limpar();
      };        


     // Submissão do formulário atualizar.
     const handleSubmitUpdate = (event) => {
      event.preventDefault(); // Impede o recarregamento da página
    
      const dados = {//Dados do formulário a serem enviados
         'nome': nome,
         'cpf': cpf
      };
       //Endereço da API + campos em JSON   
      fetch(`${endereco_servidor}/cliente/${alterarId}`, {
        method : 'put',
        headers : {'Content-Type': 'application/json'},
        body: JSON.stringify(dados)}) //Converte os dados para JSON
       .then((response) => response.json()) //Converte para JSON
          // Atribui a resposta ao resultado
       .then((data) => setResultado(data.message));  
      // Limpa os campos do formulário.
      limpar();
     };
     // Limpa os campos do formulário.     
     const limpar = () => { 
      setNome('');
      setCpf('');
     };
     return (
          <><form name="FrmCadastroCliente" method="post" 
                     onSubmit={alterarId<0 ? handleSubmitInsert:handleSubmitUpdate}>
             <label><h2> {(alterarId < 0) ? 
                     (<div>1 - Formulário Cadastro Cliente</div>) : 
                     (<div>1 - Formulário Alteração Cliente</div>)} </h2></label>
             <label>Nome: 
             <input type="text" size="60" id="nome" name="nome" value={nome} 
                        onChange={(event) => setNome(event.target.value)} />
                  </label><br/>
             <label>CPF: 
             <input type="text" size="15" id="cpf" name="cpf" value={cpf} 
                         onChange={(event) => setCpf(event.target.value)}/>
                  </label><br/><br/>
             <input type="button" name="Limpar"
                             value="Limpar"onClick={limpar} />
             <input type="submit" name="Cadastrar"
                             value="Cadastrar"/><br/><br/>
             <label>Resultado: {resultado} </label>
           </form></>
         );};
        function FrmExcluirCliente() {
             const { clienteId } = useParams();
             const [resultado, setResultado] = useState('');
             
             useEffect(() => {
              const excluirCliente = async () => {
               fetch(`${endereco_servidor}/cliente/${clienteId}`, 
                       {method : 'delete'}) 
               .then((response) => response.json())
               .then((data) => setResultado(data.message)); 
              };
              excluirCliente();
             }, [clienteId]);
             return (
              <div> 
               <label>Resultado: {resultado} </label>
              </div>
             );
            }
            function FrmListarCliente(){

                 const navigate = useNavigate();
                
                 const [clientes, setClientes] = useState([])
                 
                  // Renderiza a lista de clientes.
                 useEffect(() => { const getClientes = () => {
                   fetch(`${endereco_servidor}/cliente`)
                   .then(response => {return response.json()}) 
                   .then(data => {setClientes(data)}) 
                  };
                  getClientes();
                 }, []);
                 
                 return (
                     <div><h2>2 - Listar(Editar, Excluir)</h2> 
                     <div><table border='1'>
                     <thead>
                     <th>Id</th> <th>Nome</th> <th>CPF</th> <th>Editar</th> <th>Excluir</th>
                     </thead> 
                         <tbody>
                         {clientes.map(cliente => (
                         <tr>
                         <td> {cliente.clienteId} </td>
                         <td> {cliente.nome}</td>
                         <td> {cliente.cpf}</td>
                        <td> <button onClick={() =>
                     {navigate(`/frmcadastrocliente/${cliente.clienteId}`)}}>Editar</button>
                         </td> 
                         <td> <button onClick={() =>
                        {navigate(`/frmexcluircliente/${cliente.clienteId}`)}}>Excluir</button>
                      </td>
                      </tr>
                      ))}
                     </tbody>
                     </table><br/> </div></div>
                     );}
                     function MenuPrincipal() {
                          return ( 
                           <BrowserRouter>
                             <Routes>
                             <Route path='/' element={<Layout />}>
                             <Route path='frmcadastroCliente/:alterarId'
                                              element={<FrmCadastroCliente />} />
                             <Route path='frmexcluircliente/:clienteId'
                                              element={<FrmExcluirCliente />} />
                              <Route path='frmlistarcliente' 
                                              element={<FrmListarCliente />} /> 
                             <Route path='*' element={<NoPage />} />
                             </Route>
                             </Routes> 
                             </BrowserRouter> 
                          );
                         }
                         
                         export default MenuPrincipal;                           