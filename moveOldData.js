import fs from "fs";

let obj;

function getData(){
    return new Promise((resolve, reject) => {
        fs.readFile(`cleaned/MI.json`, 'utf8', function (err, data) {
            if (err) throw err;
            obj = JSON.parse(data);
            resolve();
        });
    })
}

// (async () => {
let ids = [];

await getData();
for(let court of obj.features){
    ids.push(+court.id);
}

console.log(obj.features.length)

function callback(){

}

// fs.readdir('../../../Volumes/My Passport/full', (err, files) => {
//     files.forEach(file => {
//         let id = file.replace("google_way_","").replace(".jpeg","");
//         if(ids.indexOf(+id) > 1){
//             fs.rename(`../../../Volumes/My Passport/full/${file}`, `../../../Volumes/My Passport/raw_images/NY/${file}`, callback)
//         }
//     });
// });