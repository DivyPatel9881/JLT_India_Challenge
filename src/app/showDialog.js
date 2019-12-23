let {dialog} = require("electron").remote

console.log("hello")

let selectFileButton = document.querySelector("#select-file")

console.log(selectFileButton)

selectFileButton.addEventListener("click",function(){
    dialog.showOpenDialog({
        filters:[{
            name:"CSV FILE",
            extensions:["csv"]
        }]
    }).then(function(csvFile){
        if(csvFile === undefined){
            alert("No file was selected")
            return
        }
        else{
            let file_str = JSON.stringify(csvFile.filePaths)
            // console.log(JSON.stringify(csvFile.filePaths))
            console.log(file_str)
            let filepath = file_str.slice(2,file_str.length-2)
            let str_arr = filepath.split("\\")
            let filename = str_arr[str_arr.length-1]
            alert(filename + " has been selected to generate the output documents.")

            let { remote } = require("electron")
            let file = remote.getGlobal("getFilename")()
            remote.getGlobal("setFilename")(null)

            console.log(__dirname + "/templates/" + file, filepath)
            
            let python = require('child_process').spawn('python', [__dirname + "/../python/doc_assist.py", __dirname + "/templates/" + file, filepath]);
            // let python = require('child_process').spawn('python37', [__dirname + "\\..\\python\\doc_assist.py", __dirname + "\\templates\\" + file, userDataStr]);
            python.on('error', (error) => {
                dialog.showMessageBox({
                    title: 'Title',
                    type: 'warning',
                    message: 'Error occured.\r\n' + error
                });
            });

            python.stdout.on('data', function (dump) {
                dump = dump.toString('utf8')
                let status = String(dump).substr(0, dump.indexOf("\n")).trim();
                console.log(status);
                let data = dump.substring(dump.indexOf("\n") + 1).trim();
                if (status == "True") {
                    alert("The files are generated");
                } else {
                    alert("Error: " + data);
                }
            })

            python.stderr.on('data', (data) => {
                console.error(data.toString());
            });

            python.on('exit', (code) => {
                console.log(`Process exited with code ${code}`);
            });

        }
    })
})