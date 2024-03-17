import { useState } from 'react';
import {
  useLoaderData,
  useNavigate,
  useSearchParams,
  useSubmit,
  useLocation,
  useNavigation,
} from 'react-router-dom';
import { FaPlusCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import styles from './records.module.css';
import { ActiveRecordCard } from '../../components/ActiveRecordCard';
import { RecordCard } from '../../components/RecordCard';
import { useDelayedLoadingIndicator } from '../../hooks/useDelayedLoading';
import { getRecords } from '../../api';
import { dateToISOStringWithoutTime } from '../../../../utils/format';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';

export function Records() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const records = useLoaderData();
  const navigation = useNavigation();
  const delayedLoading = useDelayedLoadingIndicator();
  const [date, setDate] = useState(
    searchParams.has('date') ? new Date(searchParams.get('date')) : new Date()
  );
  const currentDate = searchParams.has('date') ? new Date(searchParams.get('date')) : new Date();

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.dateContainer}>
        <FaChevronLeft className={styles.arrow} onClick={handlePreviousDay} />
        <DatePicker
          className={styles.datePicker}
          dateFormat="dd.MM.yyyy"
          calendarStartDay={1}
          showIcon
          selected={date}
          onChange={handleChangeDate}
          yearDropdownItemNumber={50}
          showYearDropdown
          scrollableYearDropdown={true}
          showMonthDropdown
          todayButton="Today"
        />
        <FaChevronRight className={styles.arrow} onClick={handleNextDay} />
      </div>
      {records.length === 0 ? (
        <div className={styles.noDataContainer}>
          <div className={styles.noData}>
            {navigation.state === 'loading' && delayedLoading ? <LoadingSpinner /> : 'No data'}
          </div>
        </div>
      ) : (
        <RecordsList
          records={records}
          currentDate={currentDate}
          handleClick={handleRecordClick}
          className={navigation.state === 'loading' && delayedLoading ? styles.loading : ''}
        />
      )}
      <div className={styles.addContainer}>
        <div className={styles.addButton} onClick={handleNewRecord}>
          <FaPlusCircle className={styles.addIcon} />
        </div>
      </div>
    </div>
  );

  function handleNewRecord() {
    navigate(`create?date=${dateToISOStringWithoutTime(currentDate)}`, {
      state: {
        from: location.pathname + location.search,
      },
    });
  }

  function handleNextDay() {
    setDate((d) => {
      const formData = new FormData();
      const nextDate = new Date(d);
      nextDate.setDate(d.getDate() + 1);
      formData.set('date', dateToISOStringWithoutTime(nextDate));
      submit(formData);
      return nextDate;
    });
  }

  function handlePreviousDay() {
    setDate((d) => {
      const formData = new FormData();
      const previousDate = new Date(d);
      previousDate.setDate(d.getDate() - 1);
      formData.set('date', dateToISOStringWithoutTime(previousDate));
      submit(formData);
      return previousDate;
    });
  }

  function handleChangeDate(date) {
    const formData = new FormData();
    formData.append('date', dateToISOStringWithoutTime(date));
    submit(formData);
    setDate(date);
  }

  function handleRecordClick(record) {
    navigate(record.recordId, {
      state: { from: location.pathname + location.search },
    });
  }
}

export async function recordsLoader({ request }) {
  const search = new URL(request.url).searchParams;
  if (!search.has('date')) {
    search.set('date', dateToISOStringWithoutTime(new Date()));
  }

  const date = search.get('date');

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const searchString = `dateFrom=${startOfDay.toISOString()}&dateTo=${endOfDay.toISOString()}`;
  const { response, data } = await getRecords(searchString);

  if (!response.ok) {
    console.log('error while loading records');
    throw new Error('Failed to load records');
  }
  return await data;
}

function RecordsList({ records, currentDate, handleClick, className }) {
  return (
    <div className={`${styles.recordsContainer} ${className}`}>
      {records
        .toSorted((a, b) => new Date(b.startedAt) - new Date(a.startedAt))
        .map((record) =>
          record.stoppedAt !== null ? (
            <RecordCard
              key={record.recordId}
              record={record}
              forDate={currentDate}
              onClick={() => handleClick(record)}
            />
          ) : (
            <ActiveRecordCard
              record={record}
              key={record.recordId}
              showStopwatch
              onClick={() => handleClick(record)}
            />
          )
        )}
    </div>
  );
}
