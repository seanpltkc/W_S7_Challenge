import { Route, Routes, useNavigate } from "react-router-dom";
import { Home } from "./components/Home"
import { Information } from "./components/Information"
import "./output.css"

function App() {

const navigate = useNavigate();




  return (
    <div>
      <h1>My App</h1>
      <button onClick={() => navigate('/')}>Home</button>
      <button onClick={() => navigate('/information')}>Information</button>
      <Routes>
        <Route path="" element={<Home/>}/>
        <Route path="information" element={<Information/>}/>
      </Routes>
    </div>
  )
}

export default App
