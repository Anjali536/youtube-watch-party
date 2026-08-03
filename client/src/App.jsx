import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import WatchRoom from "./pages/WatchRoom";
import UserRemoved from "./pages/UserRemoved";
import "./styles/App.css";

function App() {

    return (

        <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/room/:roomCode" element={<WatchRoom />} />
            <Route path="/user-removed" element={<UserRemoved />} />

        </Routes>

    );

}

export default App;