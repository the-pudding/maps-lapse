import fs from "fs";
import Spritesmith from "spritesmith";

function getSrc(geo){
    return new Promise((resolve, reject) => {

        fs.readdir(`../../../Volumes/My Passport/raw_images/${geo}`, (err, files) => {
            let filesToSend = files.slice(0,10).map(file => {
                return `../../../Volumes/My Passport/raw_images/${geo}/${file}`
            });
            resolve(filesToSend);
        });
    });
}

export default async function sprite(geo){
    let src = await getSrc(geo);
    // let src = ['google_way_51968234.jpeg']
    Spritesmith.run({src: src}, function handleResult (err, result) {

        let ids = Object.keys(result.coordinates);
        let coords = result.coordinates;
        let forSave = [];
        for (let id of ids){
            let idClean = id.split("way_")[1].replace(".jpeg","");
            let row = {id:idClean, coords: result.coordinates[id]};
            forSave.push(row);
        }
        fs.writeFile(`sprite_data/${geo}.json`, JSON.stringify(forSave), 'utf8', function(err){
            if (err) throw err
            console.log('File saved.')
        })

        fs.writeFileSync(`sprite_images/${geo}.jpg`, result.image);
    });

}