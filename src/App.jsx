import { useEffect, useRef, useState } from "react";
import "./App.css";

import optimusLogo from "./assets/logo.png";

// Paste your Google Apps Script Web App URL here (ends with /exec).
// See google-sheet/Code.gs for the one-time setup steps.
const SHEET_WEBAPP_URL =
  "https://script.google.com/macros/s/AKfycbxXjAZGojodKoH1iwkkfVJmdoZ3t8jC03IqmjB9BiTpqSkEHz9UlLPEzhIPOjbzOc32/exec";

// Where people are sent for further updates.
const OPTIMUS_INSTAGRAM_URL = "https://www.instagram.com/optimus.imnu/";
const OPTIMUS_INSTAGRAM_HANDLE = "@optimus.imnu";

function App() {
  const [introClosing, setIntroClosing] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showFollow, setShowFollow] = useState(false);
  // "tick" plays the checkmark animation, then flips to "page".
  const [followPhase, setFollowPhase] = useState("tick");
  const [submitting, setSubmitting] = useState(false);

  const tickTimer = useRef(null);

  const openFollow = () => {
    setFollowPhase("tick");
    setShowFollow(true);

    clearTimeout(tickTimer.current);
    tickTimer.current = setTimeout(() => setFollowPhase("page"), 1400);
  };

  const closeFollow = () => {
    clearTimeout(tickTimer.current);
    setShowFollow(false);
    setFollowPhase("tick");
  };

  useEffect(() => () => clearTimeout(tickTimer.current), []);

  const [formData, setFormData] = useState({
    name: "",
    roll: "",
    email: "",
    programme: "",
    major: "",
    minor: "",
    agree: false,
  });

  const [customMajor, setCustomMajor] = useState("");
  const [customMinor, setCustomMinor] = useState("");

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear custom field when switching away from Other
    if (name === "major" && value !== "Other") {
      setCustomMajor("");
    }

    if (name === "minor" && value !== "Other") {
      setCustomMinor("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agree) {
      alert("Please agree to participate in the ERP course.");
      return;
    }

    // Make sure custom values are entered when Other is selected
    if (formData.major === "Other" && !customMajor.trim()) {
      alert("Please enter your intended major.");
      return;
    }

    if (formData.minor === "Other" && !customMinor.trim()) {
      alert("Please enter your intended minor.");
      return;
    }

    // Final values that will actually be sent to MongoDB
    const submissionData = {
      ...formData,

      major: formData.major === "Other" ? customMajor.trim() : formData.major,

      minor: formData.minor === "Other" ? customMinor.trim() : formData.minor,
    };

    try {
      setSubmitting(true);

      // Apps Script can't send CORS headers on its response, so a normal
      // fetch would reject when the browser tries to read it. We POST with
      // mode:"no-cors" (body as text/plain, a "simple" request) — the row is
      // still written; the response is opaque and can't be read, so a request
      // that completes without a network error is treated as success.
      await fetch(SHEET_WEBAPP_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(submissionData),
      });

      openFollow();

      setFormData({
        name: "",
        roll: "",
        email: "",
        programme: "",
        major: "",
        minor: "",
        agree: false,
      });

      setCustomMajor("");
      setCustomMinor("");
    } catch (error) {
      console.error("Registration error:", error);
      alert("Could not submit your registration. Please try again.");
    } finally {
      setSubmitting(false);
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
          FOLLOW PAGE (after submit)
      ================================= */}

      {showFollow && (
        <div
          className="follow-page"
          role="dialog"
          aria-modal="true"
          aria-labelledby="follow-title"
        >
          <div className="follow-glow"></div>

          {followPhase === "tick" ? (
            <div className="tick-stage">
              <svg className="tick-svg" viewBox="0 0 100 100">
                <circle className="tick-circle" cx="50" cy="50" r="46" />
                <path className="tick-check" d="M28 51 L44 67 L73 34" />
              </svg>
            </div>
          ) : (
            <>
              <button
                className="follow-close"
                onClick={closeFollow}
                aria-label="Close"
              >
                ×
              </button>

              <div className="follow-inner">
                <div className="follow-logo-ring">
                  <img src={optimusLogo} alt="Optimus" className="follow-logo" />
                </div>

                <h2 id="follow-title" className="follow-headline">
                  REGISTRATION
                  <br />
                  SUCCESSFUL
                </h2>

                <div className="follow-tick">
                  <svg viewBox="0 0 52 52">
                    <circle cx="26" cy="26" r="24" />
                    <path d="M16 27 L23 34 L37 19" />
                  </svg>
                </div>

                <p className="follow-message">
                  Your spot is saved — but{" "}
                  <strong>
                    every update from here is shared only on our Instagram
                  </strong>
                  : seat releases, registration links and announcements.
                  Nowhere else.
                </p>

                <p className="follow-warning">
                  Don't follow, and you'll miss your seat.
                </p>

                <a
                  href={OPTIMUS_INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="follow-button"
                >
                  FOLLOW OPTIMUS ON INSTAGRAM
                  <span>↗</span>
                </a>

                <span className="follow-handle">
                  {OPTIMUS_INSTAGRAM_HANDLE}
                </span>

                <button className="follow-dismiss" onClick={closeFollow}>
                  I've followed — close
                </button>
              </div>
            </>
          )}
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
                <span>↓</span>
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
            WHAT YOU'LL LEARN
        ================================= */}

        <section className="about section">
          <div className="section-label">01 / WHAT YOU'LL LEARN</div>

          <div className="about-grid">
            <div>
              <h2>
                What you'll
                <br />
                learn.
              </h2>
            </div>

            <div>
              <p className="section-text">
                Gain deeper insights into Enterprise Systems and Enterprise
                Resource Planning solutions and understand their role in modern
                organizations.
              </p>
            </div>
          </div>

          <div className="program-cards">
            <div className="program-card">
              <span className="card-number">01</span>

              <h3>UNDERSTAND</h3>

              <p>
                Gain deeper insights into Enterprise Systems and Enterprise
                Resource Planning (ERP) solutions.
              </p>
            </div>

            <div className="program-card">
              <span className="card-number">02</span>

              <h3>IMPLEMENT</h3>

              <p>
                Build an understanding of the managerial considerations involved
                in selecting and implementing ERP systems.
              </p>
            </div>

            <div className="program-card">
              <span className="card-number">03</span>

              <h3>CREATE VALUE</h3>

              <p>
                Explore the value ERPs bring to organizations and why they are
                critical for business success.
              </p>
            </div>

            <div className="program-card">
              <span className="card-number">04</span>

              <h3>APPLY</h3>

              <p>
                Acquire practical knowledge to tackle real-world challenges
                related to ERP adoption and usage.
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
            {/* NAME + ROLL */}

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

                  <option value="IMBA">IMBA</option>

                  <option value="FB">FB</option>

                  <option value="HRM">HRM</option>
                </select>
              </div>
            </div>

            {/* MAJOR + MINOR */}

            <div className="form-row">
              {/* MAJOR */}

              <div className="form-group">
                <label>INTENDED MAJOR</label>

                <select
                  name="major"
                  value={formData.major}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select your intended major
                  </option>

                  <option value="Marketing">Marketing</option>

                  <option value="Finance">Finance</option>

                  <option value="Operations">Operations</option>

                  <option value="DnA">DnA</option>

                  <option value="Other">Other</option>
                </select>

                {/* CUSTOM MAJOR FIELD */}

                {formData.major === "Other" && (
                  <input
                    type="text"
                    name="customMajor"
                    placeholder="Enter your intended major"
                    value={customMajor}
                    onChange={(e) => setCustomMajor(e.target.value)}
                    required
                  />
                )}
              </div>

              {/* MINOR */}

              <div className="form-group">
                <label>INTENDED MINOR</label>

                <select
                  name="minor"
                  value={formData.minor}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select your intended minor
                  </option>

                  <option value="Marketing">Marketing</option>

                  <option value="Finance">Finance</option>

                  <option value="Operations">Operations</option>

                  <option value="DnA">DnA</option>

                  <option value="Other">Other</option>
                </select>

                {/* CUSTOM MINOR FIELD */}

                {formData.minor === "Other" && (
                  <input
                    type="text"
                    name="customMinor"
                    placeholder="Enter your intended minor"
                    value={customMinor}
                    onChange={(e) => setCustomMinor(e.target.value)}
                    required
                  />
                )}
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

            <button
              type="submit"
              className="submit-button"
              disabled={submitting}
            >
              {submitting ? "SUBMITTING…" : "SUBMIT REGISTRATION"}
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
