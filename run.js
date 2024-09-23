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
    'ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC','VI','GU'];
// states = []
let size = 600;
let formatImage = "jpg";

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


        //to get new courts data...
        // await getOverpass(state); //gets data from osm in json
        // await convert(state); //converts to geojson
        // await cleanData(state) //this creates a trimmed down version of OSM data that drops courts that are too close together
        
        // gets images for each court
        // await getImages(state);
        // await makeSmall(state,size); //set size to 64

        // ** needed to create new data files **
        let cleaned = await getClean(state);
        
        // get better address info for each court from osm — only need to run once. appends to one file
        // await geoCodeCourt(state,cleaned);

        // get color files — only need to run once
        // await getColor(cleaned,state);

        aggregation.push(cleaned); //** needed */

        // run once at 150 for webp and again at 600 for jpg
        // await makeTinyTiles(state,size); //these are smaller versions of the full files that are higher-res but not tiny for sprite sheets
    }
    
    let courts = aggregation.flat(1) //** needed */

    let tooSmallImages = await tooSmall(courts);

    courts = courts.filter((d,i) => {
        return tooSmallImages.indexOf(d.id) == -1
    });
    
    console.log("running chunks")

    //run at webp 150 and jpg (no size needed to be set) ** only need to do this once
    // await uploadToS3(courts,size,formatImage) //this only uploads the tiles — downsized version of full made in makeTinyTiles.js


    //for sprite image creation * run only once
    // let chunks = groups(courts, (d,i) => {
    //     return Math.floor(i/4096);
    // })    
    // run only once to create sprite images and sprite data files.
    // await Promise.all(chunks.map(async (d,i) => {
    //     await sprite(d[1],i);
    // }));
    //** move sprites to basis files with pvrtextool and place in assets folder of courts-2. 14.jpg is not 4096 since too few squares, so crop to 4096x4096 by hitting the crop button (with no arrow). sprite jpgs are in sprites folder
    // move all basis files to assets folder of courts-2

    await mungeData(courts);
    //puts file into /output/data.csv that you need to manually move to courts-2 assets folder.


    
})();