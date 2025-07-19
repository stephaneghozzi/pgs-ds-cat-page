---
toc: true
---

```js
const catalogues = FileAttachment("./data/catalogues.json").json();
```

# Catalogue

---

## Filters

```js
const branches = catalogues.map(d => d.branch);
const branchInput = Inputs.select(branches, {label: "Catalogue version"});
const branch = Generators.input(branchInput);
```
```js
const catalogue = catalogues.filter(d => d.branch == branch)[0].catalogue
```
```js
const pathogen_list = catalogue.map(x => x.pathogens).flat();
const searchInput = Inputs.search(
    catalogue, 
    {placeholder: "Search catalogue…", format: (d => "")}
);
const search = Generators.input(searchInput);
const date_fromInput = Inputs.date({label: "from"});
const date_from = Generators.input(date_fromInput);
const date_toInput = Inputs.date({label: "to"});
const date_to = Generators.input(date_toInput);
const pathogens_selectInput = Inputs.checkbox(
    pathogen_list, 
    {label: "Pathogens", unique: true, sort: true}
);
const pathogens_select = Generators.input(pathogens_selectInput);
```
<div class="grid grid-cols-3" style="grid-auto-rows: auto;">
<div class="card grid-colspan-3">${branchInput}</div>
<div class="card">${searchInput}</div>
<div class="card">
  ${date_fromInput}
  ${date_toInput}
</div>
<div class="card">${pathogens_selectInput}</div>
</div>

```js
const filtered_catalogue = search.filter(d => 
    (!date_from || d3.utcParse("%Y-%m-%d")(d.release_date) >= date_from) && 
    (!date_to || Date.parse(d.release_date) <= date_to) &&
    (pathogens_select.length == 0 || d.pathogens.some(p => pathogens_select.includes(p)))
);
```

${filtered_catalogue.length} ${(filtered_catalogue.length > 1 ? "entries" : "entry")}  found.

---

## Cards

<div class="grid grid-cols-2">
    ${filtered_catalogue.map(
        d => html`<div class="card">
            <h1>${d.name}</h1>
            <p>${d.pathogens.join(", ")}</p>
            <p style="color:grey">${d.release_date}</p>
            <p >${d.description}</p>
            <p>${d.links.map(
            x => htl.html`<a href="${x}">${x}</a><br>`
            )}</p>
        </div>`)}
</div>

---

## Table

```js
const table = Inputs.table(
    filtered_catalogue, 
    {
        select: false,
        format: {
            pathogens: x => x.join(", "),
            links: x => htl.html`${x.map(x => htl.html`<a href="${x}">${x}</a><br>`)}`
        }
    }
)
```

<div class="card">${table}</div>

---

## Data

### Original
```js
  display(catalogue)
```

### Filtered
```js
    display(filtered_catalogue)
```