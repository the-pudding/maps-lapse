import fs from "fs";
import { index, groups } from "d3";
import converter from 'json-2-csv';
import unidecode from "unidecode";

function getFiles(){
    return new Promise((resolve, reject) => {
        fs.readdir(`sprite_data/`, (err, files) => {
            resolve(files);
        })
    })
}

function getColors(){
    return new Promise((resolve, reject) => {
        fs.readdir(`color/`, (err, files) => {
            resolve(files);
        })
    })
}

function readColor(file){
    return new Promise((resolve, reject) => {
        fs.readFile(`color/${file}`, 'utf8', function (err, data) {
            if (err) throw err;
            let obj = JSON.parse(data);
            resolve(obj);
        });
    })
}

function readAddresses(){
    return new Promise((resolve, reject) => {
        fs.readFile(`geocoded_results.json`, 'utf8', function (err, data) {
            if (err) throw err;
            let obj = JSON.parse(data);
            resolve(obj);
        });
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

    let addresses = await readAddresses()
    let locations = [];
    for (let address of addresses){
        let loc = null;
        let geos = Object.keys(address["address"]);
        if(geos.indexOf("city") > -1){
            loc = address["address"].city;
        }
        else if(geos.indexOf("town") > -1) {
            loc = address["address"].town;
        }
        else if(geos.indexOf("municipality") > -1) {
            loc = address["address"].municipality;
        }
        else if(geos.indexOf("village") > -1) {
            loc = address["address"].village;
        }
        else if(geos.indexOf("hamlet") > -1) {
            loc = address["address"].hamlet;
        }
        else if(geos.indexOf("city_district") > -1) {
            loc = address["address"].city_district;
        }
        else if(geos.indexOf("suburb") > -1) {
            loc = address["address"].suburb;
        }
        else if(geos.indexOf("neighbourhood") > -1) {
            loc = address["address"].neighbourhood;
        }
        else if(geos.indexOf("county") > -1) {
            loc = address["address"].county;
        }
        else {
            loc = address["address"].road;
        }
        
        loc = unidecode(loc);
        
        locations.push([address.id,loc])
    }
    let locLookup = index(locations, d => d[0]);
    // let locGroups = groups(locations, d => d[1])
    // console.log(locGroups.map(d => d[1].length).sort((a,b) => b-a))

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


    let colorFiles = await getColors();


    let colorOutput = [];
    for (let file of colorFiles){{
        let obj = await readColor(file);

        console.log(obj)
        obj.forEach(d => {
            d.chunk = file.replace(".json","");
        })
        colorOutput.push(obj);
    }}
    colorOutput = colorOutput.flat(1)

    let courtsColorLookup = index(colorOutput, d => +d.id);

    let courtsLookup = index(courts, d => +d.id);

    output.forEach((d,i) => {
        
        let lookup = courtsLookup.get(+d.id);
        let colorLookup = courtsColorLookup.get(+d.id).colors;

        let center = lookup.centerPoint.geometry.coordinates;
        center = center.map(d => {
            let round = Math.round(d*10000)/10000;
            return round;
        })
        d.location = locLookup.get(+d.id)[1];
        d.color = colorLookup;
        
        // con
        d.center = center.join(",");
        d.x = d.coords.x;
        d.state = courtsLookup.get(+d.id).properties.geo;
        d.y = d.coords.y;
        d.geo = +d.chunk;
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
