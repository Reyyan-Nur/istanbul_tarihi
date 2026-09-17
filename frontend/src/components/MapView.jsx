/* leaflet hartiasi olusturma */

import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet' /* React Leaflet paketinden harita component'lerini alir */
import { useState, useEffect } from 'react';
/* import { circleMarker } from 'leaflet' */
import { marker } from 'leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css';
import './MapView.css'

const kategoriGruplari = {
  "Dini Yapılar": [
    "İbadethane",
    "Cami",
    "Kilise",
    "Katedral",
    "Sinagog",
    "Türbe",
    "Medrese",
    "Kutsal Yapı"
  ],

  "Tarihi Yapılar": [
    "Tarihi Yapı",
    "Harabe",
    "Kale",
    "Askerî Kale",
    "Kule",
    "Şehir Surları",
    "Şehir Kapısı",
    "Saray",
    "Konak",
    "Köşk",
    "Hamam"
  ],

  "Arkeoloji ve Anıtlar": [
    "Arkeolojik Alan",
    "Anıt",
    "Dikilitaş",
    "Sütun",
    "Tarihi Bölge"
  ],

  "Kültür ve Sanat": [
    "Müze",
    "Sinema",
    "Tiyatro"
  ],

  "Doğa ve Açık Alanlar": [
    "Park",
    "Bahçe",
    "Koru",
    "Meydan"
  ],

  "Su Yapıları": [
    "Çeşme",
    "Su Kemeri",
    "Tarihi Köprü",
    "Sarnıç",
    "Kuyu"
  ],

  "Turizm ve Seyir": [
    "Turistik Yer",
    "Seyir Noktası"
  ],

  "Askerî ve Tarihî Alanlar": [
    "Sığınak",
    "Savaş Alanı",
    "Tarihi Gemi"
  ]
};

/* leaflette koordinat sırası latitude,longitude */
function MapView() {
  const istanbulKonumu = [41.0082, 28.9784] 

  const [wfsVerisi, setWfsVerisi ]=useState(null);

  const [toplamMekanSayisi, setToplamMekanSayisi] = useState(null);
  // Backend'den gelen kategori isimlerini tutar.
  const [kategoriler, setKategoriler] = useState([]);

  // boş metin tümü anlamına gelir.
  const [secilenKategori, setSecilenKategori] = useState('');


  // kategori listesini bir kez alır.
  useEffect(() => {

    fetch('http://localhost:5000/places/categories')
      .then((response) => response.json())

      .then((data) => {
        setKategoriler(data);
      })

      .catch((error) => {
        console.error(
          'Kategori listesi alınamadı:',
          error
        );
      });

  }, []);

    // Seçilen kategori değiştiğinde harita verisini yeniden alır.
    useEffect(() => {
      const controller = new AbortController(); // her effect çalışışında yeni bir controller
      const wfsUrl =
        '/geoserver/istanbul_gezi/wfs' +
        '?service=WFS' +
        '&version=2.0.0' +
        '&request=GetFeature' +
        '&typeNames=istanbul_gezi:places' +
        '&outputFormat=application/json';

      let veriUrl = wfsUrl;

      // Kategori seçildiyse veriyi backend'den alır.
      if (secilenKategori !== '') {
        veriUrl =
          'http://localhost:5000/places?category=' +
          encodeURIComponent(secilenKategori);
      }

      setWfsVerisi(null);

      fetch(veriUrl,{ signal: controller.signal})
        .then((response) => response.json())

        .then((data) => {
          setWfsVerisi(data);

          if (secilenKategori === '') {
            setToplamMekanSayisi(data.features.length);
          }
        })

        .catch((error) => {
          if(error.name==='AbortError'){
            return;
          }
          console.error(
            'Harita verisi alınamadı:',
            error);
        });
        // Cleanup: kategori tekrar değişirse veya component kaldırılırsa
        return () => {
          controller.abort();
        };


    }, [secilenKategori]);
    /*secilen kategori değşitginde bu usefeefct tekrar calisir.
    kategori secilmemisse wfsden bütün mekanlar alınır,
    kategori seçilmisse backendden filrtelenmis mekanlari alir
    kaynak: https://react.dev/reference/react/useEffect#fetching-data-with-effects*/

  function noktaOlustur(feature, latlng){
  return marker(latlng, {
    radius: 7,
    color: '#1d4ed8',
    weight: 2,
    fillColor: '#3b82f6',
    fillOpacity: 0.8,
  })
}

function popupBagla(feature, layer) {  
  const ozellikler = feature.properties;

  let extraTags = {};

  if (typeof ozellikler.extra_tags === 'string') {
    try {
      extraTags = JSON.parse(ozellikler.extra_tags);
    } catch (error) {
      console.error('extra_tags JSON olarak okunamadı:', error);
    }
  } else if (ozellikler.extra_tags) {
    extraTags = ozellikler.extra_tags;
  }
  const popupIcerik = document.createElement('div');

  const adres = [
    [
      extraTags['addr:street'],
      extraTags['addr:housenumber']
    ].filter(Boolean).join(' '),
    extraTags['addr:postcode']
  ].filter(Boolean).join(', ');

  const mekanAdi = document.createElement('div');
  mekanAdi.textContent = ozellikler.places_name || 'isimsiz mekan';

  mekanAdi.style.fontWeight = 'bold';
  mekanAdi.style.marginBottom = '4px';
  popupIcerik.appendChild(mekanAdi);

  function bilgiGoster(etiket,deger) {


    /* değer yoksa satir gostermez */
/*     if (!deger){
      return;
    } */
    if (
      deger === null ||
      deger === undefined ||
      deger === ''
    ) {
      return;
    }


    const bilgiSatiri = document.createElement('div');
    bilgiSatiri.textContent = `${etiket}: ${deger}`;
    popupIcerik.appendChild(bilgiSatiri);
  }


  bilgiGoster('OSM ID', ozellikler.osm_id);
  bilgiGoster('İlçe', ozellikler.district);
  bilgiGoster('Telefon', ozellikler.phone);
  bilgiGoster('Açılış Saatleri', ozellikler.opening_hours);
  bilgiGoster('Din', ozellikler.religion);
  bilgiGoster('Adres', adres);

  bilgiGoster('Yapım Tarihi', extraTags.start_date);
  bilgiGoster('Tarihî Dönem', extraTags['historic:period']);
  bilgiGoster('Medeniyet', extraTags['historic:civilization']);

  bilgiGoster('Mimar', extraTags.architect);
  bilgiGoster('Kat Sayısı', extraTags['building:levels']);

  bilgiGoster('Mezhep', extraTags.denomination);
  bilgiGoster('Miras', extraTags.heritage);
  bilgiGoster('Yazıt', extraTags.inscription);

  bilgiGoster('Tekerlekli Sandalye Erişimi', extraTags.wheelchair);
  bilgiGoster('Ücret', extraTags.fee);
  bilgiGoster('İşletmeci', extraTags.operator);
  bilgiGoster('Malzeme', extraTags.material);
  bilgiGoster('Açıklama', extraTags.description);


  /* websitede baglanti */
  if( ozellikler.website){
    
    const websiteSatiri = document.createElement('div');
    websiteSatiri.textContent='Web Sitesi: ';

    const websiteLinki = document.createElement('a');
    websiteLinki.href = ozellikler.website;
    websiteLinki.textContent = 'Siteyi aç';
  
    websiteLinki.target = '_blank';
    websiteLinki.rel = 'noopener noreferrer';

    /* nooper: acılan sitenin benim uyguglamaam erismesini ve yonlendirmesini engeller.
    noreferrer: acilan siteye geldigi yerin bilgisinin gonderilmesini engeller. */

    websiteSatiri.appendChild(websiteLinki);
    popupIcerik.appendChild(websiteSatiri);
  }

  layer.bindPopup(popupIcerik);
}

  /* return ici jsx alani, yorum satirlari {} içinde olmalı*/
  return (
    <div className="map-view">

      <div className="kategori-filtre">
        <label htmlFor="kategori">
          Kategori:
        </label>

        <select
          id="kategori"
          value={secilenKategori}
          onChange={(event) => {
            setSecilenKategori(event.target.value);
          }}
        >
          <option value="" className="tumleri-option">
            Tümü {toplamMekanSayisi !== null ? `(${toplamMekanSayisi})` : ''}
          </option>

          {Object.entries(kategoriGruplari).map(
            ([grupAdi, grupKategorileri]) => (
              <optgroup key={grupAdi} label={grupAdi}>
                {grupKategorileri.map((kategoriAdi) => {
                  const kategori = kategoriler.find(
                    (item) => item.category_name === kategoriAdi
                  );

                  if (!kategori) {
                    return null;
                  }

                  return (
                    <option
                      key={kategori.category_name}
                      value={kategori.category_name}
                    >
                      {kategori.category_name} ({kategori.mekan_sayisi})
                    </option>
                  );
                })}
              </optgroup>
            )
          )}
        </select>
      </div>

      <MapContainer
        center={istanbulKonumu}
        zoom={9}
        className="map-container"
      >

      {/*taban haritasını hangi sunucudan alcagını url ile ogrenir.*/}
      {/* tilelayer haritanin taban goruntusu  */}
      <TileLayer 
       attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

    {wfsVerisi && (
      <MarkerClusterGroup chunkedLoading showCoverageOnHover={false}>


      <GeoJSON

        key={
          secilenKategori === ''
            ? 'tumu'
            : secilenKategori
        }

      /* kategrogi degistiginde eski noktalar haritadan gitsin diye. */
        data={wfsVerisi}
        pointToLayer={noktaOlustur}
        onEachFeature={popupBagla}
      />

            </MarkerClusterGroup>
    )}
    </MapContainer>
  </div>  );
}

export default MapView