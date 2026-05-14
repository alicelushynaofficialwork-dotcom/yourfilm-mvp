export default function HeroSection({ copy }) {
  return (
    <section className="hero">
      <div>
        <p className="eyebrow">{copy.hero.eyebrow}</p>
        <h1>{copy.hero.title}</h1>
        <p className="hero-copy">{copy.hero.copy}</p>
        <div className="hero-actions" aria-label="Главные действия">
          <a className="primary-action" href="#recommendation">
            {copy.hero.primary}
          </a>
          <a className="ghost-action" href="#how-it-works">
            {copy.hero.secondary}
          </a>
        </div>
      </div>
      <aside className="assistant-preview" aria-label="Пример ответа ИИ-помощника">
        <p className="eyebrow">{copy.hero.assistant}</p>
        <p className="assistant-question">{copy.hero.question}</p>
        <div className="assistant-answer">
          <strong>{copy.hero.answerTitle}</strong>
          <span>{copy.hero.answerText}</span>
        </div>
      </aside>
    </section>
  );
}
