// src/components/ui/Loader.jsx
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "../../assets/loading.json"; // ✅ import your JSON animation

const Loader = () => {
  return (
    <div style={styles.container}>
      <Player
        autoplay
        loop
        src={animationData}
        style={{ height: "200px", width: "200px" }}
      />
      <p style={styles.text}>Loading...</p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#f7f9fc",
  },
  text: {
    fontSize: "1.2rem",
    color: "#4a6cf7",
    marginTop: "1rem",
    fontWeight: "600",
  },
};

export default Loader;
