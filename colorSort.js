import Jimp from "jimp";
import {groups} from "d3";
async function getAverageColor(imagePath) {
    try {
        const image = await Jimp.read(imagePath);
        const width = image.bitmap.width;
        const height = image.bitmap.height;

        const centerX = Math.floor(width / 2);
        const centerY = Math.floor(height / 2);

        const sampleSize = 400; // You can adjust the sample size as needed
        let totalRed = 0, totalGreen = 0, totalBlue = 0, totalAlpha = 0;
        let count = 0;

        for (let x = centerX - Math.floor(sampleSize / 2); x < centerX + Math.ceil(sampleSize / 2); x++) {
            for (let y = centerY - Math.floor(sampleSize / 2); y < centerY + Math.ceil(sampleSize / 2); y++) {
                if (x >= 0 && x < width && y >= 0 && y < height) {
                    const pixelColor = Jimp.intToRGBA(image.getPixelColor(x, y));
                    totalRed += pixelColor.r;
                    totalGreen += pixelColor.g;
                    totalBlue += pixelColor.b;
                    totalAlpha += pixelColor.a;
                    count++;
                }
            }
        }

        const averageRed = totalRed / count;
        const averageGreen = totalGreen / count;
        const averageBlue = totalBlue / count;
        const averageAlpha = totalAlpha / count;

        return {
            r: Math.round(averageRed),
            g: Math.round(averageGreen),
            b: Math.round(averageBlue),
            a: Math.round(averageAlpha)
        };
    } catch (err) {
        console.error('Error processing the image:', err);
        return null;
    }
}

function rgbToHex(r, g, b) {
    return `${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

function getRow(court){
    return new Promise(async (resolve, reject) => {
        const path = `../../../Volumes/My Passport/raw_images/${court.properties.geo}/google_way_${court.id}.png`
        const averageColor = await getAverageColor(path);
        court.color = rgbToHex(averageColor.r, averageColor.g, averageColor.b);
        console.log(averageColor)
        resolve(court);
    })
}

export default async function getColor(courts,state){
    
    let toOutput = [];

    let chunks = groups(courts, (d,i) => {
        return Math.floor(i/500);
    })

    // console.log(chunks)

    for (let chunk of chunks){
        await Promise.all(chunk[1].map(async d => {
            let court = await getRow(d);
            toOutput.push(court)
        }));
        console.log("promise finished");
    }

    // // for(let court of courts){
    // // }
    // console.log(toOutput)
    // return toOutput;
}
    