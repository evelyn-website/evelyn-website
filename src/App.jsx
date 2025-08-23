import "./App.css";

function App() {
  return (
    <div className="container">
      <header className="hero">
        <h1>Evelyn Nelson</h1>
        <p>Welcome to my personal website</p>
      </header>

      <nav className="navigation">
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
        <a
          href="https://legacy.evelynwebsite.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Legacy Blog
        </a>
      </nav>

      <main>
        <section id="about" className="section">
          <h2>About Me</h2>
          <p>
            This is my new personal website. I'm currently updating the content,
            so please check back soon!
          </p>
        </section>

        <section id="projects" className="section">
          <h2>Projects</h2>
          <p>Projects section coming soon...</p>
        </section>

        <section id="contact" className="section">
          <h2>Contact</h2>
          <p>Contact information coming soon...</p>
        </section>

        <section className="section legacy-note">
          <h3>Looking for the old social media site?</h3>
          <p>
            My original social media site is still available at{" "}
            <a
              href="https://legacy.evelynwebsite.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              legacy.evelynwebsite.com
            </a>
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;
