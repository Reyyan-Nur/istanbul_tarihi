const { pool } = require('../config/db');


// GeoJSON dosyasında bulunan OSM değerlerinin Türkçe kategori karşılıkları
const kategoriEslemeleri = {
    building: {
        mosque: 'Cami',
        church: 'Kilise',
        palace: 'Saray',
        museum: 'Müze',
        müze: 'Müze',
        castle: 'Kale',
        tower: 'Kule',
        tomb: 'Türbe',
        shrine: 'Kutsal Yapı',
        ruins: 'Harabe',
        historic: 'Tarihi Yapı',
        medrese: 'Medrese',
        cathedral: 'Katedral',
        synagogue: 'Sinagog',
        bunker: 'Sığınak',
        pavilion: 'Köşk'
    },

    amenity: {
        place_of_worship: 'İbadethane',
        fountain: 'Çeşme',
        drinking_water: 'Çeşme',
        public_bath: 'Hamam',
        castel: 'Kale',
        clock: 'Saat Kulesi',
        theatre: 'Tiyatro',
        cinema: 'Sinema'
    },

    historic: {
        ruins: 'Harabe',
        building: 'Tarihi Yapı',
        yes: 'Tarihi Yapı',
        tomb: 'Türbe',
        archaeological_site: 'Arkeolojik Alan',
        castle: 'Kale',
        memorial: 'Anıt',
        monument: 'Anıt',
        citywalls: 'Şehir Surları',
        fountain: 'Çeşme',
        drinking_fountain: 'Çeşme',
        aqueduct: 'Su Kemeri',
        church: 'Kilise',
        battlefield: 'Savaş Alanı',
        bridge: 'Tarihi Köprü',
        city_gate: 'Şehir Kapısı',
        fort: 'Askerî Kale',
        manor: 'Konak',
        mosque: 'Cami',
        tower: 'Kule',
        cistern: 'Sarnıç',
        column: 'Sütun',
        district: 'Tarihi Bölge',
        ship: 'Tarihi Gemi'
    },

    tourism: {
        museum: 'Müze',
        attraction: 'Turistik Yer',
        viewpoint: 'Seyir Noktası'
    },

    leisure: {
        park: 'Park',
        garden: 'Bahçe',
        turkish_bath: 'Hamam'
    },

    place: {
        square: 'Meydan'
    },

    man_made: {
        tower: 'Kule',
        city_wall: 'Şehir Surları',
        bridge: 'Tarihi Köprü',
        obelisk: 'Dikilitaş',
        reservoir_covered: 'Sarnıç',
        water_well: 'Kuyu'
    },

    natural: {
        wood: 'Koru'
    },

    site: {
        ruins: 'Harabe'
    }
};


// Bir mekânın extra_tags alanına bakarak
// o mekâna ait kategorileri bulur.
function kategorileriBul(extraTags) {
    const kategoriler = [];

    if (!extraTags) {
        return kategoriler;
    }

    // building, amenity, historic gibi alanları sırayla dolaşır.
    for (const alan of Object.keys(kategoriEslemeleri)) {
        const osmDegeri = extraTags[alan];

        // Mekânda bu alan yoksa sonraki alana geçer.
        if (!osmDegeri) {
            continue;
        }

        // OSM değerinin Türkçe karşılığını bulur.
        const kategoriAdi =
            kategoriEslemeleri[alan][osmDegeri];

        // Karşılığı varsa ve daha önce eklenmediyse
        // kategori listesine ekler.
        if (
            kategoriAdi &&
            !kategoriler.includes(kategoriAdi)
        ) {
            kategoriler.push(kategoriAdi);
        }
    }

    // museum alanında history, art, science gibi
    // herhangi bir değer varsa mekânı Müze olarak kabul eder.
    if (
        extraTags.museum &&
        !kategoriler.includes('Müze')
    ) {
        kategoriler.push('Müze');
    }

    return kategoriler;
}


async function kategorileriAktar() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Bütün mekânların kimliğini ve OSM etiketlerini alır.
        const sonuc = await client.query(`
            SELECT osm_id, extra_tags
            FROM places
        `);

        let kategorisizMekanSayisi = 0;
        let bulunanBaglantiSayisi = 0;
        let yeniBaglantiSayisi = 0;

        for (const mekan of sonuc.rows) {
            const kategoriler = kategorileriBul(
                mekan.extra_tags
            );

            // Mekân için hiçbir kategori bulunamadıysa
            // sayacı artırıp sonraki mekâna geçer.
            if (kategoriler.length === 0) {
                kategorisizMekanSayisi++;
                continue;
            }

            for (const kategoriAdi of kategoriler) {
                bulunanBaglantiSayisi++;

                // Kategori daha önce eklenmiş mi diye bakar.
                let kategoriSonucu = await client.query(
                    `
                        SELECT category_id
                        FROM category
                        WHERE category_name = $1
                    `,
                    [kategoriAdi]
                );

                // Kategori yoksa category tablosuna ekler.
                if (kategoriSonucu.rows.length === 0) {
                    kategoriSonucu = await client.query(
                        `
                            INSERT INTO category (category_name)
                            VALUES ($1)
                            RETURNING category_id
                        `,
                        [kategoriAdi]
                    );
                }

                const kategoriId =
                    kategoriSonucu.rows[0].category_id;

                // Mekân ile kategori arasındaki bağlantıyı ekler.
                // Aynı bağlantı zaten varsa yeniden eklemez.
                const eklemeSonucu = await client.query(
                    `
                        INSERT INTO places_category (
                            osm_id,
                            category_id
                        )
                        VALUES ($1, $2)
                        ON CONFLICT DO NOTHING
                    `,
                    [mekan.osm_id, kategoriId]
                );

                // Sadece gerçekten yeni satır eklendiyse artırılır.
                yeniBaglantiSayisi += eklemeSonucu.rowCount;
            }
        }

        await client.query('COMMIT');

        console.log('Kategori aktarımı tamamlandı.');
        console.log(
            'İşlenen mekân sayısı:',
            sonuc.rows.length
        );
        console.log(
            'Kategorisiz mekân sayısı:',
            kategorisizMekanSayisi
        );
        console.log(
            'Bulunan kategori bağlantısı:',
            bulunanBaglantiSayisi
        );
        console.log(
            'Yeni eklenen bağlantı sayısı:',
            yeniBaglantiSayisi
        );

    } catch (error) {
        await client.query('ROLLBACK');

        console.error(
            'Hata oluştu, değişiklikler geri alındı:',
            error
        );

    } finally {
        client.release();
        await pool.end();
    }
}


kategorileriAktar();