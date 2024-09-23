import sharp from "sharp";
import fs from "fs";
import { groups } from "d3";

let obj;


function getFile(geo,size){
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
        .withMetadata(false) // remove metadata
        // .sharpen()


        // .toFormat('webp', {
        //     quality: 100, // set quality for jpeg format (0-100)
        //     // mozjpeg: true // enable mozjpeg for better compression efficiency
        //     chromaSubsampling: '4:4:4' // use less chroma subsampling for better color quality
        // })
        // .toFile(`../../../Volumes/My Passport/tiles_${size}/${geo}/google_way_${id}.webp`);


        .toFormat('jpeg', {
            quality: 50, // set quality for jpeg format (0-100)
            mozjpeg: true, // enable mozjpeg for better compression efficiency
            chromaSubsampling: '4:4:4' // use less chroma subsampling for better color quality
        })
        .toFile(`../../../Volumes/My Passport/tiles/${geo}/google_way_${id}.jpg`);

    } catch (error) {
      console.log(error);
    }
}

function getExisting(geo,size){
    return new Promise((resolve, reject) => {

        fs.readdir(`../../../Volumes/My Passport/tiles_${size}/${geo}`, (err, files) => {
            resolve(files);
        });
    });
}

export default async function makeTinyTiles(geo,size){
    await getFile(geo,size);

    //for jpg
    if (!fs.existsSync(`../../../Volumes/My Passport/tiles/${geo}`)){
        fs.mkdirSync(`../../../Volumes/My Passport/tiles/${geo}`);
        console.log("made new path")
    }
    let existing = [];

    //for webp
    // if (!fs.existsSync(`../../../Volumes/My Passport/tiles_${size}/${geo}`)){
    //     fs.mkdirSync(`../../../Volumes/My Passport/tiles_${size}/${geo}`);
    //     console.log("made new path")
    // }

    // let existing = await getExisting(geo,size);

    

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