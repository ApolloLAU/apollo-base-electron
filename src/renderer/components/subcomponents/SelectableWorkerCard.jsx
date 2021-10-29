export default function SelectableWorkerCard({
  imgSrc,
  name,
  status,
  isSelected,
}) {
  return (
    <div>
      <img src={imgSrc} alt="profile" />
      <div>
        <p>{name}</p>
      </div>
    </div>
  );
}
