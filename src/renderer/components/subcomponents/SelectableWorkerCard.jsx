import placeholder from '../../../../assets/empty-profile-picture.png';
import styles from './css/SelectableWorkerCard.module.css';

export default function SelectableWorkerCard({
  imgSrc,
  name,
  status,
  isSelected,
  setSelected,
}) {
  const onAttemptSelect = () => {
    if (status === 'online') setSelected(!isSelected);
  };
  return (
    <div
      className={!isSelected ? styles.card : styles.cardSelected}
      onClick={onAttemptSelect}
      role="button"
      tabIndex={0}
    >
      <img
        src={imgSrc || placeholder}
        alt="profile"
        className={
          status === 'online'
            ? styles.profileOnline
            : status === 'busy'
            ? styles.profileBusy
            : styles.profileOffline
        }
      />
      <div>
        <p
          className={
            isSelected
              ? styles.textSelected
              : status === 'offline'
              ? styles.textOffline
              : styles.textDefault
          }
        >
          {name}
        </p>
      </div>
    </div>
  );
}
