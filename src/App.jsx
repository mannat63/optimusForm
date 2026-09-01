import { useEffect, useState } from "react";
import "./App.css";

import optimusLogo from "./assets/logo.png";

function App() {
  const [introClosing, setIntroClosing] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const closeTimer = setTimeout(() => {
      setIntroClosing(true);
    }, 3800);

    const removeTimer = setTimeout(() => {
      setShowIntro(false);
    }, 5000);

    return () => {
      clearTimeout(closeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    roll: "",
    email: "",
    programme: "",
    major: "",
    minor: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agree) {
      alert("Please agree to participate in the ERP course.");
      return;
    }

    try {
      // Local development → Express server
      // Vercel deployment → Vercel API
      const API_URL = import.meta.env.DEV
        ? "http://localhost:5000/register"
        : "/api/register";

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Show custom success modal
        setShowSuccess(true);

        // Reset form
        setFormData({
          name: "",
          roll: "",
          email: "",
          programme: "",
          major: "",
          minor: "",
          agree: false,
        });
      } else {
        alert(result.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Could not connect to the server.");
    }
  };

  const scrollToForm = () => {
    document.getElementById("registration")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="app">
      {/* ================================
          SUCCESS MODAL
      ================================= */}

      {showSuccess && (
        <div className="success-overlay" onClick={() => setShowSuccess(false)}>
          <div
            className="success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}

            <button
              className="success-close"
              onClick={() => setShowSuccess(false)}
              aria-label="Close"
            >
              ×
            </button>

            {/* SUCCESS ICON */}

            <div className="success-icon">
              <span>✓</span>
            </div>

            {/* CONTENT */}

            <div className="success-content">
              <span className="success-label">OPTIMUS · ERP COURSE</span>

              <h2 id="success-title">
                Registration
                <br />
                Successful.
              </h2>

              <p className="success-message">
                Your interest has been registered successfully.
              </p>

              <div className="success-divider"></div>

              <p className="success-question">Want more details?</p>

              <p className="success-instagram-text">
                Follow Optimus on Instagram for upcoming updates, announcements
                and course details.
              </p>

              {/* ACTIONS */}

              <div className="success-actions">
                <a
                  href="https://www.instagram.com/optimus.imnu/"
                  target="_blank"
                  rel="noreferrer"
                  className="success-instagram-button"
                >
                  VISIT INSTAGRAM
                  <span>↗</span>
                </a>

                <button
                  className="success-ok-button"
                  onClick={() => setShowSuccess(false)}
                >
                  GOT IT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================
          INTRO SCREEN
      ================================= */}

      {showIntro && (
        <div className={`intro-screen ${introClosing ? "intro-closing" : ""}`}>
          <div className="intro-glow"></div>

          <div className="intro-ring ring-one"></div>
          <div className="intro-ring ring-two"></div>
          <div className="intro-ring ring-three"></div>

          <div className="logo-wrapper">
            <img src={optimusLogo} alt="Optimus" className="intro-logo" />
          </div>
        </div>
      )}

      {/* ================================
          MAIN WEBSITE
      ================================= */}

      <main className={!showIntro ? "main-visible" : ""}>
        {/* ================================
            HERO
        ================================= */}

        <section className="hero">
          <div className="hero-top">
            <div className="gold-line"></div>

            <span>OPTIMUS · ERP COURSE</span>
          </div>

          <div className="hero-content">
            <div className="hero-left">
              <h1 className="hero-title">
                <span>Learn.</span>

                <span className="outline-text">Experience.</span>

                <span>Grow.</span>
              </h1>

              <p className="hero-description">
                An opportunity to explore Enterprise Resource Planning through a
                practical and industry-oriented learning experience.
              </p>

              <button className="hero-button" onClick={scrollToForm}>
                REGISTER YOUR INTEREST
                <span>↗</span>
              </button>
            </div>

            {/* ERP VISUAL */}

            <div className="erp-visual">
              <div className="orbit orbit-one"></div>

              <div className="orbit orbit-two"></div>

              <div className="orbit orbit-three"></div>

              <div className="erp-core">ERP</div>

              <div className="orbit-dot dot-one"></div>

              <div className="orbit-dot dot-two"></div>

              <div className="orbit-dot dot-three"></div>
            </div>
          </div>

          <div className="scroll-indicator">
            SCROLL TO EXPLORE
            <div></div>
          </div>
        </section>

        {/* ================================
            ABOUT PROGRAM
        ================================= */}

        <section className="about section">
          <div className="section-label">01 / ABOUT THE PROGRAM</div>

          <div className="about-grid">
            <div>
              <h2>ERP brings different functions of a business together.</h2>
            </div>

            <div>
              <p className="section-text">
                This course offers an opportunity to understand the systems,
                processes and thinking that enable organizations to operate
                efficiently.
              </p>
            </div>
          </div>

          <div className="program-cards">
            <div className="program-card">
              <span className="card-number">01</span>

              <h3>UNDERSTAND</h3>

              <p>
                Learn how enterprise systems connect different business
                functions.
              </p>
            </div>

            <div className="program-card">
              <span className="card-number">02</span>

              <h3>EXPERIENCE</h3>

              <p>
                Gain practical exposure to real-world ERP processes and
                workflows.
              </p>
            </div>

            <div className="program-card">
              <span className="card-number">03</span>

              <h3>GROW</h3>

              <p>
                Build knowledge that can help you understand modern business
                operations.
              </p>
            </div>
          </div>
        </section>

        {/* ================================
            FCFS
        ================================= */}

        <section className="fcfs-section section">
          <div className="fcfs-card">
            <div className="fcfs-left">
              <span className="fcfs-label">LIMITED PARTICIPATION</span>

              <h2>
                FIRST COME.
                <br />
                FIRST SERVE.
              </h2>
            </div>

            <div className="fcfs-right">
              <p>
                Registrations will be considered on a first-come, first-served
                basis.
              </p>

              <div className="fcfs-line"></div>

              <span>SECURE YOUR SPOT EARLY</span>
            </div>
          </div>
        </section>

        {/* ================================
            REGISTRATION
        ================================= */}

        <section className="registration section" id="registration">
          <div className="section-label">02 / REGISTER YOUR INTEREST</div>

          <div className="registration-heading">
            <h2>
              Be part of the
              <br />
              experience.
            </h2>

            <p className="section-text">
              Fill in your details below to register your interest in the
              Optimus ERP course.
            </p>
          </div>

          <form className="registration-form" onSubmit={handleSubmit}>
            {/* NAME + ROLL NUMBER */}

            <div className="form-row">
              <div className="form-group">
                <label>NAME</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>ROLL NUMBER</label>

                <input
                  type="text"
                  name="roll"
                  placeholder="Enter your roll number"
                  value={formData.roll}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* EMAIL + PROGRAMME */}

            <div className="form-row">
              <div className="form-group">
                <label>EMAIL ID</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>PROGRAMME</label>

                <select
                  name="programme"
                  value={formData.programme}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select your programme
                  </option>

                  <option value="MBA-FT A">MBA-FT A</option>

                  <option value="MBA-FT B">MBA-FT B</option>

                  <option value="MBA-FT C">MBA-FT C</option>

                  <option value="MBA-FT D">MBA-FT D</option>

                  <option value="MBA-FT E">MBA-FT E</option>

                  <option value="MBA-FT F">MBA-FT F</option>

                  <option value="FB">FB</option>

                  <option value="HRM">HRM</option>
                </select>
              </div>
            </div>

            {/* MAJOR + MINOR */}

            <div className="form-row">
              <div className="form-group">
                <label>INTENDED MAJOR</label>

                <input
                  type="text"
                  name="major"
                  placeholder="Enter your intended major"
                  value={formData.major}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>INTENDED MINOR</label>

                <input
                  type="text"
                  name="minor"
                  placeholder="Enter your intended minor"
                  value={formData.minor}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* AGREEMENT */}

            <div className="agreement-box">
              <label className="agreement">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree}
                  onChange={handleChange}
                  required
                />

                <span>
                  I agree to participate in the ERP course held by Optimus.
                </span>
              </label>
            </div>

            {/* SUBMIT */}

            <button type="submit" className="submit-button">
              SUBMIT REGISTRATION
              <span>↗</span>
            </button>
          </form>
        </section>

        {/* ================================
            INSTAGRAM
        ================================= */}

        <section className="instagram-section section">
          <div className="instagram-card">
            <div>
              <span className="section-label">03 / STAY UPDATED</span>

              <h2>
                More details
                <br />
                coming soon.
              </h2>

              <p>
                Further updates and opportunities related to the ERP course will
                be floated through our Instagram.
              </p>
            </div>

            <a
              href="https://www.instagram.com/optimus.imnu/"
              target="_blank"
              rel="noreferrer"
              className="instagram-button"
            >
              FOLLOW OPTIMUS
              <span>↗</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
