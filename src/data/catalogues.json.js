
async function json_ok(url) {
  const response = await fetch(url);
    return await response.ok;
}

async function json(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`fetch failed: ${response.status}`);
    return await response.json();
}

const branches_gh = await json("https://api.github.com/repos/stephaneghozzi/pgs-ds-cat-data/branches");
const branches = branches_gh.map(d => d.name);
const branches_ok = [];
for (let i = 0; i < branches.length; i++) {
  branches_ok.push(await json_ok(`https://raw.githubusercontent.com/stephaneghozzi/pgs-ds-cat-data/refs/heads/${branches[i]}/catalogue.json`))
}

const catalogue = [];
let j = 0;
for (let i = 0; i < branches.length; i++) {
  if (branches_ok[i]) {
    catalogue[j] = {
      branch: branches[i],
      catalogue: await json(`https://raw.githubusercontent.com/stephaneghozzi/pgs-ds-cat-data/refs/heads/${branches[i]}/catalogue.json`)
    };
    j++;
  }
}

process.stdout.write(JSON.stringify(catalogue));
