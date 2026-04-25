import { useState } from 'react'
import './App.css'
import MenuScreen  from './components/MenuScreen.jsx'
import Gallery     from './components/Gallery.jsx'

export default function App() {
  const [entered, setEntered] = useState(false)

  return (
    <div className="app">
      {!entered && <MenuScreen onEnter={() => setEntered(true)} />}
      {/* Gallery is always mounted so Three.js can init; visibility toggled via CSS */}
      <Gallery visible={entered} />
    </div>
  )
}
