import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useLoaderData, useSubmit } from 'react-router-dom';

import styles from './statistics.module.css';
import { StatisticsCard } from '../../components/StatisticsCard';
import { roundPercentagesToAddUpTo100, compareStats } from '../../utils';
import { getStatistics } from '../../api';
import { DatePicker } from '../../../../components/DatePicker';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useState } from 'react';
import { NoData } from '../../../../components/NoData';
import { formatDate } from '../../../../utils/format';
import useStopwatch from '../../../../hooks/useStopwatch';

const periodOptions = [
  { id: 1, value: 'day', name: 'Day' },
  { id: 2, value: 'week', name: 'Week' },
  { id: 3, value: 'month', name: 'Month' },
  { id: 4, value: 'year', name: 'Year' },
];

const dateFormat = {
  day: 'dd.MM.yyyy',
  week: 'dd.MM.yyyy (w)',
  month: 'MMMM yyyy',
  year: 'yyyy',
};

export function Statistics() {
  const [period, setPeriod] = useState('day');
  const submit = useSubmit();
  const [date, setDate] = useState(new Date());
  const loaderData = useLoaderData();
  const stopWatch = useStopwatch(new Date(loaderData.measuredAt));

  let stats = loaderData.stats.map((entry) => {
    if (entry.hasActive) {
      return { ...entry, totalTime: entry.totalTime + stopWatch };
    }
    return entry;
  });
  if (stats.length === 0) {
    return (
      <>
        {' '}
        <NoData />
        <div className={styles.filterContainer}>
          <div className={styles.dateContainer}>
            <PeriodSelect selected={period} onChange={(event) => setPeriod(event.target.value)} />
            <FaChevronLeft className={styles.arrow} onClick={handlePreviousDate} />
            <DatePicker
              onChange={handleChangeDate}
              selected={date}
              showWeekPicker={period === 'week'}
              showMonthPicker={period === 'month'}
              showYearPicker={period === 'year'}
              format={dateFormat[period]}
            />
            <FaChevronRight className={styles.arrow} onClick={handleNextDate} />
          </div>
        </div>{' '}
      </>
    );
  }

  const sumOfTotalTimes = stats.reduce(
    (accumulator, currentData) => accumulator + currentData.totalTime,
    0
  );

  stats = stats.map((entry) => ({
    ...entry,
    percent: (entry.totalTime / sumOfTotalTimes) * 100,
  }));
  stats = roundPercentagesToAddUpTo100(stats).toSorted(compareStats);

  return (
    <div className={styles.pageWrapper}>
      <ResponsiveContainer width="100%" height={210}>
        <PieChart>
          <Pie
            animationDuration={0}
            data={stats}
            dataKey="totalTime"
            innerRadius={55}
            outerRadius={85}
            fill="#8884d8"
            paddingAngle={stats.length > 1 ? 1 : 0}
            cx="50%"
            cy="50%"
            startAngle={90}
            endAngle={450}
          >
            {stats.map((entry) => (
              <Cell key={`cell-${entry.activityId}`} fill={entry.color} className={styles.cell} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className={styles.statisticCardsContainer}>
        {stats.toReversed().map((entry) => (
          <StatisticsCard key={entry.activityId} data={entry} percentage={entry.percent} />
        ))}
        <div className={styles.horizontalLine}></div>
        <StatisticsCard
          data={{ totalTime: sumOfTotalTimes, color: '#fff', activityName: 'Total time' }}
          showPercentage={false}
        />
      </div>

      <div className={styles.filterContainer}>
        <div className={styles.dateContainer}>
          <PeriodSelect
            selected={period}
            onChange={(event) => {
              setPeriod(event.target.value);
              const formData = new FormData();
              formData.append('date', formatDate(date));
              formData.append('period', event.target.value);
              submit(formData);
              setDate(date);
            }}
          />
          <FaChevronLeft className={styles.arrow} onClick={handlePreviousDate} />
          <DatePicker
            onChange={handleChangeDate}
            selected={date}
            showWeekPicker={period === 'week'}
            showMonthPicker={period === 'month'}
            showYearPicker={period === 'year'}
            format={dateFormat[period]}
          />
          <FaChevronRight className={styles.arrow} onClick={handleNextDate} />
        </div>
      </div>
    </div>
  );

  function handleChangeDate(date) {
    const formData = new FormData();
    formData.append('date', formatDate(date));
    formData.append('period', period);
    submit(formData);
    setDate(date);
  }

  function handlePreviousDate() {
    const previousDate = new Date(date);
    switch (period) {
      case 'day':
        previousDate.setDate(previousDate.getDate() - 1);
        handleChangeDate(previousDate);
        break;
      case 'week':
        previousDate.setDate(previousDate.getDate() - 7);
        handleChangeDate(previousDate);
        break;
      case 'month':
        previousDate.setMonth(previousDate.getMonth() - 1);
        handleChangeDate(previousDate);
        break;
      case 'year':
        previousDate.setFullYear(previousDate.getFullYear() - 1);
        handleChangeDate(previousDate);
        break;
      default:
        throw new Error('Invalid statistics period');
    }
  }

  function handleNextDate() {
    const nextDate = new Date(date);
    switch (period) {
      case 'day':
        nextDate.setDate(nextDate.getDate() + 1);
        handleChangeDate(nextDate);
        break;
      case 'week':
        nextDate.setDate(nextDate.getDate() + 7);
        handleChangeDate(nextDate);
        break;
      case 'month':
        nextDate.setMonth(nextDate.getMonth() + 1);
        handleChangeDate(nextDate);
        break;
      case 'year':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        handleChangeDate(nextDate);
        break;
      default:
        throw new Error('Invalid statistics period');
    }
  }
}

export async function statisticsLoader({ request }) {
  const url = new URL(request.url);
  const dateString = url.searchParams.get('date');
  const date = dateString ? new Date(dateString) : new Date().toISOString();
  const period = url.searchParams.get('period') || 'day';
  const start = getStartOf(period, date);
  const end = getEndOf(period, date);

  const { response, data } = await getStatistics(new Date().getTimezoneOffset(), {
    from: start,
    to: end,
  });

  if (!response.ok) {
    throw new Error(data.error);
  }

  return data;
}

function PeriodSelect({ selected, onChange }) {
  return (
    <select
      name="type"
      id="type"
      className={styles.selectInput}
      value={selected}
      onChange={onChange}
    >
      {periodOptions.map((entry) => (
        <option key={entry.id} value={entry.value}>
          {entry.name}
        </option>
      ))}
    </select>
  );
}

function getStartOf(period, date) {
  if (period === 'day') {
    return getStartOfDay(date);
  } else if (period === 'week') {
    return getStartOfWeek(date);
  } else if (period === 'month') {
    return getStartOfMonth(date);
  } else {
    return getStartOfYear(date);
  }
}

function getEndOf(period, date) {
  if (period === 'day') {
    return getEndOfDay(date);
  } else if (period === 'week') {
    return getEndOfWeek(date);
  } else if (period === 'month') {
    return getEndOfMonth(date);
  } else {
    return getEndOfYear(date);
  }
}

const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function getStartOfDay(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
}

function getEndOfDay(date) {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 59);
  return endOfDay;
}

function getStartOfWeek(date) {
  let dayOfWeek = date.getDay();
  if (dayOfWeek === 0) {
    dayOfWeek = 7;
  }
  const startOfWeek = new Date(date);
  startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + 1);
  return getStartOfDay(startOfWeek);
}

function getEndOfWeek(date) {
  let dayOfWeek = date.getDay();
  if (dayOfWeek === 0) {
    dayOfWeek = 7;
  }
  const endOfWeek = new Date(date);
  endOfWeek.setDate(date.getDate() + (7 - dayOfWeek));
  return getEndOfDay(endOfWeek);
}

function getStartOfMonth(date) {
  const startOfMonth = new Date(date);
  startOfMonth.setDate(1);
  return getStartOfDay(startOfMonth);
}

function getEndOfMonth(date) {
  const endOfMonth = new Date(date);
  endOfMonth.setDate(getDaysInMonth(date));
  return getEndOfDay(endOfMonth);
}

function getStartOfYear(date) {
  const startOfYear = new Date(date);
  startOfYear.setMonth(0, 1);
  return getStartOfDay(startOfYear);
}

function getEndOfYear(date) {
  const endOfYear = new Date(date);
  endOfYear.setMonth(11, 31);
  return getEndOfDay(endOfYear);
}

function getDaysInMonth(date) {
  if (date.getMonth() === 1 && isLeapYear(date.getFullYear())) {
    return 29;
  }
  return daysPerMonth[date.getMonth()];
}

function isLeapYear(year) {
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}
