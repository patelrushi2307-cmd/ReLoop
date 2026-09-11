import { useEffect, useState } from "react";
import "./supply-loop-landing.css";
import { useBodyScrollable } from "../hooks/use-body-scrollable.js";

const STEPS = [
  ["01", "↗", "List", "Put idle material back in motion."],
  ["02", "◈", "Grade", "Make quality visible and comparable."],
  ["03", "⌁", "Match", "Find a nearby use before a new load."],
  ["04", "◎", "Carbon-check", "Price the full journey, not just the deal."],
  ["05", "⇄", "Negotiate", "Agree on value with the real context."],
  ["06", "⊕", "Consolidate", "Bundle compatible loads together."],
  ["07", "→", "Move", "Ship only when the numbers make sense."],
  ["08", "✓", "Certify", "Leave a clear record of the impact."],
];

const IMPACT_TARGETS = [
  ["Material kept in play", 18420, "tonnes"],
  ["Shorter empty miles", 68, "%"],
  ["Verified exchanges", 1248, "this month"],
];

const CAPABILITIES = [
  ["Source", "See what is available nearby before buying new."],
  ["Place", "Move surplus through a trusted, transparent network."],
  ["Verify", "Know the grade, route, and carbon case before you commit."],
];

const formatImpact = (value) => new Intl.NumberFormat("en-US").format(value);

const ImpactCounter = () => {
  const [values, setValues] = useState(() => IMPACT_TARGETS.map(() => 0));

  useEffect(() => {
    const started = performance.now();
    const duration = 1400;
    let frame = 0;
    const tick = (now) => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - (1 - progress) ** 3;
      setValues(IMPACT_TARGETS.map(([, target]) => Math.round(target * eased)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="loop-impact" aria-label="Live network impact">
      <div className="loop-impact-heading">
        <span className="loop-live-dot" aria-hidden="true" /> Live network impact
      </div>
      <div className="loop-impact-grid">
        {IMPACT_TARGETS.map(([label, target, suffix], index) => (
          <div className="loop-impact-item" key={label}>
            <strong>{formatImpact(values[index])}{suffix === "%" ? "%" : ""}</strong>
            <span>{label}{suffix !== "%" ? ` · ${suffix}` : ""}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SupplyLoopLanding = () => {
  const [authMode, setAuthMode] = useState(null);

  useBodyScrollable();

  useEffect(() => {
    document.title = "Re:Source — Keep material in motion";
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", "A live network for putting surplus material to work before it becomes waste.");
    if (typeof IntersectionObserver === "undefined") return undefined;
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      }),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".loop-section, .loop-impact").forEach((element) => revealObserver.observe(element));
    return () => revealObserver.disconnect();
  }, []);

  return (
    <main className="loop-page">
      <nav className="loop-nav" aria-label="Main navigation">
        <a className="loop-wordmark" href="/" aria-label="Re:Source home"><span>re:</span>source</a>
        <div className="loop-nav-links">
          <a href="#how-it-works">How it works</a>
          <a href="#radius">Break-even radius</a>
          <button className="loop-nav-cta" type="button" onClick={() => setAuthMode("login")}>Sign up / Log in</button>
        </div>
      </nav>

      <section className="loop-hero">
        <iframe
          className="loop-hero-globe"
          src="/embed?look=bloom&autoSpin=1&source=landing-hero"
          title="Live network of material exchanges"
          loading="eager"
          aria-hidden="true"
        />
        <div className="loop-hero-wash" aria-hidden="true" />
        <div className="loop-hero-content">
          <p className="loop-kicker">The circular supply network</p>
          <h1>Waste is a logistics problem.<br /><em>Let’s solve it in motion.</em></h1>
          <p className="loop-hero-copy">Re:Source connects surplus material with its next useful life, nearby. One live network for better matches, shorter routes, and proof that the exchange made sense.</p>
          <div className="loop-actions">
            <a className="loop-button loop-button--solid" href="#join">Get started <span aria-hidden="true">↗</span></a>
            <a className="loop-button loop-button--ghost" href="#how-it-works">See the loop <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="loop-hero-note"><span>01</span> One network. Less waste. Better moves.</div>
      </section>

      <ImpactCounter />

      <section className="loop-section loop-problem" id="problem">
        <div className="loop-section-label">The problem / 02</div>
        <div className="loop-problem-intro">
          <h2>We keep making new things while useful things sit still.</h2>
          <p>Every idle pallet, roll, panel, and load has a clock running on it. The missing layer is not ambition. It is shared visibility.</p>
        </div>
        <div className="loop-stat-grid">
          <article><strong>2.1B</strong><span>tonnes of material waste created each year</span><small>01 / volume</small></article>
          <article><strong>40%</strong><span>of truck journeys return with empty capacity</span><small>02 / distance</small></article>
          <article><strong>1 in 3</strong><span>material exchanges fail without clear trust signals</span><small>03 / friction</small></article>
        </div>
      </section>

      <section className="loop-section loop-process" id="how-it-works">
        <div className="loop-section-label">The core loop / 03</div>
        <div className="loop-section-heading"><h2>From idle to useful<br /><em>in eight clear moves.</em></h2><p>Every exchange follows the same simple logic. The network does the hard work of making the next move obvious.</p></div>
        <div className="loop-stepper">
          {STEPS.map(([number, icon, title, copy]) => <article key={title} className="loop-step"><div className="loop-step-top"><span>{number}</span><strong aria-hidden="true">{icon}</strong></div><div><h3>{title}</h3><p>{copy}</p></div></article>)}
        </div>
      </section>

      <section className="loop-section loop-radius" id="radius">
        <div className="loop-section-label">The differentiator / 04</div>
        <div className="loop-radius-grid">
          <div className="loop-radius-copy"><h2>Every match has a <em>break-even radius.</em></h2><p>If the truck ride costs more carbon than the material saves, we say no.</p><span className="loop-rule">Good logistics is knowing when not to move.</span></div>
          <div className="loop-radius-graphic" role="img" aria-label="A green break-even radius around a source, with red routes outside the radius"><div className="loop-radius-ring"><span className="loop-radius-source">SOURCE</span><span className="loop-radius-label loop-radius-label--inside">worth moving</span><span className="loop-radius-label loop-radius-label--outside">not worth it</span></div><div className="loop-route loop-route--one" /><div className="loop-route loop-route--two" /></div>
        </div>
      </section>

      <section className="loop-section loop-capabilities" id="capabilities">
        <div className="loop-section-label">One network / 05</div>
        <div className="loop-section-heading"><h2>Different roles.<br /><em>Shared capability.</em></h2><p>Re:Source is not a buyer or seller fork. It is the infrastructure between the people who make, move, and need material.</p></div>
        <div className="loop-capability-grid">{CAPABILITIES.map(([title, copy], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p><a href="#join">Explore capability <span aria-hidden="true">↗</span></a></article>)}</div>
      </section>

      <section className="loop-join" id="join"><div className="loop-join-mark" aria-hidden="true">↗</div><p className="loop-kicker">The next useful move starts here</p><h2>Keep good material<br /><em>in motion.</em></h2><button className="loop-button loop-button--light" type="button" onClick={() => setAuthMode("signup")}>Sign up / Log in <span aria-hidden="true">↗</span></button><p className="loop-join-note">One account. Every capability. No fork in the road.</p></section>
      <footer className="loop-footer"><span>re:source</span><span>Material, matched better.</span><a href="#problem">Back to top ↑</a></footer>
      {authMode ? (
        <div className="loop-auth-backdrop" role="presentation" onMouseDown={() => setAuthMode(null)}>
          <section className="loop-auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="loop-auth-close" type="button" aria-label="Close account form" onClick={() => setAuthMode(null)}>×</button>
            <p className="loop-kicker">Re:Source account</p>
            <h2 id="auth-title">{authMode === "login" ? "Welcome back." : "Start moving material."}</h2>
            <div className="loop-auth-switcher" role="tablist" aria-label="Account access">
              <button type="button" className={authMode === "login" ? "is-active" : ""} onClick={() => setAuthMode("login")}>Log in</button>
              <button type="button" className={authMode === "signup" ? "is-active" : ""} onClick={() => setAuthMode("signup")}>Sign up</button>
            </div>
            <form className="loop-auth-form" onSubmit={(event) => event.preventDefault()}>
              <label>Company name<input name="company" type="text" placeholder="Your company" required /></label>
              <label>Email address<input name="email" type="email" placeholder="you@company.com" required /></label>
              <label>Password<input name="password" type="password" placeholder="At least 8 characters" minLength="8" required /></label>
              {authMode === "signup" ? <label>Re-enter password<input name="passwordConfirmation" type="password" placeholder="Repeat your password" minLength="8" required /></label> : null}
              <button className="loop-auth-submit" type="submit">{authMode === "login" ? "Log in" : "Create account"}<span aria-hidden="true">↗</span></button>
            </form>
            <p className="loop-auth-note">Account access is ready for your company details. No page navigation.</p>
          </section>
        </div>
      ) : null}
    </main>
  );
};
