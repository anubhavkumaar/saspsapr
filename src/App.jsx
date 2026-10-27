import { Routes, Route } from 'react-router-dom'
import { HOME_PATHS } from './lib/nav'
import { Layout } from './shell/Layout.jsx'
import Admin from './pages/Admin.jsx'
import FieldWork from './pages/FieldWork.jsx'
import Home from './pages/Home.jsx'
import Join from './pages/Join.jsx'
import Licenses from './pages/Licenses.jsx'
import Personnel from './pages/Personnel.jsx'
import Ranger from './pages/Ranger.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout/>}>
        {/* Home answers on its section paths too: /roster, /personnel, /hunting, /fishing, /map */}
        {HOME_PATHS.map(p => <Route key={p} path={p} element={<Home/>}/>)}
        <Route path="/fieldwork" element={<FieldWork/>}/>
        <Route path="/licenses" element={<Licenses/>}/>
        <Route path="/joinsapr" element={<Join/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/ranger" element={<Ranger/>}/>
        <Route path="/personnel/:badge" element={<Personnel/>}/>
        <Route path="/:callsign" element={<Personnel/>}/>
      </Route>
    </Routes>
  )
}
