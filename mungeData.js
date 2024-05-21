import fs from "fs";
import { index } from "d3";
import converter from 'json-2-csv';

function getFiles(){
    return new Promise((resolve, reject) => {
        fs.readdir(`sprite_data/`, (err, files) => {
            resolve(files);
        })
    })
}

function readFile(file){
    return new Promise((resolve, reject) => {
        fs.readFile(`sprite_data/${file}`, 'utf8', function (err, data) {
            if (err) throw err;
            let obj = JSON.parse(data);
            resolve(obj);
        });
    })
}

export default async function mungeData(courts){
    // courts
    let files = await getFiles();
    let output = [];
    for (let file of files){{
        let obj = await readFile(file);
        obj.forEach(d => {
            d.chunk = file.replace(".json","");
        })
        output.push(obj);
    }}
    output = output.flat(1);
    let courtsLookup = index(courts, d => +d.id);
    output.forEach(d => {
        let center = courtsLookup.get(+d.id).centerPoint.geometry.coordinates;
        center = center.map(d => {
            let round = Math.round(d*100)/100;
            return round;
        })
        d.center = center.join(",");
        d.x = d.coords.x;
        d.y = d.coords.y;
        d.chunk = +d.chunk;
        d.id = +d.id;
        delete d.coords;
    })

    const csv = converter.json2csv(output);

    fs.writeFile('output/data.csv', csv, 'utf8', function (err) {
        if (err) {
          console.log('Some error occured - file either not saved or corrupted file saved.');
        } else{
          console.log('It\'s saved!');
        }
      });
      
}
