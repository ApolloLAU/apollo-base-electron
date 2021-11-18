export default function EditableText({
  isEditMode,
  value,
  onChange,
  name,
  isPassword = false,
}) {
  if (isEditMode) {
    return (
      <input
        type={isPassword ? 'password' : 'text'}
        onChange={onChange}
        value={value}
        name={name}
      />
    );
  }

  return <p>{value}</p>;
}
