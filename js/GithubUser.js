export class GithubUser {
  static search(username) { //<-- static é um tipo de declaração de variável (como const e let) que só funciona dentro de uma class
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint)
    .then(data => data.json())
    .then(({ login, name, public_repos, followers }) => ({
      login,
      name,
      public_repos,
      followers
    }))
  }
}
