const express = require('express');
const router = express.Router();

const {pool}= require('../config/db');


// Veritabanındaki kategorileri ve mekân sayılarını getirir.
router.get('/categories', async (req, res) => {

    try {

        const queryText = `
            SELECT
                c.category_name,
                COUNT(pc.osm_id) AS mekan_sayisi
            FROM category c
            INNER JOIN places_category pc
                ON c.category_id = pc.category_id
            GROUP BY c.category_id, c.category_name
            ORDER BY mekan_sayisi DESC, c.category_name
        `;

        const result = await pool.query(queryText);

        res.status(200).json(result.rows);

    } catch (error) {

        console.error(
            'Kategoriler alınırken hata oluştu:',
            error
        );

        res.status(500).json({
            message: 'Kategoriler alınırken hata oluştu.'
        });
    }
});


router.get('/', async (req ,res) => {

    try {


        // URL'de gönderilen category değerini alır.
        // Örnek: /places?category=Cami
        const secilenKategori = req.query.category;

        let queryText= `SELECT 
            osm_id,
            places_name,
            district,
            website,
            opening_hours,
            phone,
            religion,
            extra_tags,
            ST_X(geom::geometry) AS longitude,
            ST_Y(geom::geometry) AS latitude
        FROM places
        ORDER BY osm_id`;

        let queryValues = [];

        // kategori seçilmişse sorguyu filtreli sorguyla değiştirir
        if (secilenKategori) {

            queryText = `
                SELECT
                    p.osm_id,
                    p.places_name,
                    p.district,
                    p.website,
                    p.opening_hours,
                    p.phone,
                    p.religion,
                    p.extra_tags,
                    ST_X(p.geom::geometry) AS longitude,
                    ST_Y(p.geom::geometry) AS latitude

                FROM places p

                INNER JOIN places_category pc
                    ON p.osm_id = pc.osm_id

                INNER JOIN category c
                    ON pc.category_id = c.category_id

                WHERE c.category_name = $1

                ORDER BY p.osm_id
            `;

            queryValues = [secilenKategori];
        }



        const result=await pool.query(queryText, queryValues);

            const features=[];

            for(const row of result.rows){
                const feature={
                    type:'Feature',

                    id:row.osm_id, //places endpointi databasedeki places tablosu okuyor


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
                        religion: row.religion,
                        extra_tags: row.extra_tags
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