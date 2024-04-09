import { useState } from 'react';
import { useLoaderData, useSubmit } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

import styles from './statistics.module.css';
import { getStatistics } from '../../api';
import { NoData } from '../../../../components/NoData';
import { roundPercentagesToAddUpTo100, compareStats } from '../../utils';
import { formatDate } from '../../../../utils/format';
import useStopwatch from '../../../../hooks/useStopwatch';
import { StatisticsCardList } from '../../components/StatisticsCardList';
import { StatisticsDatePicker } from '../../components/StatisticsDatePicker';
import { getStartOf, getEndOf, isInFuture } from '../../utils';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { useDelayedLoadingIndicator } from '../../../records/hooks/useDelayedLoading';

export function Statistics() {
  const [period, setPeriod] = useState('day');
  const submit = useSubmit();
  const delayedLoading = useDelayedLoadingIndicator();
  const [dateStats, setDateStats] = useState(new Date());
  const loaderData = useLoaderData();
  const stopWatch = useStopwatch(new Date(loaderData.measuredAt));

  if (loaderData.stats.length === 0) {
    return (
      <>
        {delayedLoading ? <LoadingSpinner /> : <NoData />}
        <div className={styles.filterContainer}>
          <StatisticsDatePicker
            dateStats={dateStats}
            period={period}
            onChangeDate={handleChangeDate}
            onNextDate={handleNextDate}
            onPreviousDate={handlePreviousDate}
            onChangePeriod={handleChangePeriod}
          />
        </div>
      </>
    );
  }

  let stats = loaderData.stats.map((entry) => {
    if (entry.hasActive && isInFuture(getEndOf(period, dateStats))) {
      return { ...entry, totalTime: entry.totalTime + stopWatch };
    }
    return entry;
  });

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
      <div className={delayedLoading ? styles.loading : ''}>
        <ResponsiveContainer width="100%" height={210}>
          <PieChart className={styles.pieChart}>
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

        <StatisticsCardList stats={stats} sumOfTotalTimes={sumOfTotalTimes} />
      </div>

      <div className={styles.filterContainer}>
        <StatisticsDatePicker
          dateStats={dateStats}
          period={period}
          onChangeDate={handleChangeDate}
          onNextDate={handleNextDate}
          onPreviousDate={handlePreviousDate}
          onChangePeriod={handleChangePeriod}
        />
      </div>
    </div>
  );

  function handleChangePeriod(event) {
    setPeriod(event.target.value);
    const formData = new FormData();
    formData.append('date', formatDate(dateStats));
    formData.append('period', event.target.value);
    submit(formData);
    setDateStats(dateStats);
  }

  function handleChangeDate(date) {
    const formData = new FormData();
    formData.append('date', formatDate(date));
    formData.append('period', period);
    submit(formData);
    setDateStats(date);
  }

  function handlePreviousDate() {
    const previousDate = new Date(dateStats);
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
    const nextDate = new Date(dateStats);
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
