import cleanData from "./clean.js";
import convert from "./jsonToGeojson.js";
import getOverpass from "./overpass.js"
import sprite from "./makeSprite.js";
import makeSmall from "./makeSmall.js";
import getImages from "./getImages.js";
import getClean from "./getClean.js";
import tooSmall from "./tooSmall.js";
import { groups } from "d3";
import mungeData from "./mungeData.js";
import uploadToS3 from "./uploadToS3.js";
import makeTinyTiles from "./makeTinyTiles.js";
import geoCodeCourt from "./geoCodeCourt.js";
import getColor from "./colorThief.js"

let states = [
    'PR','AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI',
    'ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
// states = ['AK']
let size = 150;
let formatImage = "webp";

//regenerate data csv
// let aggregation = [];
// for (let state of states){
// let cleaned = await getClean(state);
// aggregation.push(cleaned)
// }
// let courts = aggregation.flat(1);
// let chunks = groups(courts, (d,i) => {
//     return Math.floor(i/4096);
// })

// await mungeData(courts);

(async () => {

    let aggregation = [];
    for (let state of states){
        // await getOverpass(state);
        // await convert(state);
        // await cleanData(state)

        // await getImages(state);
        // await makeSmall(state,size);

        let cleaned = await getClean(state);
        
        // await geoCodeCourt(state,cleaned);
        // await getColor(cleaned,state);

        aggregation.push(cleaned); //** needed */
        // await makeTinyTiles(state,size); //these are smaller versions of the full files that are higher-res but not tiny for sprite sheets
    }
    
    let courts = aggregation.flat(1) //** needed */

    let tooSmallImages = await tooSmall(courts);

    courts = courts.filter((d,i) => {
        return tooSmallImages.indexOf(d.id) == -1
    });
    
    // console.log("running chunks")
    // await uploadToS3(courts,size,formatImage) //this only uploads the tiles — downsized version of full made in makeTinyTiles.js

    let chunks = groups(courts, (d,i) => {
        return Math.floor(i/4096);
    })

    

    await Promise.all(chunks.map(async (d,i) => {
        // for(let chunk in chunks){
            await sprite(d[1],i);
        // }
    }));

    await mungeData(courts);

    //move sprites to basis files with pvrtextool and place in assets folder of courts-2. 14.jpg is not 4096 since too few squares, so crop to 4096x4096
})();