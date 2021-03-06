async function main() {
    const res = await fetch("http://localhost:3000/get_templates");
    const data = await res.json();
    addFiles(data);
}

let divEle = document.getElementById("fetch_files");

if (divEle !== null) {
    main();
}

function addFiles(files) {
    files.forEach(file => {
        divEle.innerHTML += `
            <!-- <a href="http://localhost:3000/download/${file}" class="file">${file}</a> -->
            <a onclick="storeTemplate('${file}')" class="file">${file}</a>
            <hr class="hr-mod">
        `;
    });
}

let fields = null

async function storeTemplate(file) {
    let { remote } = require('electron');
    const store = remote.getGlobal("store")(`http://localhost:3000/download/${file}`, file);
    remote.getGlobal("setFilename")(__dirname + "\\templates\\" + file)
    document.location = __dirname + "/template-data-fields.html"
}