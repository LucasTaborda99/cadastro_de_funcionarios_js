// Função para abrir o modal
const openModal = () => document.getElementById('modal').classList.add('active')

// Função para limpar os campos do form no modal e fechar o modal
const closeModal = () => {
  clearFields()
  document.getElementById('modal').classList.remove('active')
}

// Temporário
// const tempFuncionario = {
//   nome: "Lucas Taborda",
//   setor: "TI",
//   email: "llucas352@gmail.com",
//   celular: "(41) 98537-8337",
//   cidade: "Curitiba",
// }

// CRUD - Create, Read, Update and Delete

// Enviar para o Local Storage
const setLocalStorage = (dbFuncionarios) => localStorage.setItem('db_funcionario', JSON.stringify(dbFuncionarios));

// Receber do Local Storage
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_funcionario')) ?? []

// CRUD - Create
const createFuncionario = (funcionario) => {
  const dbFuncionarios = getLocalStorage()
  dbFuncionarios.push(funcionario)
  setLocalStorage(dbFuncionarios)
}

// CRUD - Read
const readFuncionario = () => getLocalStorage()

// CRUD - Update
const updateFuncionario = (index, funcionario) => {
  const dbFuncionarios = readFuncionario()
  dbFuncionarios[index] = funcionario
  setLocalStorage(dbFuncionarios)
}

// CRUD - Delete
const deleteFuncionario = (index) => {
  const dbFuncionarios = readFuncionario()
  dbFuncionarios.splice(index, 1)
  setLocalStorage(dbFuncionarios)
}

// Interação com o Layout

// Valida se os campos do form estão todos preenchidos
const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

// Limpa os campos do form
const clearFields = () => {
  const fields = document.querySelectorAll('.modal-field')
  fields.forEach(field => field.value = '')
  document.getElementById('nome').dataset.index = 'new'
}

// Função para criar e salvar no funcionário
const saveFunc = () => {
  if (isValidFields()) {
    const funcionario = {
      nome: document.getElementById('nome').value,
      setor: document.getElementById('setor').value,
      email: document.getElementById('email').value,
      celular: document.getElementById('celular').value,
      cidade: document.getElementById('cidade').value
    }
    const index = document.getElementById('nome').dataset.index
    if(index == 'new') {
      createFuncionario(funcionario)
      closeModal()
      alert('Funcionário cadastrado com sucesso')
      updateTable()
    } else {
      updateFuncionario(index, funcionario)
      updateTable()
      closeModal()
    }
  }
}

// Função para cancelar a criação do novo funcionário no form, apagando os campos
const cancelFunc = () => {
  confirm('Você tem certeza que deseja cancelar ?') ? clearFields() : ''
}

// Função para criar uma linha na tabela
const createRow = (funcionario, index) => {
  const newRow = document.createElement('tr')
  newRow.innerHTML = `
    <td>${funcionario.nome}</td>
    <td>${funcionario.setor}</td>
    <td>${funcionario.email}</td>
    <td>${funcionario.celular}</td>
    <td>${funcionario.cidade}</td>
    <td>
        <button type="button" class="button green" id="edit-${index}">Editar</button>
        <button type="button" class="button red" id="delete-${index}">Excluir</button>
    </td>
  `
  document.querySelector('#tableFuncionario > tbody').appendChild(newRow)
}

// Função para limpar as linhas da tabela
const clearTable = () => {
  const rows = document.querySelectorAll('#tableFuncionario > tbody tr')
  rows.forEach(row => row.parentNode.removeChild(row))
}

// Função para atualizar a tabela com uma nova linha
const updateTable = () => {
  const dbFuncionarios = readFuncionario()
  clearTable()
  dbFuncionarios.forEach(createRow)
}
updateTable()

// Função para atualizar os campos da tabela
const fillFields = (funcionario) => {
  document.getElementById('nome').value = funcionario.nome
  document.getElementById('setor').value = funcionario.setor
  document.getElementById('email').value = funcionario.email
  document.getElementById('celular').value = funcionario.celular
  document.getElementById('cidade').value = funcionario.cidade
  document.getElementById('nome').dataset.index = funcionario.index
}

// Função para editar um funcionário
const editFuncionario = (index) => {
  const funcionario = readFuncionario()[index]
  funcionario.index = index
  fillFields(funcionario)
  openModal()
}

// Função nos botẽs para editar ou deletar
const editDelete = (event) => {
  if (event.target.type == 'button') {
    const [action, index] = event.target.id.split('-')
    console.log(action, index)
    if (action == 'edit') {
      editFuncionario(index)
    } else {
        const funcionario = readFuncionario()[index]
        const response = confirm(`Deseja realmente excluir o cliente ${funcionario.nome}`)
        if (response) {
          deleteFuncionario(index)
          updateTable()
        }
    }
  }
}

// Eventos
document.getElementById('cadastrarFuncionario').addEventListener('click', openModal)
document.getElementById('modalClose').addEventListener('click', closeModal)
document.getElementById('salvar').addEventListener('click', saveFunc)
document.getElementById('cancelar').addEventListener('click', cancelFunc)
document.querySelector('#tableFuncionario > tbody').addEventListener('click', editDelete)