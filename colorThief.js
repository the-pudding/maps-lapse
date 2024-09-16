import ColorThief from "colorthief";
import {groups, color, hsl} from "d3";
import fs from "fs";
import Jimp from "jimp";


let filenames = ['court-test.jpeg'];

const rgbToHex = (r, g, b) => {
    const values = [r, g, b].map((value) => {
        const hex = value.toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
    });
    return `#${values.join('')}`;
};


async function getPallete(court){
    // path = "sammy.png"
    return new Promise(async (resolve, reject) => {
        const path = `../../../Volumes/My Passport/raw_images/${court.properties.geo}/google_way_${court.id}.png`
        const pathCropped = `../../../Volumes/My Passport/cropped/google_way_${court.id}.jpg`

        // const path = court;

        const sampleSize = 400;

        const image = await Jimp.read(path);
        const width = image.bitmap.width;
        const height = image.bitmap.height;

        const centerX = Math.floor(width / 2);
        const centerY = Math.floor(height / 2);
        
        let x = centerX - Math.floor(sampleSize / 2)
        let y = centerY - Math.floor(sampleSize / 2)

        image.crop(x, y, sampleSize, sampleSize);
        const croppedImagePath = pathCropped;
        await image.writeAsync(croppedImagePath);

        ColorThief
            .getColor(croppedImagePath)

            // .getPalette(croppedImagePath, 10)
            .then((output) => {
                let colorObj = color(`rgb(${output[0]}, ${output[1]}, ${output[2]})`);
                let hex = colorObj.formatHex();
                let hslColor = hsl(`rgb(${output[0]}, ${output[1]}, ${output[2]})`);

                
                // let hex = rgbToHex(r, g, b);
                // let hex = output.map(d => {
                //     return rgbToHex(d[0],d[1],d[2]);
                // })
                // console.log(hex.join(","))
                // console.log(hex)
                resolve({colors:hex,id:court.id,geo:court.properties.geo})
            });
    })
}



export default async function getColor(courts,state){
    console.log(state)
    // console.log(courts)
    let toOutput = [];
    
    //courts = filenames
    // courts = courts//.slice(0,10)

    let chunks = groups(courts, (d,i) => {
        return Math.floor(i/500);
    })


    for (let chunk of chunks){
        await Promise.all(chunk[1].map(async d => {
            // console.log(d)
            let color = await getPallete(d);
            toOutput.push(color)
        }));
    }

    // let toReturn = chunks.flat(1)
    // return toReturn;//console.log(toReturn)

    fs.writeFile(`color/${state}.json`, JSON.stringify(toOutput), 'utf8', function(err){
        if (err) throw err
        console.log('File saved.')
    })



}



  

// filenames.forEach((filename) => {
//     const promise = ColorThief
//       // When run in Node, this argument expects a path to the image.
//       // https://lokeshdhakar.com/projects/color-thief/#api
//       .getPalette(filename, 6)
//       // Returns RGB value in [Number, Number, Number] form
//       // https://lokeshdhakar.com/projects/color-thief/#api
//     //   .then(([r, g, b]) => (rgbToHex(r, g, b)));
//     promises.push(promise);
//   });

//   console.log(promises)


//   Promise.all(promises)
//   .then((values) => { 
//     console.log(values); 
//   });
