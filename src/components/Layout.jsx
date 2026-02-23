import { Link, useLocation, useNavigate } from "react-router-dom";

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isBlogRoute = location.pathname.startsWith("/blog");

  const handleSectionClick = (sectionId) => {
    if (location.pathname !== "/") {
      // If we're not on the home page, navigate there first
      navigate("/");
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        if (sectionId === "about") {
          // For "about", scroll to top to show header
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }
      }, 100);
    } else {
      // If we're already on home page, just scroll
      if (sectionId === "about") {
        // For "about", scroll to top to show header
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  };

  return (
    <div className="container">
      <header className="hero">
        <h1>evelyn website</h1>
        <p className="subtitle">website maker</p>
      </header>
      <nav className="navigation">
        <button
          onClick={() => handleSectionClick("about")}
          className={`button ${
            location.pathname === "/" ? "" : "button--ghost"
          }`}
        >
          about
        </button>
        <button
          onClick={() => handleSectionClick("projects")}
          className={`button ${
            location.pathname === "/" ? "" : "button--ghost"
          }`}
        >
          projects
        </button>
        <button
          onClick={() => handleSectionClick("contact")}
          className={`button ${
            location.pathname === "/" ? "" : "button--ghost"
          }`}
        >
          contact
        </button>
        <Link
          to="/blog"
          className={`button ${isBlogRoute ? "" : "button--ghost"}`}
        >
          blog
        </Link>
      </nav>
      <main>{children}</main>
    </div>
  );
}

export default Layout;
