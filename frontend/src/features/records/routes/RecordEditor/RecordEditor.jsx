import { useState } from 'react';
import {
  Form,
  Link,
  redirect,
  useLoaderData,
  useLocation,
  useSearchParams,
} from 'react-router-dom';
import { FaArrowLeft, FaBan, FaTrash } from 'react-icons/fa';

import styles from './record-editor.module.css';
import DatePicker from 'react-datepicker';
// make css modules work instead of regular css file
import 'react-datepicker/dist/react-datepicker.css';
import useStopwatch from '../../../../hooks/useStopwatch.js';

export async function loaderUpdate({ params }) {
  const recordId = params.recordId;

  const recordPromise = fetch(`http://localhost:8000/api/v1/records/${recordId}`, {
    credentials: 'include',
  });
  const activitiesPromise = fetch(`http://localhost:8000/api/v1/activities?archived=false`, {
    credentials: 'include',
  });

  const [recordResponse, activitiesResponse] = await Promise.all([
    recordPromise,
    activitiesPromise,
  ]);

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
    record: await recordResponse.json(),
    activitiesData: await activitiesResponse.json(),
    editorType: 'update',
  };
}

export async function loaderCreate({ request }) {
  const res = await fetch(`http://localhost:8000/api/v1/activities?archived=false`, {
    credentials: 'include',
  });

  if (!res.ok) {
    console.log('failed to fetch activities for record editor (create)');
    throw new Error('failed to fetch activities for record editor (create)');
  }

  let date = new Date();
  const searchParams = new URL(request.url).searchParams;
  if (searchParams.has('date')) {
    let searchDate = new Date(searchParams.get('date'));
    searchDate.setHours(
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    );
    date = searchDate;
  }

  const placeholderRecord = {
    recordId: null,
    startedAt: date,
    stoppedAt: date,
    activityId: null,
  };

  return {
    record: placeholderRecord,
    activitiesData: await res.json(),
    editorType: 'create',
  };
}

export async function action({ request, params }) {
  const formData = await request.formData();
  const startedAt = formData.get('startedAt');
  const stoppedAt = formData.get('stoppedAt');
  const activityId = formData.get('activityId');
  const redirectPath = formData.get('redirectPath');
  const recordId = params.recordId;

  const body = {
    startedAt: new Date(startedAt),
    stoppedAt: stoppedAt ? new Date(stoppedAt) : null,
    activityId,
  };

  let res;
  if (request.method === 'DELETE') {
    res = await fetch(`http://localhost:8000/api/v1/records/${recordId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  } else if (request.method === 'POST') {
    res = await fetch('http://localhost:8000/api/v1/records', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } else if (request.method === 'PATCH') {
    res = await fetch(`http://localhost:8000/api/v1/records/${recordId}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } else {
    throw new Error('record editor error - invalid http method');
  }

  if (!res.ok) {
    const errorData = await res.json();
    console.log('record editor error');
    console.log(errorData.error.message);
    return errorData.error;
  }

  console.log('hiho');
  return redirect(redirectPath);

  // const recordId = params.recordId;
  // if (recordId) {
  //   const res = fetch(`http://locahost:8000/api/v1/records/${recordId}`, {
  //     method: 'PATCH',
  //     credentials: 'include',
  //     // body:
  //   })

  // }
  // const res = fetch('http://locahost:8000/api/v1/records', {
  //   method: 'POST',
  //   credentials: 'include',
  //   body:
  // })
}

export default function RecordEditor() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const {
    record,
    activitiesData: { activities },
    editorType,
  } = useLoaderData();

  const [startDate, setStartDate] = useState(new Date(record.startedAt));
  const [stopDate, setStopDate] = useState(record.stoppedAt ? new Date(record.stoppedAt) : null);

  const [activityId, setActivityId] = useState(record.activityId);
  const selectedActivity = activities.find((activity) => activity.id === activityId);

  const fromPath = location.state?.from && location.state.from;

  const cancelRedirectPath = fromPath ? fromPath : '/records';

  let allRecordsRedirectPath = '/records';
  if (editorType === 'create' && searchParams.has('date')) {
    allRecordsRedirectPath = '/records?' + searchParams.toString();
  } else if (editorType === 'update' && fromPath) {
    const pathname = fromPath.split('?')[0];
    if (pathname === '/records') {
      allRecordsRedirectPath = fromPath;
    }
  }

  function handleDateChange(newDate) {
    setStartDate(newDate);
    if (stopDate && newDate > stopDate) {
      return setStopDate(newDate);
    }

    const dateNow = new Date();
    if (!stopDate && newDate > dateNow) {
      setStartDate(dateNow);
    }
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <Link className={styles.allRecordsLink} to={allRecordsRedirectPath}>
            <FaArrowLeft />
            All records
          </Link>
          {editorType !== 'create' && (
            <Form method="DELETE">
              <input type="hidden" name="redirectPath" value={cancelRedirectPath} />
              <button className={styles.deleteButton} type="submit">
                <FaTrash className={styles.trashIcon} />
              </button>
            </Form>
          )}
        </div>
        <div className={styles.previewContainer}>
          <RecordPreview startedAt={startDate} stoppedAt={stopDate} activity={selectedActivity} />
        </div>
        <Form className={styles.form} method={editorType === 'update' ? 'PATCH' : 'POST'}>
          <input type="hidden" name="redirectPath" value={cancelRedirectPath} />
          <input type="hidden" name="startedAt" value={startDate} />
          <input type="hidden" name="stoppedAt" value={stopDate || undefined} />
          <div className={styles.datesContainer}>
            <div className={styles.datePickerContainer}>
              <label htmlFor="startedAt">Started at</label>
              <DatePicker
                wrapperClassName={styles.datePickerWrapper}
                className={styles.datePicker}
                calendarStartDay={1}
                dateFormat="MMM dd  HH:mm"
                timeFormat="HH:mm"
                showTimeInput
                selected={startDate}
                onChange={handleDateChange}
                todayButton="Today"
                showIcon
                maxDate={!stopDate ? new Date() : null}
                time
                minTime={null}
                maxTime={!stopDate ? new Date() : null}
                // maxTime={!stopDate ? new Date() : null}
                // name="startedAt"
                // value={startDate}
              />
            </div>

            {stopDate && (
              <div className={styles.datePickerContainer}>
                <label htmlFor="stoppedAt">Stopped at</label>
                <DatePicker
                  wrapperClassName={styles.datePickerWrapper}
                  className={styles.datePicker}
                  calendarStartDay={1}
                  dateFormat="MMM dd  HH:mm"
                  showTimeInput
                  selected={stopDate}
                  onChange={(date) => setStopDate(date)}
                  todayButton="Today"
                  showIcon
                  // name="stoppedAt"
                  // value={stopDate}
                />
              </div>
            )}
          </div>
          <div className={styles.activityContainer}>
            <label htmlFor="activity">Activity</label>
            <select
              className={styles.dropdown}
              name="activityId"
              id="activity"
              onChange={(e) => setActivityId(e.target.value)}
              defaultValue={selectedActivity ? selectedActivity.id : 'placeholder'}
            >
              <option disabled value="placeholder">
                Choose activity
              </option>
              {activities
                .toSorted((a, b) => a.name.localeCompare(b.name))
                .map((activity) => (
                  <option key={activity.id} value={activity.id}>
                    {activity.name}
                  </option>
                ))}
            </select>
          </div>
          <div className={styles.buttonContainer}>
            {}
            <button type="submit">Save</button>
            <button className={styles.cancelButton} type="button">
              <Link className={styles.cancelLink} to={cancelRedirectPath} relative="path">
                Cancel
              </Link>
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}

function RecordPreview({ startedAt, stoppedAt, activity }) {
  const timer = useStopwatch(startedAt);
  const elapsedTime = stoppedAt ? formatTimeConcise(stoppedAt - startedAt) : formatTimeHMS(timer);

  const name = activity ? activity.name : <FaBan />;
  const color = activity ? activity.color : '#999';

  return (
    <div className={styles.recordContainer} style={{ backgroundColor: color }}>
      <div className={styles.left}>
        <div className={styles.name}>{name}</div>
        <div className={styles.startEndTimeContainer}>
          <span>{formatTimeFromDate(new Date(startedAt))}</span>
          {stoppedAt && (
            <>
              <span>-</span>
              <span>{formatTimeFromDate(new Date(stoppedAt))}</span>
            </>
          )}
        </div>
      </div>
      <div className={styles.right}>
        <span className={styles.elapsedTime}>{elapsedTime}</span>
      </div>
    </div>
  );
}

// function toIntervalFromTime(timeMS) {
//   let hours = Math.trunc(timeMS / (1000 * 60 * 60));
//   let minutes = Math.trunc((timeMS % (1000 * 60 * 60)) / (60 * 1000));
//   let seconds = Math.round((timeMS % (1000 * 60)) / 1000);
//   let miliseconds = timeMS % 1000;
//   return { hours, minutes, seconds, miliseconds };
// }

function formatTimeFromDate(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

function formatIntervalHMS(interval) {
  let formated = '';
  if (interval.hours) {
    formated += interval.hours + 'h ';
  }
  if (interval.minutes || formated.length > 0) {
    formated += interval.minutes + 'm ';
  }
  formated += interval.seconds + 's';
  return formated;
}

function formatTimeHMS(miliseconds) {
  const hours = Math.trunc(miliseconds / (1000 * 60 * 60));
  const minutes = Math.trunc((miliseconds % (1000 * 60 * 60)) / (60 * 1000));
  const seconds = Math.round((miliseconds % (1000 * 60)) / 1000);
  // moze pokazati 1s vise ili manje, dodatno obraditi

  return formatIntervalHMS({ hours, minutes, seconds });
}

function formatTimeConcise(miliseconds) {
  const hours = Math.trunc(miliseconds / (1000 * 60 * 60));
  const minutes = Math.trunc((miliseconds % (1000 * 60 * 60)) / (60 * 1000));
  const seconds = Math.round((miliseconds % (1000 * 60)) / 1000);
  return formatIntervalConcise({ hours, minutes, seconds });
}

function formatIntervalConcise(interval) {
  let formated = '';
  if (interval.hours) {
    formated += interval.hours + 'h ' + interval.minutes + 'm';
  } else if (interval.minutes) {
    formated += interval.minutes + 'm ' + interval.seconds + 's';
  } else {
    formated += interval.seconds + 's';
  }
  return formated;
}
