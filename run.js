import cleanData from "./clean.js";
import convert from "./jsonToGeojson.js";
import getOverpass from "./overpass.js"
import sprite from "./makeSprite.js";
import makeSmall from "./makeSmall.js";
import getImages from "./getImages.js";
import getClean from "./getClean.js";


let states = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];
states = ['PR']
let size = 64;

(async () => {

    let aggregation = [];
    for (let state of states){
        // await getOverpass(state);
        // await convert(state);
        // await cleanData(state)

        // await getImages(state);
        await makeSmall(state,size);
        // await sprite(state);
        // let cleaned = await getClean(state);
        // console.log(state,cleaned.length)
        // aggregation.push(cleaned);
    }
    // console.log(states.length)
    console.log(aggregation.flat(1).length)
})();