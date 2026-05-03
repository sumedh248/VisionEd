import { Link } from "react-router-dom";
import "./Footer.css";

const footerLinks = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/career", label: "Career Test" },
  { to: "/colleges", label: "Colleges" },
  { to: "/login", label: "Login" },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Link to="/" className="site-footer__logo">
            Vision<span>Ed</span>
          </Link>
          <p>
            Helping students turn interests, skills, and assessment results into
            clearer career decisions.
          </p>
        </div>

        <nav className="site-footer__nav" aria-label="Footer navigation">
          <h2>Explore</h2>
          <div className="site-footer__links">
            {footerLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="site-footer__contact">
          <h2>Connect</h2>
          <a href="mailto:support@visioned.com">
            <i className="fas fa-envelope" aria-hidden="true"></i>
            support@visioned.com
          </a>
          <span>
            <i className="fas fa-location-dot" aria-hidden="true"></i>
            Student career guidance platform
          </span>
        </div>
      </div>

      <div className="site-footer__bottom">
        <span>&copy; {currentYear} VisionEd. All rights reserved.</span>
        <span>Built for confident career choices.</span>
      </div>
    </footer>
  );
}

export default Footer;
