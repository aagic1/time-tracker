import { useState } from 'react';
import {
  Form,
  Link,
  redirect,
  useLoaderData,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';

import styles from './record-editor.module.css';
import { DatePicker } from '../../../../components/DatePicker';
import { getActivities } from '../../../activities/api/index.js';
import { createRecord, deleteRecord, getRecord, updateRecord } from '../../api/index.js';
import { RecordPreview } from '../../components/RecordPreview';
import { ActivityPicker } from '../../../activities/components/ActivityPicker';

export function RecordEditor() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { record, activities, editorType } = useLoaderData();

  const [startDate, setStartDate] = useState(new Date(record.startedAt));
  const [stopDate, setStopDate] = useState(record.stoppedAt ? new Date(record.stoppedAt) : null);

  const [activityId, setActivityId] = useState(record.activityId);
  const selectedActivity = activities.find((activity) => activity.id === activityId);

  const previousPath = location.state?.from;
  let allRecordsRedirectPath = '/records';
  const cancelRedirectPath = previousPath ? previousPath : '/records';

  if (editorType === 'create' && searchParams.has('date')) {
    allRecordsRedirectPath = '/records?' + searchParams.toString();
  } else if (editorType === 'update' && previousPath) {
    const previousPathname = previousPath.split('?')[0];
    if (previousPathname === '/records') {
      allRecordsRedirectPath = previousPath;
    }
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.formContainer}>
        <Form className={styles.form} method="POST">
          <input type="hidden" name="redirectPath" value={cancelRedirectPath} />
          <input type="hidden" name="startedAt" value={startDate} />
          <input type="hidden" name="stoppedAt" value={stopDate || undefined} />

          <div className={styles.header}>
            <Link className={styles.allRecordsLink} to={allRecordsRedirectPath}>
              <FaArrowLeft />
              All records
            </Link>
            {editorType !== 'create' && (
              <button className={styles.deleteButton} type="submit" name="intent" value="delete">
                <FaTrash className={styles.trashIcon} />
              </button>
            )}
          </div>

          <div className={styles.previewContainer}>
            <RecordPreview startedAt={startDate} stoppedAt={stopDate} activity={selectedActivity} />
          </div>

          <div className={styles.datesContainer}>
            <div className={styles.datePickerContainer}>
              <label htmlFor="startedAt">Started at</label>
              <DatePicker
                wrapperClassName={styles.datePickerWrapper}
                showTimeInput
                selected={startDate}
                onChange={handleChangeStartDate}
                maxDate={!stopDate ? new Date() : null}
                minTime={null}
                maxTime={!stopDate ? new Date() : null}
              />
            </div>
            {stopDate && (
              <div className={styles.datePickerContainer}>
                <label htmlFor="stoppedAt">Stopped at</label>
                <DatePicker
                  wrapperClassName={styles.datePickerWrapper}
                  showTimeInput
                  selected={stopDate}
                  onChange={handleChangeStopDate}
                />
              </div>
            )}
          </div>

          <div className={styles.activityContainer}>
            <ActivityPicker
              activities={activities}
              selectedActivity={selectedActivity}
              onChange={(e) => setActivityId(e.target.value)}
              id="activity"
            />
          </div>

          <div className={styles.buttonContainer}>
            <button type="submit" name="intent" value={editorType} className={styles.formButton}>
              Save
            </button>
            <button className={styles.formButton} type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </Form>
      </div>
    </div>
  );

  function handleCancel() {
    navigate(cancelRedirectPath);
  }

  function handleChangeStartDate(newDate) {
    setStartDate(newDate);
    if (stopDate && newDate > stopDate) {
      return setStopDate(newDate);
    }

    const dateNow = new Date();
    if (!stopDate && newDate > dateNow) {
      setStartDate(dateNow);
    }
  }

  function handleChangeStopDate(newDate) {
    setStopDate(newDate);
    if (newDate < startDate) {
      setStartDate(newDate);
    }
  }
}

export async function recordEditorUpdateLoader({ params }) {
  const recordId = params.recordId;

  const recordPromise = getRecord(recordId);
  const activitiesPromise = getActivities({ archived: false });

  const [
    { response: recordResponse, data: recordData },
    { response: activitiesResponse, data: activitiesData },
  ] = await Promise.all([recordPromise, activitiesPromise]);

  if (!recordResponse.ok && !activitiesResponse.ok) {
    console.log('failed to fetch record and activities for record editor (update)');
    throw new Error('failed to fetch record and activities for record editor (update)');
  } else if (!recordResponse.ok) {
    console.log('failed to fetch record for record editor (update)');
    throw new Error('failed to fetch record for record editor (update)');
  } else if (!activitiesResponse.ok) {
    console.log('failed to fetch activities for record editor (update)');
    throw new Error('failed to fetch activities for record editor (update)');
  }

  return {
    record: recordData,
    activities: activitiesData,
    editorType: 'update',
  };
}

export async function recordEditorCreateLoader({ request }) {
  const { response, data } = await getActivities({ archived: false });

  if (!response.ok) {
    console.log('failed to fetch activities for record editor (create)');
    throw new Error('failed to fetch activities for record editor (create)');
  }

  let date = new Date();
  const searchParams = new URL(request.url).searchParams;
  if (searchParams.has('date')) {
    let paramDate = new Date(searchParams.get('date') + 'Z');
    paramDate.setHours(
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    );
    date = paramDate;
  }

  const placeholderRecord = {
    recordId: null,
    startedAt: date,
    stoppedAt: date,
    activityId: null,
  };

  return {
    record: placeholderRecord,
    activities: data,
    editorType: 'create',
  };
}

export async function recordEditorAction({ request, params }) {
  const formData = await request.formData();
  const startedAt = formData.get('startedAt');
  const stoppedAt = formData.get('stoppedAt');
  const activityId = formData.get('activityId');
  const intent = formData.get('intent');
  const redirectPath = formData.get('redirectPath');
  const recordId = params.recordId;

  const body = {
    startedAt: new Date(startedAt),
    stoppedAt: stoppedAt ? new Date(stoppedAt) : null,
    activityId,
  };

  let response, data;
  switch (intent.toLowerCase()) {
    case 'delete': {
      ({ response, data } = await deleteRecord(recordId));
      break;
    }
    case 'update': {
      ({ response, data } = await updateRecord(recordId, body));
      break;
    }
    case 'create': {
      ({ response, data } = await createRecord(body));
      break;
    }
    default: {
      throw new Error('Unrecognized intent in record editor form ');
    }
  }

  if (!response.ok) {
    return data.error;
  }

  return redirect(redirectPath);
}
