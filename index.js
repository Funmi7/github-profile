const profileContainer = document.querySelector("#profile-details-container");
const form = document.querySelector(".input-section");

const getProfileDetails = (username) =>
  `{
    repositoryOwner(login: "${username}"){
    ... on User{
      bio
      avatarUrl
    }
  }
    user(login: "${username}"){
      repositories(last: 20){
      nodes{
        name
        forkCount
        url
        languages(first: 1){
          nodes{
            name
          }
        }
        pushedAt
        stargazerCount
      }
    }
  }
}`;

const myToken = config.GITHUB_ACCESS_TOKEN;
// const username = "Funmi7";
const loadProfileData = (e) => {
  e.preventDefault();
  const username = form.elements["search"].value;
  const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${myToken}`,
    },
    body: JSON.stringify({
      query: getProfileDetails(username),
    }),
  };
  fetch(`https://api.github.com/graphql`, options)
    .then((res) => res.json())
    // .then((data) => console.log(data.data))
    .then((data) => appendData(data.data))
    .catch((error) => console.log(error.error));

  form.reset();
};

form.addEventListener("submit", loadProfileData);

const appendData = (data) => {
  while (profileContainer.firstChild) {
    profileContainer.removeChild(profileContainer.firstChild);
  }
  const bio = document.createElement("div");
  const avatar = document.createElement("img");
  const repoCards = document.createElement("div");
  const repoFragment = document.createDocumentFragment();
  bio.textContent = data.repositoryOwner.bio;
  avatar.setAttribute("src", data.repositoryOwner.avatarUrl);

  profileContainer.appendChild(bio);
  profileContainer.appendChild(avatar);

  // console.log(data.user.repositories.nodes);
  data.user.repositories.nodes.forEach((repo) => {
    const forkCount = document.createElement("p");
    const repoName = document.createElement("a");
    const updatedAt = document.createElement("p");
    const favouriteCount = document.createElement("p");
    // const mainLan = document.createElement("p");

    forkCount.textContent = repo.forkCount;
    repoName.textContent = repo.name;
    updatedAt.textContent = repo.pushedAt;
    favouriteCount.textContent = repo.stargazerCount;
    repoName.href = repo.url;
    // mainLan.textContent = mainLanguageA || "nothing";

    repo.languages.nodes.forEach((lang) => {
      const mainLan = document.createElement("p");
      mainLan.textContent = lang.name;
      repoCards.appendChild(mainLan);
    });
    repoCards.appendChild(forkCount);
    repoCards.appendChild(repoName);
    repoCards.appendChild(updatedAt);
    repoCards.appendChild(favouriteCount);
  });

  repoFragment.appendChild(repoCards);
  profileContainer.appendChild(repoFragment);
};
