import fs from "fs";

let obj;

function getFile(geo){
    return new Promise((resolve, reject) => {
        fs.readFile(`open_maps_json/${geo}.json`, 'utf8', function (err, data) {
            if (err) throw err;
            obj = JSON.parse(data);
            resolve();
        });
    })
}

export default async function convert(geo){
    await getFile(geo);

    let geojson = {
        "type": "FeatureCollection",
        "generator": "overpass-turbo",
        "copyright": "The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.",
        "timestamp": "2024-05-10T20:00:57Z",
        "features": []
    }

    let nodeLookup = {};
    let nodes = obj["elements"].filter(d => d.type == "node");
    let ways = obj["elements"].filter(d => d.type == "way");

    for (let node of nodes){
        nodeLookup[node.id] = node;
    }

    console.log(geo,ways.length)
    
    for (let way of ways){

        let feature = {
            "type": "Feature",
            "properties": {
            //   "@id": "way/181379127",
            //   "leisure": "pitch",
            //   "source": "Bing",
            //   "sport": "basketball"
            },
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                []
              ]
            },
            "id": ""
        }


        let newNodeArray = [];
        for(let node of way.nodes){
            let cross = nodeLookup[node];
            let coor = [cross.lon,cross.lat];
            newNodeArray.push(coor);
        }
        feature.geometry.coordinates[0] = newNodeArray;
        feature.id = way.id;
        feature.properties = way.tags;
        feature.properties.id = way.id;
        geojson.features.push(feature);
    }

    fs.writeFileSync(`open_maps_geojson/${geo}.json`, JSON.stringify(geojson), 'utf8', function(err){
        if (err) throw err
        console.log('File saved.')
    })  
}


