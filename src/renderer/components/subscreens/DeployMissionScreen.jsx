import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { API, Mission, MWorker } from '../../api/API';

export default function DeployMissionScreen() {
  const { id } = useParams();
  const [currentMission, setCurrentMission] = useState(undefined);
  const [fieldWorkers, setFieldWorkers] = useState([]);
  const [subscription, setSubscription] = useState(undefined);

  useEffect(() => {
    Mission.getByID(id)
      .then((m) => m.fetch())
      .then((m) => setCurrentMission(m));

    const user = API.getLoggedInUser();
    if (user) {
      API.getWorkerForUser(user)
        .then((w) => {
          if (w) {
            return w.fetch();
          }
          throw new Error('Worker does not exist');
        })
        .then((w) => {
          const d = w.getDistrict();
          const query = MWorker.getFieldWorkerQuery(d);
          return query;
        })
        .then((q) => {
          q.find().then((workers) => setFieldWorkers(workers));
          return q.subscribe();
        })
        .then((sub) => setSubscription(sub));
    }
  }, []);

  useEffect(() => {
    if (subscription) {
      subscription.on('update', (w) => {
        console.log(w); // FIXME: update the field workers list.
      });
    }
    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [subscription]);

  if (currentMission === undefined) {
    return <div />;
  }

  return (
    <div>
      <form>
        <table>
          <tbody>
            <tr>
              <td>
                <label>Mission ID</label>
              </td>
              <td>
                <input disabled type="text" value={id} />
              </td>
              <td rowSpan={2}>
                <label>Initial Description</label>
              </td>
              <td rowSpan={2}>
                <textarea type="text" style={{ resize: 'none' }} />
              </td>
            </tr>
            <tr>
              <td>
                <label>Patients:</label>
              </td>
              <td>
                <p>{currentMission.formatPatientNames()}</p>
                <button type="button">Edit Patient Information</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <div>
        <h2>Field Team Members</h2>
        <div />
      </div>
      <button type="button">Deploy</button>
    </div>
  );
}
