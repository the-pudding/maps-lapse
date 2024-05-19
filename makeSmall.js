import sharp from "sharp";
import fs from "fs";
import { groups } from "d3";

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

async function resizeImage(id,size,geo) {
    console.log(id)
    try {
      await sharp(`../../../Volumes/My Passport/raw_images/${geo}/google_way_${id}.png`)
        .resize({
          width: size,
          height: size
        })
        .toFile(`../../../Volumes/My Passport/small/${geo}/google_way_${id}.png`);
    } catch (error) {
      console.log(error);
    }
}

function getExisting(geo){
    return new Promise((resolve, reject) => {

        fs.readdir(`../../../Volumes/My Passport/small/${geo}`, (err, files) => {
            resolve(files);
        });
    });
}

export default async function makeSmall(geo,size){
    await getFile(geo);

    if (!fs.existsSync(`../../../Volumes/My Passport/small/${geo}`)){
        fs.mkdirSync(`../../../Volumes/My Passport/small/${geo}`);
        console.log("made new path")
    }

    let existing = await getExisting(geo);
    existing = existing.filter(d => {
        return d.slice(-3) == "png";// || d.slice(-4) == "jpeg" || d.slice(-3) == "jpg"
    }).map(d => {
        return +d.split("way_")[1].split(".")[0];
    });

    console.log(existing.length)



    let toGetImage = obj.features.filter(d => {
        return existing.indexOf(+d.id) == -1
    });

    console.log(toGetImage.length)

    let chunks = groups(toGetImage, (d,i) => {
        return Math.floor(i/20);
    })

    for (let chunk of chunks){
        await Promise.all(chunk[1].map(async d => {
            let id = d.id;
            await resizeImage(id,size,geo);
        }));
        console.log("promise finished");
    }

}