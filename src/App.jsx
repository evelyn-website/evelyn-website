import { useState } from "react";
import "./App.css";

function App() {
  const [expandedCard, setExpandedCard] = useState(null);

  const toggleCard = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  return (
    <div className="container">
      <header className="hero">
        <h1>evelyn website</h1>
        <p className="subtitle">website maker</p>
      </header>
      <nav className="navigation">
        <a href="#about" className="button">
          about
        </a>
        <a href="#projects" className="button button--ghost">
          projects
        </a>
        <a href="#contact" className="button">
          contact
        </a>
        <a href="#blog" className="button button--ghost">
          blog
        </a>
      </nav>

      <main>
        <section id="about" className="section">
          <h2>about me</h2>
          <p>
            I'm a web-dev hobbyist who is focused on coming up with ways for
            technology to bring you closer to the people you already care about.
            I work in tech, but not as a software engineer. I love learning new
            technologies. My previous projects have been built with React, React
            Native, and Go.
          </p>
        </section>

        <section id="projects" className="section">
          <h2>things i'm working on</h2>
          <div className="grid">
            <div className="grid-column">
              <div
                className={`project-card ${
                  expandedCard === "project1" ? "expanded" : ""
                }`}
                onClick={() => toggleCard("project1")}
              >
                <div className="card-header">
                  <span className="chip">in progress</span>
                  <h3>Bundle</h3>
                  <p>temporary group chats for events</p>
                  <button
                    className="expand-button"
                    aria-label="expand project details"
                  >
                    <span className="expand-icon">
                      {expandedCard === "project1" ? "−" : "+"}
                    </span>
                  </button>
                </div>
                <div className="card-details">
                  <div className="details-content">
                    <h4>what i'm building</h4>
                    <p>
                      I'm working on an iOS app that allows you to create
                      temporary group chats for events or parties. After the
                      relevant event is over, the chat is deleted. The frontend
                      is React Native and the backend is Go. It supports
                      end-to-end encryption and images. It's a work in progress,
                      but I always say I'm like three or four hard steps away
                      from it being ready.
                    </p>
                    <ul>
                      <li>built with react native and go</li>
                      <li>focusing on really smooth user experience</li>
                      <li>mobile only</li>
                    </ul>
                    <p>
                      <strong>timeline:</strong> august 2024-present
                    </p>
                    <p>
                      <strong>status:</strong> almost ready for beta testing
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={`project-card ${
                  expandedCard === "project4" ? "expanded" : ""
                }`}
                onClick={() => toggleCard("project4")}
              >
                <div className="card-header">
                  <span className="chip">ideation</span>
                  <h3>Family Photo</h3>
                  <p>invite-only community photo sharing</p>
                  <button
                    className="expand-button"
                    aria-label="expand project details"
                  >
                    <span className="expand-icon">
                      {expandedCard === "project4" ? "−" : "+"}
                    </span>
                  </button>
                </div>
                <div className="card-details">
                  <div className="details-content">
                    <h4>what i'm building</h4>
                    <p>
                      This one is a collaboration with my friend Emily. We know
                      so many people who are tired of using Instagram or Bluesky
                      to share their photos. This project will be an invite-only
                      platform for sharing photos.
                    </p>
                    <ul>
                      <li>high quality images, emphasis on performance</li>
                      <li>curation over algorithm</li>
                      <li>maybe a PWA? we'll see</li>
                    </ul>
                    <p>
                      <strong>next steps:</strong> finish some other stuff so I
                      can work on this
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid-column">
              <div
                className={`project-card ${
                  expandedCard === "project2" ? "expanded" : ""
                }`}
                onClick={() => toggleCard("project2")}
              >
                <div className="card-header">
                  <span className="chip">deployed</span>
                  <h3>Flinta Forum</h3>
                  <p>
                    self-hosted literary bulletin for t4t community in new york
                  </p>
                  <button
                    className="expand-button"
                    aria-label="expand project details"
                  >
                    <span className="expand-icon">
                      {expandedCard === "project2" ? "−" : "+"}
                    </span>
                  </button>
                </div>
                <div className="card-details">
                  <div className="details-content">
                    <h4>what i'm building</h4>
                    <p>
                      This project is a small literary project for my friends
                      and loved ones to share poetry, short fiction, reviews,
                      photos, and whatever else they want to share. It's a
                      collaboration with my friend Joyce, who came up with the
                      idea. It's a Jekyll static site hosted on a raspberry pi
                      in my apartment. This project was essentially spun out of
                      an earlier effort to build a lightweight tutorial for
                      self-hosting static sites called "Re-wild."
                    </p>
                    <p>
                      <strong>timeline:</strong> early 2025-whenever
                    </p>
                    <p>
                      <strong>status:</strong> active
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid-column">
              <div
                className={`project-card ${
                  expandedCard === "project3" ? "expanded" : ""
                }`}
                onClick={() => toggleCard("project3")}
              >
                <div className="card-header">
                  <span className="chip">beta testing</span>
                  <h3>Give Me the Aux</h3>
                  <p>Competitive music sharing game for friends</p>
                  <button
                    className="expand-button"
                    aria-label="expand project details"
                  >
                    <span className="expand-icon">
                      {expandedCard === "project3" ? "−" : "+"}
                    </span>
                  </button>
                </div>
                <div className="card-details">
                  <div className="details-content">
                    <h4>what i'm building</h4>
                    <p>
                      The basic concept is that a group admin picks a theme,
                      everybody submits a song, and then the group votes on
                      which songs they like best. It's not the most original
                      idea, but I wanted to make sure that the app feels nice to
                      use.
                    </p>
                    <ul>
                      <li>
                        built with react native and express + prisma backend
                      </li>
                      <li>
                        spotify oauth (unfortunately really the only way to do
                        it that doesn't require everyone to use the same paid
                        service)
                      </li>
                    </ul>
                    <p>
                      <strong>next steps:</strong> finish beta testing and get
                      it approved by spotify + apple
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section">
          <h2>let's chat</h2>
          <ul>
            <li>
              <a
                href="https://github.com/evelyn-website"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://bsky.app/profile/evelynwebsite.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Bluesky
              </a>
            </li>
          </ul>
        </section>

        <section className="section legacy-note">
          <h3>looking for the old evelyn website?</h3>
          <p>
            my original social media site is still live at{" "}
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
