import { GithubUser } from "./GithubUser.js"

// classe que vai conter a lógica dos dados
// como os dados serão estruturados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.userList = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.userList))
  }

  async tryadd(username) {
    try {

      const userExists = this.userList.find(anyname => anyname.login.toLowerCase() === username.toLowerCase())

      if(userExists) {
        throw new Error('Usuário já cadastrado')
      }


      const user = await GithubUser.search(username)

      if(user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.userList = [user, ...this.userList]
      this.update()
      this.save()

    } catch(error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredUserList = this.userList
      .filter(anyname => anyname.login !== user.login)

    this.userList = filteredUserList
    this.update()
    this.save()
  }
}

// classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.loadAddBtn()
  }

  loadAddBtn() {
    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const { value } = this.root.querySelector('.search input')

      this.tryadd(value)
    }
  }

  update() {
    this.removeAllTr()

    if (this.userList.length === 0) {
      this.tbody.append(this.createRow2())
    }

    this.userList.forEach( user => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = `/${user.login}`
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')
        if(isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td class="user">
        <img src="" alt="">
        <a href="" target="_blank">
          <p></p>
          <span></span>
        </a>
      </td>
      <td class="repositories">
        
      </td>
      <td class="followers">
        
      </td>
      <td>
        <button class="remove">Remover</button>
      </td>
    `

    return tr
  }

  createRow2() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td colspan="4">
          <div class="empty">
          <svg width="57" height="54" viewBox="0 0 57 54" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M46.1688 37.4625C45.8838 35.8101 46.4367 34.1253 47.6537 32.9562L55.4372 25.4691C58.4981 22.5234 56.808 17.3907 52.5786 16.7832L41.8225 15.2415C40.141 15.0012 38.6875 13.959 37.9379 12.4551L33.1271 2.83769C32.1808 0.944986 30.3397 0 28.4986 0C26.6603 0 24.8192 0.944986 23.873 2.83769L19.0621 12.4551C18.3125 13.959 16.859 15.0012 15.1775 15.2415L4.42142 16.7832C0.19196 17.3907 -1.49812 22.5234 1.56282 25.4691L9.34629 32.9562C10.5633 34.1253 11.1162 35.8101 10.8312 37.4625L8.99289 48.0357C8.42003 51.327 11.0706 54 14.0774 54C14.8697 54 15.6876 53.8137 16.4799 53.4033L26.0988 48.411C26.8513 48.0222 27.6749 47.8278 28.4986 47.8278C29.3251 47.8278 30.1488 48.0222 30.9012 48.411L40.5201 53.4033C41.3124 53.8137 42.1303 54 42.9226 54C45.9294 54 48.58 51.327 48.0071 48.0357L46.1688 37.4625ZM28.5095 26.3451H30.5347V18.4195H28.5095V26.3451ZM24.6722 26.3451H26.6974V18.4195H24.6722V26.3451ZM27.9854 39.3247H28.5983C29.5872 39.3247 30.4696 39.1892 31.2453 38.9183C32.027 38.6532 32.6932 38.2762 33.2439 37.7873C33.7946 37.3043 34.215 36.727 34.5052 36.0555C34.7954 35.3899 34.9405 34.6506 34.9405 33.8377C34.9405 33.0307 34.7954 32.2915 34.5052 31.62C34.215 30.9544 33.7946 30.3771 33.2439 29.8882C32.6932 29.4052 32.027 29.0311 31.2453 28.7661C30.4696 28.501 29.5872 28.3684 28.5983 28.3684H27.9854C27.0024 28.3684 26.1201 28.501 25.3384 28.7661C24.5567 29.037 23.8905 29.417 23.3398 29.9059C22.795 30.3948 22.3775 30.972 22.0874 31.6377C21.7972 32.3092 21.6521 33.0484 21.6521 33.8554C21.6521 34.6683 21.7972 35.4075 22.0874 36.0732C22.3775 36.7447 22.795 37.3219 23.3398 37.805C23.8905 38.288 24.5567 38.662 25.3384 38.9271C26.1201 39.1922 27.0024 39.3247 27.9854 39.3247ZM28.6161 36.6475H27.9854C27.3044 36.6475 26.7004 36.5856 26.1734 36.4619C25.6523 36.3382 25.2111 36.1586 24.8499 35.923C24.4946 35.6873 24.2251 35.3958 24.0415 35.0482C23.858 34.7007 23.7662 34.3031 23.7662 33.8554C23.7662 33.4077 23.858 33.0101 24.0415 32.6626C24.2251 32.3151 24.4946 32.0205 24.8499 31.779C25.2111 31.5375 25.6523 31.3549 26.1734 31.2312C26.7004 31.1075 27.3044 31.0457 27.9854 31.0457H28.6161C29.303 31.0457 29.907 31.1075 30.4281 31.2312C30.9492 31.3549 31.3874 31.5346 31.7427 31.7702C32.098 32.0117 32.3645 32.3033 32.5422 32.6449C32.7257 32.9925 32.8175 33.3901 32.8175 33.8377C32.8175 34.2854 32.7257 34.683 32.5422 35.0306C32.3645 35.3781 32.098 35.6726 31.7427 35.9141C31.3874 36.1556 30.9492 36.3382 30.4281 36.4619C29.907 36.5856 29.303 36.6475 28.6161 36.6475Z" fill="#4E5455"/>
          </svg>
          Nenhum favorito ainda
        </div>
      </td>
    `

    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr')
      .forEach((tr) => {
        tr.remove()
      })  
  }
}