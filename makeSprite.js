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

export default async function sprite(courts,chunk){
    return new Promise((resolve, reject) => {
        console.log(chunk)
        // if(chunk == 8){
    // let path = `../../../Volumes/My Passport/small/${geo}`
        let src = courts.map(d => {
            return `../../../Volumes/My Passport/small/${d.properties.geo}/google_way_${d.properties.id}.png`
        })//.slice(0,3510)

        console.log(src.slice(-1))

        Spritesmith.run({src: src}, function handleResult (err, result) {
            let ids = Object.keys(result.coordinates);
            let coords = result.coordinates;
            let forSave = [];
            for (let id of ids){
                let idClean = id.split("way_")[1].replace(".png","");
                let row = {id:idClean, coords: result.coordinates[id]};
                forSave.push(row);
            }
            fs.writeFile(`sprite_data/${chunk}.json`, JSON.stringify(forSave), 'utf8', function(err){
                if (err) throw err
                console.log('File saved.')
                resolve();
            })

            fs.writeFileSync(`../../../Volumes/My Passport/sprites/${chunk}.jpg`, result.image);
        });
        // } else {
        //     resolve()
        // }
    })

}