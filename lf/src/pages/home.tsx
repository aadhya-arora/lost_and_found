import "../styling/home.css";
import logo from "../assets/logo.png";
const Home = () => {
  return (
    <div className="hero-section">
      <div className="left-side">
        <h1 className="web-name">Findify</h1>
        <p className="web-line">Where lost things find their way home</p>
      </div>
      <div className="right-side">
        <img src={logo}></img>
      </div>
    </div>
  );
};
export default Home;
