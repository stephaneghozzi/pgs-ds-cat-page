
async function json_ok(url) {
  const response = await fetch(url);
    return await response.ok;
}

async function json(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
    return await response.json();
}

const repo = "pgs-ds-cat-data";
const owner = "stephaneghozzi";
const cat_file = "catalogue.json";

const branches_gh = await json(
  `https://api.github.com/repos/${owner}/${repo}/branches`
);
const branches = branches_gh.map(d => d.name);
const branches_ok = [];
for (let i = 0; i < branches.length; i++) {
  branches_ok.push(
    await json_ok(
      `https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/${branches[i]}/${cat_file}`
    )
  )
}

const catalogue = [];
let j = 0;
for (let i = 0; i < branches.length; i++) {
  if (branches_ok[i]) {
    catalogue[j] = {
      branch: branches[i],
      catalogue: await json(
        `https://raw.githubusercontent.com/${owner}/${repo}/refs/heads/${branches[i]}/${cat_file}`
      )
    };
    j++;
  }
}

process.stdout.write(JSON.stringify(catalogue));
