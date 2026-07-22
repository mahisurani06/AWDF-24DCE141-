import Header from "./components/Header";
import NavBar from "./components/NavBar";
import About from "./components/About";
import Skills from "./components/Skills";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const skills = [
    "HTML5",
    "CSS3",
    "JavaScript",
    "React.js",
    "Node.js",
    "Git & GitHub",
    "Bootstrap",
    "SQL",
  ];

  return (
    <div className="app">
      <NavBar activeSection="Home" />

      <Header
        name="Mahi Surani"
        themeColor="#60a5fa"
      />

      <About />

      <Skills skillList={skills} />

      <Footer email="mahi@example.com"/>
    </div>
  );
}

export default App;