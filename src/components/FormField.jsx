function FormField({ label, name, type = 'text', value, onChange, error }) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>

      {type === 'textarea' ? (
        <textarea id={name} name={name} value={value} onChange={onChange} rows="5" />
      ) : (
        <input id={name} name={name} type={type} value={value} onChange={onChange} />
      )}

      {error && <div className="field-error">{error}</div>}
    </div>
  )
}

export default FormField
