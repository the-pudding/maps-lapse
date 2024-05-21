import cleanData from "./clean.js";
import convert from "./jsonToGeojson.js";
import getOverpass from "./overpass.js"
import sprite from "./makeSprite.js";
import makeSmall from "./makeSmall.js";
import getImages from "./getImages.js";
import getClean from "./getClean.js";
import { groups } from "d3";
import mungeData from "./mungeData.js";
import uploadToS3 from "./uploadToS3.js";
import makeTinyTiles from "./makeTinyTiles.js";

let states = ['PR','AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
// states = ['ME']
let size = 600;

(async () => {

    let aggregation = [];
    for (let state of states){
        // await getOverpass(state);
        // await convert(state);
        // await cleanData(state)

        // await getImages(state);
        // await makeSmall(state,size);
        let cleaned = await getClean(state);
        aggregation.push(cleaned);
        // await makeTinyTiles(state,size);
    }
    
    let courts = aggregation.flat(1);
    await uploadToS3(courts)

    // let chunks = groups(courts, (d,i) => {
    //     return Math.floor(i/4096);
    // })

    // // await Promise.all(chunks.slice(6,7).map(async (d,i) => {
    // for(let chunk in chunks){
    //     await sprite(chunks[chunk][1],chunk);
    // }
        
    // }));

    // await mungeData(courts);
})();