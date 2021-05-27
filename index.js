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

// forkCount: 0;
// languages: {
//   nodes: Array(1);
// }
// name: "Blockchain";
// pushedAt: "2020-03-17T19:20:18Z";
// stargazerCount: 0;
// url: "https://github.com/Funmi7/Blockchain";

// languages:
// nodes: Array(1)
// 0: {name: "Python"}

const username = "Funmi7";
const options = {
  method: "post",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer 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",
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

const appendData = (data) => {
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
