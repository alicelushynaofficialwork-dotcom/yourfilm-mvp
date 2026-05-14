import { localizeMood } from '../../utils/localization.js';

export default function MoodQuickSelect({
  copy,
  customMood,
  language,
  moods,
  selectedMood,
  onCustomMoodChange,
  onSelectMood,
}) {
  return (
    <section className="section-panel" id="moods">
      <p className="eyebrow">{copy.moods.eyebrow}</p>
      <h2>{copy.moods.title}</h2>
      <div className="mood-list">
        {moods.map((mood) => {
          const localizedMood = localizeMood(mood, language);

          return (
            <button
              className={mood.id === selectedMood ? 'chip active' : 'chip'}
              key={mood.id}
              type="button"
              onClick={() => onSelectMood(mood.id)}
            >
              <span>{localizedMood.label}</span>
              <small>{localizedMood.description}</small>
            </button>
          );
        })}
      </div>
      <label className="custom-mood">
        <span>{copy.moods.customLabel}</span>
        <textarea
          value={customMood}
          onChange={(event) => onCustomMoodChange(event.target.value)}
          placeholder={copy.moods.customPlaceholder}
          rows="3"
        />
        <small>{copy.moods.customHint}</small>
      </label>
    </section>
  );
}
