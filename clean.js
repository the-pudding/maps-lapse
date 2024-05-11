import fs from "fs";
import * as turf from "@turf/turf";
import { Console } from "console";

fs.readFile(`open_maps_geojson/AZ.json`, 'utf8', function (err, data) {
    if (err) throw err;
    let obj = JSON.parse(data);

    let allCourtCenters = [];

    for (let court of obj.features){
        let courtPoints = court.geometry.coordinates[0];
        var turfPoints = turf.points(courtPoints);
        var center = turf.center(turfPoints, {id:court.id});
        court.centerPoint = center;
        allCourtCenters.push(center)
        // console.log(court)
    }
    // console.log(allCourtCenters)
    for (let court of obj.features.slice(0,2)){
        let allCourtCentersFiltered = allCourtCenters.filter(d => {
            return d.id !== court.id;
        })
        var options = {units: 'meters'};


        var from = court.centerPoint;
        for (let to of allCourtCentersFiltered){
            var distance = turf.distance(from, to, options);
            if(distance < 100){
                console.log(to)
            }
        }
        
        

        // let allCourtCentersTurf = turf.featureCollection(allCourtCentersFiltered);


    }



    
});
