import {
  useLoaderData,
  useNavigate,
  useNavigation,
  useSearchParams,
  useSubmit,
  useLocation,
} from 'react-router-dom';
import styles from './records.module.css';
import { FaPlusCircle, FaStopwatch } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
//  make css modules work instead of regular css file
import 'react-datepicker/dist/react-datepicker.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ActiveRecord from '../../components/ActiveRecord/ActiveRecord';

export async function recordsLoader({ request }) {
  const search = new URL(request.url).searchParams;

  if (!search.has('date')) {
    search.set('date', extractDateWithoutTime(new Date()));
  }

  const date = search.get('date');

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const searchString = `dateFrom=${startOfDay.toISOString()}&dateTo=${endOfDay.toISOString()}`;
  const res = await fetch(`http://localhost:8000/api/v1/records?${searchString}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    console.log('error while loading records');
    throw new Error('error while loading records');
  }
  return await res.json();
}

export function Records() {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationLoading = useNavigationLoading();
  const records = useLoaderData();
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const [date, setDate] = useState(
    searchParams.has('date') ? new Date(searchParams.get('date')) : new Date()
  );
  console.log(records);

  const currentDate = searchParams.has('date') ? new Date(searchParams.get('date')) : new Date();

  function handleNext() {
    setDate((d) => {
      const formData = new FormData();
      const nextDate = new Date(d);
      nextDate.setDate(d.getDate() + 1);
      formData.set('date', extractDateWithoutTime(nextDate));
      submit(formData);
      return nextDate;
    });
  }

  function handlePrevious() {
    setDate((d) => {
      const formData = new FormData();
      const previousDate = new Date(d);
      previousDate.setDate(d.getDate() - 1);
      formData.set('date', extractDateWithoutTime(previousDate));
      submit(formData);
      return previousDate;
    });
  }

  function handleChange(date) {
    const formData = new FormData();
    formData.append('date', extractDateWithoutTime(date));
    submit(formData);
    setDate(date);
  }

  function handleClick(record) {
    navigate(record.recordId, {
      state: { from: location.pathname + location.search },
    });
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.dateContainer}>
        <FaChevronLeft className={styles.arrow} onClick={handlePrevious} />
        <DatePicker
          className={styles.datePicker}
          dateFormat="dd.MM.yyyy"
          calendarStartDay={1}
          showIcon
          selected={date}
          onChange={handleChange}
          yearDropdownItemNumber={50}
          showYearDropdown
          scrollableYearDropdown={true}
          showMonthDropdown
          todayButton="Today"
          na
        />
        <FaChevronRight className={styles.arrow} onClick={handleNext} />
      </div>
      <div className={`${styles.recordsContainer} ${navigationLoading ? styles.loading : ''}`}>
        {records.length === 0 ? (
          <div className={styles.noData}>No data</div>
        ) : (
          records
            .toSorted((a, b) => new Date(b.startedAt) - new Date(a.startedAt))
            .map((record) => {
              if (record.stoppedAt) {
                return (
                  <RecordCard
                    key={record.recordId}
                    record={record}
                    forDate={currentDate}
                    onClick={() => handleClick(record)}
                  />
                );
              }
              return (
                <ActiveRecord
                  record={record}
                  key={record.recordId}
                  showStopwatch
                  onClick={() => handleClick(record)}
                />
              );
            })
        )}
      </div>
      <div className={styles.addContainer}>
        <div
          className={styles.addButton}
          onClick={() =>
            navigate(`create?date=${extractDateWithoutTime(currentDate)}`, {
              state: {
                from: location.pathname + location.search,
              },
            })
          }
        >
          <FaPlusCircle className={styles.addIcon} />
        </div>
      </div>
    </div>
  );
}

export function RecordCard({ record, forDate, onClick }) {
  const startDate = new Date(record.startedAt);
  const stopDate = record.stoppedAt ? new Date(record.stoppedAt) : null;
  const startTime = hasRecordStartedOnDate(record, forDate)
    ? formatTimeFromDate(startDate)
    : '00:00';

  const stopTime = hasRecordStoppedOnDate(record, forDate) ? formatTimeFromDate(stopDate) : '00:00';

  const duration = formatDuration(startDate, stopDate, forDate);

  return (
    <div
      style={{ backgroundColor: '#' + record.color }}
      className={styles.card}
      onClick={() => onClick(record)}
    >
      <div className={styles.left}>
        <div className={styles.name}>{record.activityName}</div>
        <div className={styles.startedAtContainer}>
          <div className={styles.startedAt}>
            <span className={styles.startDate}>{startTime}</span>
            {stopDate && (
              <>
                <span className={styles.separator}> - </span>
                <span className={styles.startTime}>{stopTime}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.timesContainer}>
          <div className={styles.elapsedTime}>{duration}</div>
          {record.stoppedAt == null && <FaStopwatch />}
        </div>
      </div>
    </div>
  );
}

//
// ----------------------
//    custom hook
// ----------------------
//
function useNavigationLoading() {
  const navigation = useNavigation();
  const [shouldGreyOut, setShouldGreyOut] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (navigation.state === 'loading') {
      timeoutId = setTimeout(() => {
        setShouldGreyOut(true);
      }, 100);
    } else if (navigation.state === 'idle') {
      setShouldGreyOut(false);
    }

    return () => clearTimeout(timeoutId);
  }, [navigation.state]);

  return shouldGreyOut;
}

//
// ----------------------
//    helper functions
// ----------------------
//
function extractDateWithoutTime(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function isSameDate(date1, date2) {
  return (
    date1.getFullYear() == date2.getFullYear() &&
    date1.getMonth() == date2.getMonth() &&
    date1.getDate() == date2.getDate()
  );
}

function hasRecordStartedOnDate(record, date) {
  const startedAt = new Date(record.startedAt);
  return isSameDate(startedAt, date);
}

function hasRecordStoppedOnDate(record, date) {
  const stoppedAt = new Date(record.stoppedAt);
  return isSameDate(stoppedAt, date);
}

function formatTimeFromDate(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

function subtractFrom(stopDate) {
  return function (startDate) {
    return stopDate - startDate;
  };
}

function formatDuration(startedAt, stoppedAt, forDate) {
  const startOfDay = new Date(forDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(forDate);
  endOfDay.setHours(23, 59, 59, 999);

  const subtractFromEndDate =
    stoppedAt < endOfDay ? subtractFrom(stoppedAt) : subtractFrom(endOfDay);
  const elapsedTime =
    startedAt > startOfDay ? subtractFromEndDate(startedAt) : subtractFromEndDate(startOfDay);

  const MILISECONDS_PER_DAY = 86400000;

  let { hours, minutes, seconds } = toIntervalFromTime(elapsedTime);
  if (hours >= 24 || MILISECONDS_PER_DAY - elapsedTime <= 1) {
    return '24h 0m';
  }

  let intervalString = '';
  if (hours) {
    intervalString += hours + 'h ';
  }
  if (minutes || hours) {
    intervalString += minutes + 'm';
  }
  if (!minutes && !hours) {
    intervalString += ' ' + seconds + 's';
  }

  return intervalString;
}

function toIntervalFromTime(timeMS) {
  let hours = Math.trunc(timeMS / (1000 * 60 * 60));
  let minutes = Math.trunc((timeMS % (1000 * 60 * 60)) / (60 * 1000));
  let seconds = Math.round((timeMS % (1000 * 60)) / 1000);
  let miliseconds = timeMS % 1000;
  return { hours, minutes, seconds, miliseconds };
}
