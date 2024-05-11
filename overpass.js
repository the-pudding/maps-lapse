
import fetch from "node-fetch";
import fs from "fs";

let crosswalk = {
    
}

export default async function getOverpass(geo){
    console.log("hi")

    return new Promise(async (resolve, reject) => {

        console.log("overpass query")

        let overpass_query = `[out:json];area['ISO3166-2'='US-${geo}'];way(area)[leisure=pitch][sport=basketball];(._;>;);out;`
        let url = `http://overpass-api.de/api/interpreter?data=${overpass_query}`
        const json = await fetch(url).then(res => res.json())
        fs.writeFile(`open_maps_json/${geo}.json`, JSON.stringify(json), 'utf8', function(err){
            if (err) throw err
            console.log('File saved.')
            resolve();
        })
    })
}
