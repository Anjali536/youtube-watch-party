import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate ,useParams } from "react-router-dom";
import YouTube from "react-youtube";
import socket from "../services/socket";
import "../styles/WatchRoom.css";
import { FaPlayCircle } from "react-icons/fa";

function WatchRoom() {

    // ==========================
    // ROUTER DATA
    // ==========================

    const { roomCode } = useParams();
    const location = useLocation();
    const username = location.state?.username;
    const navigate = useNavigate();


    // ==========================
    // STATES
    // ==========================

    const [participants, setParticipants] = useState([]);
    const [videoUrl, setVideoUrl] = useState("");
    const [videoId, setVideoId] = useState("");
    const [myRole, setMyRole] = useState("");

    // ==========================
    // REFS
    // ==========================

    // YouTube Player Instance

    const playerRef = useRef(null);
    const isRemoteUpdate = useRef(false);


    // ==========================
    // YOUTUBE OPTIONS
    // ==========================

    const playerOptions = {
        width: "900",
        height: "500",
        playerVars: {
            autoplay: 0,
            controls: 1,
            rel: 0
        }
    };
    useEffect(() => {

        socket.emit("join-room", {
            roomCode,
            username
        });

        socket.on("participants-updated", (users) => {

                console.log(users);
                setParticipants(users);
                const currentUser = users.find(
                    (user) => user.socketId === socket.id
                );
                console.log("Current User :", currentUser);
                if (currentUser) {
                    setMyRole(currentUser.role);
                }
            });
        socket.on("room-data", (room) => {
            if (room.videoId) {
                setVideoId(room.videoId);
            }
            if (room.currentTime && playerRef.current) {
                playerRef.current.seekTo(room.currentTime, true);
            }
            if (room.isPlaying && playerRef.current) {
                playerRef.current.playVideo();
            }
        });
        socket.on("video-changed", ({ videoId }) => {
            console.log("Frontend received:", videoId);
            setVideoId(videoId);
        });
        socket.on("play-video", () => {
            if (!playerRef.current) return;
            isRemoteUpdate.current = true;
            playerRef.current.playVideo();
        });
        socket.on("pause-video", () => {
            if (!playerRef.current) return;
            isRemoteUpdate.current = true;
            playerRef.current.pauseVideo();
        });
        socket.on("seek-video", ({ currentTime }) => {
            if (!playerRef.current) return;
            isRemoteUpdate.current = true;
            playerRef.current.seekTo(currentTime, true);
        });
        socket.on("permission-denied", () => {
            alert("Only Host or Moderator can control the video.");
        });
        socket.on("removed", () => {
            navigate("/user-removed");
        });

        return () => {

            socket.off("participants-updated");
            socket.off("room-data");
            socket.off("video-changed");
            socket.off("play-video");
            socket.off("pause-video");
            socket.off("seek-video");
            socket.off("permission-denied");
            socket.off("removed");
        };

    }, [roomCode, username]);

    // ==========================
    // LOAD VIDEO
    // ==========================

    const loadVideo = () => {
        console.log("My Role :", myRole);
        console.log("Video URL :", videoUrl);
        if (!videoUrl.trim()) {
            alert("Please enter a YouTube URL");
            return;
        }
        let id = "";
        try {
            const url = new URL(videoUrl);
            if (url.hostname === "youtu.be") {
                id = url.pathname.substring(1);
            } else {
                id = url.searchParams.get("v");
            }

        } catch (err) {
            alert("Invalid YouTube URL");
            return;
        }

        if (!id) {
            alert("Invalid YouTube URL");
            return;
        }
        socket.emit("change-video", {
            roomCode,
            videoId: id
        });
    };


    // ==========================
    // YOUTUBE PLAYER EVENTS
    // ==========================

    const handlePlayerReady = (event) => {

        playerRef.current = event.target;

    };


    const handlePlay = () => {
        if (myRole === "participant") return;
        if (isRemoteUpdate.current) {
            isRemoteUpdate.current = false;
            return;
        }
        socket.emit("play-video", {
            roomCode
        });
    };


    const handlePause = () => {
        if (myRole === "participant") return;
        if (isRemoteUpdate.current) {
            isRemoteUpdate.current = false;
            return;
        }
        socket.emit("pause-video", {
            roomCode
        });
    };


    const handleStateChange = (event) => {
        if (myRole === "participant") return;
        if (event.data !== 1) return;
        if (isRemoteUpdate.current) return;
        socket.emit("seek-video", {
            roomCode,
            currentTime: event.target.getCurrentTime()
        });
    };
    return (

    <div className="watch-room">

        {/* ================= HEADER ================= */}

        <div className="home-header">

            <div className="logo">

                <FaPlayCircle className="logo-icon" />

                <span>YouTube Watch Party</span>

            </div>

        </div>

        {/* ================= ROOM INFO ================= */}

        <h2>
            Welcome,
            <span className="header-highlight"> {username}</span>
        </h2>

        <h2>
            Room Code :
            <span className="header-highlight"> {roomCode}</span>
        </h2>

        {/* ================= MAIN CONTENT ================= */}

        <div className="watch-content">

            {/* ================= VIDEO CARD ================= */}

            <div className="video-section">

                <div className="video-controls">

                    <input
                        type="text"
                        disabled={myRole === "participant"}
                        placeholder="Paste YouTube URL"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                    />

                    <button
                        disabled={myRole === "participant"}
                        onClick={loadVideo}
                    >
                        Load Video
                    </button>

                </div>

                {videoId ? (

                    <div className="video-container">

                        <YouTube
                            videoId={videoId}
                            opts={{
                                ...playerOptions,
                                playerVars: {
                                    ...playerOptions.playerVars,
                                    controls:
                                        myRole === "participant" ? 0 : 1
                                }
                            }}
                            onReady={handlePlayerReady}
                            onPlay={handlePlay}
                            onPause={handlePause}
                            onStateChange={handleStateChange}
                        />

                    </div>

                ) : (

                    <div className="video-container">

                        <h2>No Video Loaded</h2>

                    </div>

                )}

            </div>

            {/* ================= PARTICIPANTS CARD ================= */}

            <div className="participants-card">

                <h2 className="participants-heading">
                    Participants
                </h2>

                <p className="participants-count">
                    {participants.length} Member(s)
                </p>

                <ul>

                    {participants.map((user) => (

                        <li key={user._id || user.socketId}>

                            <div className="participant-info">

                                <span
                                    className={`status-dot ${
                                        user.role === "host"
                                            ? "host-dot"
                                            : user.role === "moderator"
                                            ? "moderator-dot"
                                            : "participant-dot"
                                    }`}
                                ></span>

                                <span className="participant-name">
                                    {user.username}
                                </span>

                            </div>

                            <p className="participant-role">

                                {user.role.charAt(0).toUpperCase() +
                                    user.role.slice(1)}

                            </p>

                            {myRole === "host" &&
                                user.role === "participant" && (

                                    <button
                                        className="make-moderator-btn"
                                        onClick={() =>
                                            socket.emit("make-moderator", {
                                                roomCode,
                                                userId: user._id
                                            })
                                        }
                                    >
                                        Make Moderator
                                    </button>

                                )}

                            {myRole === "host" &&
                                user.role !== "host" && (

                                    <button
                                        className="remove-btn"
                                        onClick={() =>
                                            socket.emit("remove-participant", {
                                                roomCode,
                                                userId: user._id
                                            })
                                        }
                                    >
                                        Remove
                                    </button>

                                )}

                        </li>

                    ))}

                </ul>

            </div>

        </div>

    </div>
    );
}

export default WatchRoom;