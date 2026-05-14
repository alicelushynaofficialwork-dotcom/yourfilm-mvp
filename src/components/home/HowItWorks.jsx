export default function HowItWorks({ copy }) {
  return (
    <section className="how-section" id="how-it-works">
      <div className="section-heading">
        <p className="eyebrow">{copy.how.eyebrow}</p>
        <h2>{copy.how.title}</h2>
      </div>
      <div className="step-grid">
        {copy.how.steps.map((step, index) => (
          <article className="step-card" key={step[0]}>
            <span>{index + 1}</span>
            <h3>{step[0]}</h3>
            <p>{step[1]}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
