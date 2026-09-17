/* uygulamanin ana componentlerini bir araya getirir. */
import MapView from './components/MapView'
import './App.css'

function App() {
  return (
    <main className="app">

      <div className="page-container">

        <header className="app-header">

          <h1>
            İstanbul Tarihi ve Kültürel Yerler
          </h1>

          <p>
            İstanbul'un tarihi ve kültürel miras noktalarını keşfedin.
          </p>

        </header>

        <section className="map-card">
          <MapView />
        </section>

      </div>

    </main>
  )
}

export default App