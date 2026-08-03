import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";
import { FaPlayCircle } from "react-icons/fa";
const API = import.meta.env.VITE_BACKEND_URL;
function Home() {

    const [createUsername, setCreateUsername] = useState("");
    const [joinUsername, setJoinUsername] = useState("");
    const [roomCode, setRoomCode] = useState("");
    const navigate = useNavigate();
    const createRoom = async () => {

        if (!createUsername) {

            alert("Enter Username");

            return;

        }

        try {

            const res = await axios.post(
                `${API}/api/rooms/create`
            );

            navigate(`/room/${res.data.room.roomCode}`, {

                state: {

                    username: createUsername
                }

            });

        }

        catch (err) {

            console.log(err);

        }

    };

    const joinRoom = () => {

        if (!joinUsername || !roomCode) {

            alert("Fill all fields");

            return;

        }

        navigate(`/room/${roomCode}`, {

            state: {
                username : joinUsername
            }

        });

    };

    return (

        <div className="home">

            <div className="home-container">

                <div className="home-header">

                    <div className="logo">
                        <FaPlayCircle className="logo-icon" />
                        <span>YouTube Watch Party</span>
                    </div>

                </div>

                <div className="home-content">

                    <div className="home-card">

                        <h2>Create Room</h2>

                        <input
                            placeholder="Enter Username"
                            value={createUsername}
                            onChange={(e) => setCreateUsername(e.target.value)}
                        />

                        <button onClick={createRoom}>
                            Create Room
                        </button>

                    </div>

                    <div className="or-divider">
                        OR
                    </div>

                    <div className="home-card">

                        <h2>Join Room</h2>

                        <input
                            placeholder="Enter Username"
                            value={joinUsername}
                            onChange={(e) => setJoinUsername(e.target.value)}
                        />

                        <input
                            placeholder="Enter Room Code"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value)}
                        />

                        <button onClick={joinRoom}>
                            Join Room
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Home;