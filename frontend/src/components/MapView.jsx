/* leaflet hartiasi olusturma */

import { MapContainer, TileLayer, WMSTileLayer } from 'react-leaflet' /* React Leaflet paketinden harita component'lerini alir */

import './MapView.css'

/* leaflette koordinat sırası latitude,longitude */
function MapView() {
  const istanbulKonumu = [41.0082, 28.9784] 

  /* return ici jsx alani, yorum satirlari {} içinde olmalı*/
  return (
    <MapContainer
      center={istanbulKonumu}
      zoom={11}
      className="map-container"
    >

      {/*taban haritasını hangi sunucudan alcagını url ile ogrenir.*/}
      {/* tilelayer haritanin taban goruntusu  */}
      <TileLayer 
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" 
      />

{/* urldeki kodlanmis değil, gerçek katman yazilir %3A yerine : gibi */}
      <WMSTileLayer
        url="http://localhost:8080/geoserver/istanbul_gezi/wms"
        layers="istanbul_gezi:places"
        format="image/png"
        transparent={true}

      
      />
    </MapContainer>
  )
}

export default MapView