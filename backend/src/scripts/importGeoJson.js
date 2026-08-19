//geojson okuma
const fs = require('node:fs'); //node kısmı npmden yuklenen paket değil node.jsin kendi modulu oldugunu gosterir.
const path = require('node:path');

const filePath = path.join(__dirname, '../../../export.geojson');
const data = fs.readFileSync(filePath, 'utf8');

const geoJson= JSON.parse(data);
console.log('kayıt sayısı:', geoJson.features.length);


//ilk kaydı inceleme
const firstFeature = geoJson.features[0];
console.log('ilk kaydın özellikleri:', firstFeature.properties);
console.log('geometry var mı:', !!firstFeature.geometry);
if (firstFeature.geometry) {
            
    console.log('ilk kaydın koordinatları:', firstFeature.geometry.coordinates);
    console.log('ilk kaydın tipi:', firstFeature.geometry.type);
}else{
    console.log('ilk kaydın koordinatları ve tipi yok');
}


//ilk kayıttaki değerleri ayrı değişkenlere atama
const osmId = firstFeature.properties['@id'];
console.log('ilk kaydın osm_id:', osmId);

const placeName1 = firstFeature.properties.name;
if(placeName1){
    console.log('ilk kaydın name:', placeName1);
}


const placeLongitude = firstFeature.geometry.coordinates[0];
console.log('ilk kaydın longitude:', placeLongitude);

const placeLatitude = firstFeature.geometry.coordinates[1];
console.log('ilk kaydın latitude:', placeLatitude);

//tüm kayıtları gezme
const allFeatures = geoJson.features;
let geometry_var=0;
let geometry_yok=0;
let name_var=0;
let name_yok=0;

for(const x of allFeatures){

    if(x.geometry){
        geometry_var++;
    }else{
        geometry_yok++;
    }

    if(x.properties.name){
        name_var++;
    }else{
        name_yok++;
    }
/*     console.log('kayıt osm_id:', x.properties['@id'], 'name:', x.properties.name, 'longitude:', x.geometry.coordinates[0], 'latitude:', x.geometry.coordinates[1]);*/
}

console.log('geometry var:', geometry_var);
console.log('geometry yok:', geometry_yok);
console.log('name var:', name_var);
console.log('name yok:', name_yok);

console.log( 'toplam geometry verisi:', geometry_var + geometry_yok);
console.log( 'toplam name verisi:', name_var + name_yok);

//ismi olmayan kayıtları sayma

let nametr_var=0;
let nametr_yok=0;
let nameen_var=0;
let nameen_yok=0;

for(const y of allFeatures){
    if(y.properties.name){
        continue; //!
    }else{
        if(y.properties['name:tr']){
            nametr_var++;
        }else{
            nametr_yok++;
                if(y.properties['name:en']){
                nameen_var++;
                }else{
                nameen_yok++;
                }
        }
    }
}
console.log('normal name yok, name:tr var:', nametr_var);
console.log('normal name,name:tr yok:', nametr_yok);
console.log('normal name,name:tr yok,name:en var:', nameen_var);
console.log('normal name, name:tr,name:en yok:', nameen_yok);

console.log('toplam name:tr verisi:', nametr_var + nametr_yok);
console.log('toplam name:en verisi:', nameen_var + nameen_yok);
console.log('kullanılabilir name verisi:', name_var + nametr_var + nameen_var);
console.log('kullanılamayan name verisi:', nameen_yok);
console.log('toplam name verisi:', name_var + nametr_var + nameen_var + nameen_yok);

//her kayıt icin kullanılacak ismi belirlemek

let aktarılabilirkayitsayisi=0;
let atlanankayitsayisi=0;
let osmIdOlmayan=0;
let geometryYok=0;
let pointOlmayan=0;
let gecersizKoordinat=0;

//kayıtları tutacak dizi
const hazirKayitlar=[];

for(const z of allFeatures){
    const placeName=z.properties.name || 
    z.properties['name:tr'] || 
    z.properties['name:en'];

    if(!placeName)
    {
        atlanankayitsayisi++;
        continue;
    }

    if(!z.properties['@id']){
        osmIdOlmayan++;
        atlanankayitsayisi++;
        continue; 
    }
    if(!z.geometry){
        geometryYok++;
        atlanankayitsayisi++;
        continue; 
    }
    //!
  
    if(z.geometry.type !== 'Point'){
        pointOlmayan++;
        atlanankayitsayisi++;
        continue; 
    }

    const coordinates=z.geometry.coordinates;


    if(
        Array.isArray(coordinates) && 
        coordinates.length === 2 && 
        Number.isFinite(coordinates[0]) && 
        //NaN, Infinity ve -Infinity de teknik olarak number türünde. bu yuzden typeof kullanmadık.
        Number.isFinite(coordinates[1])){
        
    
    }
    else{
        gecersizKoordinat++;
        atlanankayitsayisi++;
        continue; 
    }

    const hazirKayit={
        osm_id: z.properties['@id'],
        places_name: placeName,    
        district: z.properties['addr:district'] || null,
        website: z.properties['website'] || null,
        opening_hours: z.properties['opening_hours'] || null,
        phone: z.properties['phone'] || null,
        religion: z.properties['religion'] || null,
        longitude: coordinates[0],
        latitude: coordinates[1],
        extra_tags: z.properties
    };


    hazirKayitlar.push(hazirKayit);
    aktarılabilirkayitsayisi++;

}
console.log('atlanan kayit sayisi:', atlanankayitsayisi);
console.log('aktarılabilir kayit sayisi:', aktarılabilirkayitsayisi);
console.log('geometry yok kayit sayisi:', geometryYok);
console.log('point olmayan kayit sayisi:', pointOlmayan);
console.log('geçersiz koordinat kayit sayisi:', gecersizKoordinat);
console.log('osm_id olmayan kayit sayisi:', osmIdOlmayan);
console.log('toplam kayit sayisi:', aktarılabilirkayitsayisi + atlanankayitsayisi);
console.log('hazır kayıtlar dizisinin uzunluğu:', hazirKayitlar.length);
console.log('hazır kayıtlar dizisinin ilk kaydı:', hazirKayitlar[0]);
console.log('hazır kayıtlar dizisinin ilk üç kaydı:', hazirKayitlar.slice(0, 3));




