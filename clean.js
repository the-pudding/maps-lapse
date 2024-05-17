import fs from "fs";
import * as turf from "@turf/turf";
import { Console } from "console";


export default async function cleanData(geo){
    fs.readFile(`open_maps_geojson/${geo}.json`, 'utf8', function (err, data) {
        if (err) throw err;

        console.log("opened file")
        let obj = JSON.parse(data);
    
        let allCourtCenters = [];
    
        for (let court of obj.features){
            let courtPoints = court.geometry.coordinates[0];
            var turfPoints = turf.points(courtPoints);
            var center = turf.center(turfPoints, {id:court.id});
            court.centerPoint = center;
            allCourtCenters.push(center)
        }
    
        let toDrop = [];
        for (let court of obj.features){
    
            let allCourtCentersFiltered = allCourtCenters.filter(d => {
                return d.id !== court.id && toDrop.indexOf(d.id) == -1;
            })
            var options = {units: 'meters'};
    
            var from = court.centerPoint;
            let tooClose = false;
            for (let to of allCourtCentersFiltered){
                var distance = turf.distance(from, to, options);
                if(distance < 100){
                    tooClose = true;
                }
            }
            if(tooClose){
                toDrop.push(court.id);
            }
    
            let courtProperties = Object.keys(court.properties);
            if(courtProperties.indexOf("indoor") > -1){
                if(court.properties.indoor == "room" || court.properties.indoor == "yes"){
                    toDrop.push(court.id);
                }
            }
        }
    
        obj.features = obj.features.filter(d => {
            return toDrop.indexOf(d.id) == -1;
        })
    
        fs.writeFile(`cleaned/${geo}.json`, JSON.stringify(obj), 'utf8', function(err){
            if (err) throw err
            console.log('File saved.')
        })
    
    });
}


