const express = require('express');
const router = express.Router();

const {pool}= require('../config/db');

router.get('/', async (req ,res) => {

    try {

        const queryText= `SELECT 
            osm_id,
            places_name,
            district,
            website,
            opening_hours,
            phone,
            religion,
            ST_X(geom::geometry) AS longitude,
            ST_Y(geom::geometry) AS latitude
        FROM places
        ORDER BY osm_id`;



        const result=await pool.query(queryText);

            const features=[];

            for(const row of result.rows){
                const feature={
                    type:'Feature',

                    id:row.osm_id, //places endpointi databasedeki places tablosu okuyor.


                    geometry: {
                        type: 'Point',
                        coordinates: [
                            row.longitude,
                            row.latitude
                        ]
                    },

                    properties: {
                        osm_id: row.osm_id,
                        places_name: row.places_name,
                        district: row.district,
                        website: row.website,
                        opening_hours: row.opening_hours,
                        phone: row.phone,
                        religion: row.religion
                }
            };

            features.push(feature);
        }

        res.status(200).json({
            type: 'FeatureCollection',
            features: features
        });
    }catch(error) {
        console.error('Mekânlar alınırken hata oluştu:', error);
        res.status(500).json({
            message: "mekanlar alinirken hata oluştu."
        });
    }
});
    

        





module.exports=router;