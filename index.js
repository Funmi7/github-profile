const profileContainer = document.querySelector("#profile-details-container");
const form = document.querySelector(".input-section");

const getProfileDetails = (username) =>
  `{
    repositoryOwner(login: "${username}"){
      login
    ... on User{
      bio
      avatarUrl
    }
    ... on ProfileOwner{
      name
    }
  }
    user(login: "${username}"){
      repositories(last: 20){
      nodes{
        name
        forkCount
        url
        shortDescriptionHTML
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
  const leftSegment = document.createElement("div");
  const userName = document.createElement("p");
  const fullName = document.createElement("h2");
  const bio = document.createElement("p");
  const avaterContainer = document.createElement("div");
  const avatar = document.createElement("img");
  const rightSegment = document.createElement("section");

  bio.textContent = data.repositoryOwner.bio;
  avatar.setAttribute("src", data.repositoryOwner.avatarUrl);
  fullName.textContent = data.repositoryOwner.name;
  userName.textContent = data.repositoryOwner.login;

  avaterContainer.appendChild(avatar);
  leftSegment.appendChild(avaterContainer);
  leftSegment.appendChild(fullName);
  leftSegment.appendChild(userName);
  leftSegment.appendChild(bio);
  profileContainer.appendChild(leftSegment);

  leftSegment.classList.add("left-segment");
  avaterContainer.classList.add("image-container");
  userName.classList.add("username-text");
  data.user.repositories.nodes.forEach((repo) => {
    const repoCards = document.createElement("div");
    const lowerCardContent = document.createElement("div");
    const forkCount = document.createElement("p");
    const repoName = document.createElement("a");
    const updatedAt = document.createElement("p");
    const favouriteCount = document.createElement("p");
    const description = document.createElement("p");
    const mainLan = document.createElement("p");
    const languageColor = document.createElement("p");

    forkCount.textContent = repo.forkCount;
    repoName.textContent = repo.name;
    updatedAt.textContent = repo.pushedAt;
    favouriteCount.textContent = repo.stargazerCount;
    repoName.href = repo.url;
    description.textContent = repo.shortDescriptionHTML;

    // mainLan.textContent = mainLanguageA || "nothing";

    repoCards.appendChild(repoName);
    repoCards.appendChild(description);
    lowerCardContent.appendChild(languageColor);
    repo.languages.nodes.forEach((lang) => {
      mainLan.textContent = lang.name;
      lowerCardContent.appendChild(mainLan);
    });
    lowerCardContent.appendChild(favouriteCount);
    lowerCardContent.appendChild(forkCount);
    lowerCardContent.appendChild(updatedAt);

    repoCards.appendChild(lowerCardContent);
    rightSegment.appendChild(repoCards);

    languageColor.classList.add("language-color");
    const languageText = mainLan.innerHTML;

    console.log(languageText);
    if (languageText === "HTML") {
      languageColor.style.backgroundColor = "#e34c26";
    } else if (languageText === "JavaScript") {
      languageColor.style.backgroundColor = "#f1e05a";
    } else if (languageText === "CSS") {
      languageColor.style.backgroundColor = "#563d7c";
    } else if (languageText === "Python") {
      languageColor.style.backgroundColor = "#3572a5";
    }

    repoCards.classList.add("repo-card");
    lowerCardContent.classList.add("lower-card-content");
  });

  // rightSegment.appendChild(repoContainer);
  profileContainer.appendChild(rightSegment);

  rightSegment.classList.add("right-segment");
};
