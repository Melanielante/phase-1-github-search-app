document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('github-form');
  const searchInput = document.getElementById('search');
  const searchType = document.getElementById('search-type');
  const userList = document.getElementById('user-list');
  const reposList = document.getElementById('repos-list');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    const type = searchType.value;

    // Clear previous results
    userList.innerHTML = '';
    reposList.innerHTML = '';

    if (query === '') {
      alert('Please enter a search term.');
      return;
    }

    if (type === 'user') {
      fetchUsers(query);
    } else {
      fetchReposByKeyword(query);
    }
  });

  // -- USER SEARCH --
  function fetchUsers(query) {
    fetch(`https://api.github.com/search/users?q=${query}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    })
      .then(res => res.json())
      .then(data => displayUsers(data.items))
      .catch(err => console.error('User fetch error:', err));
  }

  function displayUsers(users) {
    if (users.length === 0) {
      userList.innerHTML = '<li>No users found.</li>';
      return;
    }

    users.forEach(user => {
      const li = document.createElement('li');

      li.innerHTML = `
        <img src="${user.avatar_url}" width="80" style="border-radius: 50%">
        <p><strong>${user.login}</strong></p>
        <a href="${user.html_url}" target="_blank">View Profile</a>
      `;

      li.addEventListener('click', () => {
        fetchUserRepos(user.login);
      });

      userList.appendChild(li);
    });
  }

  function fetchUserRepos(username) {
    reposList.innerHTML = `<li>Loading ${username}'s repos...</li>`;

    fetch(`https://api.github.com/users/${username}/repos`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    })
      .then(res => res.json())
      .then(repos => {
        reposList.innerHTML = '';
        if (repos.length === 0) {
          reposList.innerHTML = `<li>No repos found for ${username}.</li>`;
          return;
        }

        repos.forEach(repo => {
          const li = document.createElement('li');
          li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
          reposList.appendChild(li);
        });
      })
      .catch(err => {
        reposList.innerHTML = `<li>Failed to fetch repos.</li>`;
        console.error('Repo fetch error:', err);
      });
  }

  // -- REPO KEYWORD SEARCH --
  function fetchReposByKeyword(query) {
    fetch(`https://api.github.com/search/repositories?q=${query}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    })
      .then(res => res.json())
      .then(data => displayRepoSearchResults(data.items))
      .catch(err => console.error('Repo search error:', err));
  }

  function displayRepoSearchResults(repos) {
    if (repos.length === 0) {
      reposList.innerHTML = '<li>No repositories found.</li>';
      return;
    }

    repos.forEach(repo => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${repo.name}</strong> by ${repo.owner.login} <br/>
        ⭐ ${repo.stargazers_count} <br/>
        <a href="${repo.html_url}" target="_blank">View Repo</a>
      `;
      reposList.appendChild(li);
    });
  }
});
