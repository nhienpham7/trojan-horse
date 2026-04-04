import { useState } from "react";
import MenuScreen from "./components/MenuScreen";
import Gallery from "./components/Gallery";
import "./styles/Gallery.css";

export default function App() {
  const [entered, setEntered] = useState(false);

  return (
    <>
      <MenuScreen hidden={entered} onEnter={() => setEntered(true)} />
      <Gallery visible={entered} />
    </>
  );
}