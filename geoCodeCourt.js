
import nominatim from "nominatim-client"
import fs from "fs";


export default async function geoCodeCourt(state,courts){
    const client = nominatim.createClient({
        useragent: "Basketball Courts",             // The name of your application
        referer: 'https://pudding.cool',  // The referer link
    });

    
    const data = fs.readFileSync('geocoded_results.json', 'utf8');
    const jsonData = JSON.parse(data);
    const ids = jsonData.map(d => +d.id);

    let courtsFiltered = courts.filter(d => {
        return ids.indexOf(d.id) == -1;
    })

    for (let court of courtsFiltered){
        const data = fs.readFileSync('geocoded_results.json', 'utf8');
        const jsonData = JSON.parse(data);
        console.log(jsonData.length)
        const ids = jsonData.map(d => +d.id);
        const query = {
            lat: court.centerPoint.geometry.coordinates[1],
            lon: court.centerPoint.geometry.coordinates[0]
        };
        if(ids.indexOf(court.id) == -1){
            let result = await client.reverse(query)//.then((result) => console.log(result));
            result.id = court.id;
            console.log(result)
    
            jsonData.push(result);
            const updatedData = JSON.stringify(jsonData, null, 2); // Indentation for readability
            fs.writeFileSync('geocoded_results.json', updatedData, 'utf8');    
        }
    }


      
    
      
}