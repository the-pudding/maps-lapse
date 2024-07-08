import fs from "fs";

export default async function tooSmall(courts){
    console.log("testing file sizes")
    let fileSizeTooSmall = [];
    for (let court of courts){

        //let file = await fs.readFileSync(`../../../Volumes/My Passport/small/${court.properties.geo}/google_way_${court.id}.png`)
        var stats = fs.statSync(`../../../Volumes/My Passport/small/${court.properties.geo}/google_way_${court.id}.png`)
        var fileSizeInBytes = stats.size;
        // console.log(fileSizeInBytes)
        if(fileSizeInBytes < 1000){
            fileSizeTooSmall.push(court.id);
        }
    }
    return fileSizeTooSmall;
    // const toWrite = JSON.stringify(fileSizeTooSmall, null, 2); // Indentation for readability
    // fs.writeFileSync('tooSmall.json', toWrite, 'utf8');
}
