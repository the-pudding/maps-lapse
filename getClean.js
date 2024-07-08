import fs from "fs";
import * as turf from "@turf/turf";
import { groups } from "d3";
import fetch from "node-fetch";
let obj;

function getFile(geo){
    return new Promise((resolve, reject) => {
        fs.readFile(`cleaned/${geo}.json`, 'utf8', function (err, data) {
            if (err) throw err;
            obj = JSON.parse(data);
            resolve();
        });
    })
}

async function getImage(id,center,geo){
    return new Promise(async (resolve, reject) => {
        // console.log("grabbing",id)
        let key = "AIzaSyAcqwF9XAp9Jj4lWobw_86Qk3tTXwylchs";
        key = "AIzaSyBZwP7LnKmyNlJezialp_o-BlepoSzrA5k"
        key = "AIzaSyBc2OHaL9HYNxKJwepodR154y7kiA4UJto"
        let url = `https://maps.googleapis.com/maps/api/staticmap?center=${center[0][1]},${center[0][0]}&zoom=20&scale=2&size=640x640&maptype=satellite&format=png&key=${key}`;
		const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        // let path = `../../../Volumes/My Passport/raw_images/${geo}/google_way_${id}.png`
        let path = `../../../Volumes/My Passport/raw_images/${geo}/google_way_${id}.png`

        if (!fs.existsSync(`../../../Volumes/My Passport/raw_images/${geo}`)){
            fs.mkdirSync(`../../../Volumes/My Passport/raw_images/${geo}`);
            console.log("made new path")
        }

        fs.createWriteStream(path).write(buffer);
        // console.log("written",geo)
        resolve();
    })
}

function getExisting(geo){
    return new Promise((resolve, reject) => {

        if (!fs.existsSync(`../../../Volumes/My Passport/raw_images/${geo}`)){
            fs.mkdirSync(`../../../Volumes/My Passport/raw_images/${geo}`);
            // console.log("made new path")
        }

        fs.readdir(`../../../Volumes/My Passport/raw_images/${geo}`, (err, files) => {
            resolve(files);
        });
    });
}


export default async function getImages(geo){
    await getFile(geo);
    obj.features.forEach(d => {
        d.properties.geo = geo;
    })

    return obj.features;
}
