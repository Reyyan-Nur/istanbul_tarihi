/* uygulamanin ana componentlerini bir araya getirir.*/
import MapView from './components/MapView'
import './App.css'

function App() {
  return (
    <main className="app">
      <header className="app-header">
        <h1>İstanbul Tarihi ve Kültürel Yerler</h1>
      </header>

      <MapView />
    </main>
  )
}

export default App