import { Admin, Login, Map } from './views';
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  	return <div className="App">
      	<BrowserRouter>
        	<Routes>
				<Route path='/' element={<Map/>}/>
				<Route path='/admin' element={<Admin/>}/>
				<Route path='/admin/login' element={<Login/>}/>
				<Route path='*' element={"N/A"}/>
        	</Routes>
      	</BrowserRouter>
    </div>
}

export default App;
