import { useNavigate } from "react-router-dom";
import { FaPlayCircle } from "react-icons/fa";
import "../styles/UserRemoved.css";

function UserRemoved() {

    const navigate = useNavigate();

    return (

        <div className="removed-page">

            <div className="home-header">

                <div className="logo">

                    <FaPlayCircle className="logo-icon" />

                    <span>YouTube Watch Party</span>

                </div>

            </div>

            <div className="removed-card">

                <h1>You've Been Removed</h1>

                <p>
                    Sorry! The host has removed you from this watch party.
                </p>

                <button
                    onClick={() => navigate("/")}
                >
                    Go Home
                </button>

            </div>

        </div>

    );

}

export default UserRemoved;