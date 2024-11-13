export const separateUserFromCommitsAndPulls = (inputArr = []) => {
  const authors = [];

  inputArr.forEach((input) => {
    const authorName =
      input.author?.login || input.commit?.author?.name || input.user?.login;

    const author = authors.find((name) => name === authorName);

    if (author) {
      author.count += 1;
    } else {
      authors.push({
        count: 1,
        name: authorName,
        id: input.author?.id || input.commit?.author?.email || input.user?.id,
      });
    }
  });

  return authors;
};

export const mergeCommitsAndPullsCount = (
  commits = [],
  pulls = [],
  issues = []
) => {
  const unifiedCounts = [];

  const updateOrAddUser = (arr, user, key) => {
    const existingUser = arr.find((u) => u.id === user.id);
    if (existingUser) {
      existingUser[key] = (existingUser[key] || 0) + user.count;
    } else {
      arr.push({ id: user.id, name: user.name, commits: 0, pulls: 0, issues: 0, [key]: user.count });
    }
  };

  commits.forEach((user) => updateOrAddUser(unifiedCounts, user, 'commits'));
  pulls.forEach((user) => updateOrAddUser(unifiedCounts, user, 'pulls'));
  issues.forEach((user) => updateOrAddUser(unifiedCounts, user, 'issues'));

  return unifiedCounts;
};
