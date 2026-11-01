import React, { useState, useMemo } from 'react';
import {
  Flame,
  Trophy,
  Calendar as CalendarIcon,
  CheckCircle2,
  Droplets,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Target,
  BarChart2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Cell,
  CartesianGrid,
} from 'recharts';
import { useApp } from '../context/AppContext';

export const ProgressHistory: React.FC = () => {
  const { profile, todayRecord, historyRecords, theme } = useApp();
  const [selectedMonthOffset, setSelectedMonthOffset] = useState<number>(0);

  const isOz = profile.unit === 'oz';
  const unitLabel = isOz ? 'oz' : 'ml';
  const isDark = theme === 'dark';

  const formatVol = (ml: number) => {
    if (isOz) return `${(ml * 0.033814).toFixed(1)} oz`;
    return `${ml} ml`;
  };

  // Create lookup map of records by date string
  const recordsMap = useMemo(() => {
    const map = new Map<string, { intake: number; goal: number; achieved: boolean }>();
    historyRecords.forEach((r) => {
      map.set(r.date, { intake: r.totalIntake, goal: r.goal, achieved: r.goalAchieved });
    });
    map.set(todayRecord.date, {
      intake: todayRecord.totalIntake,
      goal: todayRecord.goal,
      achieved: todayRecord.goalAchieved,
    });
    return map;
  }, [historyRecords, todayRecord]);

  // Calendar dates generation
  const today = new Date();
  const targetDate = new Date(today.getFullYear(), today.getMonth() + selectedMonthOffset, 1);
  const monthName = targetDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  // Empty offset days
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  // Days of the month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const rec = recordsMap.get(dateStr);
    calendarDays.push({
      day: d,
      dateStr,
      achieved: rec?.achieved || false,
      hasData: Boolean(rec && rec.intake > 0),
      intake: rec?.intake || 0,
      isToday: dateStr === todayRecord.date,
    });
  }

  // Generate 7-Day Hydration Chart Data
  const last7DaysData = useMemo(() => {
    const result = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayLabel = i === 0 ? 'Today' : i === 1 ? 'Yday' : dayNames[d.getDay()];
      const rec = recordsMap.get(dateStr);
      const rawIntake = rec?.intake || 0;
      const rawGoal = rec?.goal || profile.dailyGoal;
      const achieved = rec?.achieved || (rawIntake >= rawGoal);
      const displayIntake = isOz ? Number((rawIntake * 0.033814).toFixed(1)) : rawIntake;
      const displayGoal = isOz ? Number((rawGoal * 0.033814).toFixed(1)) : rawGoal;

      result.push({
        day: dayLabel,
        dateStr,
        intake: displayIntake,
        rawIntake,
        goal: displayGoal,
        rawGoal,
        achieved,
        isToday: i === 0,
        pct: Math.min(100, Math.round((rawIntake / rawGoal) * 100)),
      });
    }
    return result;
  }, [recordsMap, profile.dailyGoal, isOz]);

  // Calculate 7-day stats
  const total7DayRawIntake = last7DaysData.reduce((acc, curr) => acc + curr.rawIntake, 0);
  const avg7DayRawIntake = Math.round(total7DayRawIntake / 7);
  const goalsHitCount = last7DaysData.filter((d) => d.achieved).length;
  const targetVal = isOz ? Number((profile.dailyGoal * 0.033814).toFixed(0)) : profile.dailyGoal;

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-4 space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-3xl bg-amber-50 dark:bg-[#131e18] border border-amber-200/80 dark:border-[#1e352a] shadow-xs flex items-center gap-3 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Flame className="w-7 h-7 fill-amber-100" />
          </div>
          <div>
            <span className="text-2xl font-black text-amber-950 dark:text-amber-300 block">
              {profile.currentStreak}
            </span>
            <span className="text-xs font-bold text-amber-800 dark:text-amber-400">Current Streak Days</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-emerald-50 dark:bg-[#131e18] border border-emerald-200/80 dark:border-[#1e352a] shadow-xs flex items-center gap-3 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <span className="text-2xl font-black text-emerald-950 dark:text-emerald-300 block">
              {profile.longestStreak}
            </span>
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">Longest Streak</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-cyan-50 dark:bg-[#131e18] border border-cyan-200/80 dark:border-[#1e352a] shadow-xs flex items-center gap-3 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-2xl font-black text-cyan-950 dark:text-cyan-300 block">
              {profile.totalSuccessfulDays}
            </span>
            <span className="text-xs font-bold text-cyan-800 dark:text-cyan-400">Hydration Days Won</span>
          </div>
        </div>
      </div>

      {/* 7-DAY WATER INTAKE BAR CHART (RECHARTS) */}
      <div className="rounded-3xl bg-white dark:bg-[#131e18] border border-stone-200/80 dark:border-[#1e352a] shadow-xs p-5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-800 dark:text-emerald-50">
                Last 7 Days Water Intake
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Daily volume compared to your {formatVol(profile.dailyGoal)} goal
              </p>
            </div>
          </div>

          {/* Quick Metrics Pills */}
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
            <div className="px-2.5 py-1 rounded-xl bg-stone-100 dark:bg-[#0d1410] border border-stone-200/80 dark:border-[#1e352a] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-stone-600 dark:text-stone-300 font-semibold">
                Avg: <strong className="text-stone-800 dark:text-emerald-200">{formatVol(avg7DayRawIntake)}</strong>/day
              </span>
            </div>

            <div className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-800 dark:text-emerald-300 font-bold">
                {goalsHitCount}/7 Goals Hit
              </span>
            </div>
          </div>
        </div>

        {/* Recharts Bar Chart Container */}
        <div className="w-full h-64 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={last7DaysData}
              margin={{ top: 15, right: 10, left: -15, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isDark ? '#1a2e24' : '#f1f5f9'}
              />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={{ stroke: isDark ? '#1e352a' : '#e2e8f0' }}
                tick={{ fill: isDark ? '#a7f3d0' : '#64748b', fontSize: 11, fontWeight: 600 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: isDark ? '#6ee7b7' : '#94a3b8', fontSize: 10 }}
                unit={isOz ? 'oz' : ''}
              />
              <Tooltip
                cursor={{ fill: isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(2, 132, 199, 0.06)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="p-3 rounded-2xl bg-stone-900/95 dark:bg-[#07110c]/95 text-white border border-emerald-500/30 shadow-xl backdrop-blur-md text-xs space-y-1">
                        <div className="flex items-center justify-between gap-4 font-bold border-b border-stone-800 pb-1">
                          <span className="text-emerald-400">{data.day} ({data.dateStr})</span>
                          {data.achieved && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-md border border-emerald-400/30">
                              Goal Hit 💧
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-4 pt-0.5">
                          <span className="text-stone-400">Intake:</span>
                          <span className="font-extrabold text-white">
                            {data.intake} {unitLabel}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-stone-400">Daily Target:</span>
                          <span className="font-medium text-stone-300">
                            {data.goal} {unitLabel}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-[11px] pt-1 border-t border-stone-800 text-stone-400">
                          <span>Completion:</span>
                          <span className="font-bold text-emerald-400">{data.pct}%</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine
                y={targetVal}
                stroke="#10b981"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `Target (${targetVal}${unitLabel})`,
                  fill: isDark ? '#34d399' : '#059669',
                  fontSize: 10,
                  position: 'insideTopRight',
                  fontWeight: 700,
                }}
              />
              <Bar dataKey="intake" radius={[8, 8, 2, 2]}>
                {last7DaysData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.achieved
                        ? isDark
                          ? '#10b981'
                          : '#059669'
                        : isDark
                        ? '#0284c7'
                        : '#38bdf8'
                    }
                    className="transition-all hover:opacity-85 cursor-pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Legend */}
        <div className="flex items-center justify-center gap-6 text-xs text-stone-500 dark:text-stone-400 mt-2 pt-3 border-t border-stone-100 dark:border-[#1e352a]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-emerald-600 dark:bg-emerald-500" />
            <span>Target Achieved (100%+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-sky-400 dark:bg-sky-600" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 border-t border-dashed border-emerald-500" />
            <span>Goal Line</span>
          </div>
        </div>
      </div>

      {/* Visual Streak Calendar */}
      <div className="rounded-3xl bg-white dark:bg-[#131e18] border border-stone-200/80 dark:border-[#1e352a] shadow-xs p-5 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-stone-800 dark:text-emerald-50">Hydration Streak Calendar</h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedMonthOffset((prev) => prev - 1)}
              type="button"
              className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-[#1a2b22] text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300 min-w-[120px] text-center">
              {monthName}
            </span>
            <button
              onClick={() => setSelectedMonthOffset((prev) => Math.min(0, prev + 1))}
              disabled={selectedMonthOffset >= 0}
              type="button"
              className={`p-1.5 rounded-xl transition-colors ${
                selectedMonthOffset >= 0
                  ? 'text-stone-300 dark:text-stone-600 cursor-not-allowed'
                  : 'hover:bg-stone-100 dark:hover:bg-[#1a2b22] text-stone-600 dark:text-stone-300 cursor-pointer'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-stone-400 dark:text-stone-500 mb-2">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {calendarDays.map((item, idx) => {
            if (!item) {
              return <div key={`empty-${idx}`} className="h-10 rounded-xl" />;
            }

            return (
              <div
                key={item.dateStr}
                title={`${item.dateStr}: ${formatVol(item.intake)}`}
                className={`h-11 rounded-xl flex flex-col items-center justify-center relative text-xs font-bold transition-all border ${
                  item.achieved
                    ? 'bg-emerald-500 dark:bg-emerald-600 border-emerald-600 dark:border-emerald-500 text-white shadow-xs'
                    : item.hasData
                    ? 'bg-cyan-100/70 dark:bg-cyan-950/60 border-cyan-300 dark:border-cyan-800 text-cyan-900 dark:text-cyan-200'
                    : item.isToday
                    ? 'bg-amber-100/70 dark:bg-amber-950/60 border-amber-400 dark:border-amber-700 text-amber-900 dark:text-amber-200'
                    : 'bg-stone-50 dark:bg-[#0d1410] border-stone-200/50 dark:border-[#1e352a] text-stone-600 dark:text-stone-400'
                }`}
              >
                <span>{item.day}</span>
                {item.achieved && (
                  <span className="text-[10px] leading-none">💧</span>
                )}
                {item.isToday && !item.achieved && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400 absolute bottom-1" />
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-xs text-stone-500 dark:text-stone-400 mt-4 pt-3 border-t border-stone-100 dark:border-[#1e352a]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-emerald-500" />
            <span>Goal Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-cyan-100 dark:bg-cyan-950 border border-cyan-300 dark:border-cyan-800" />
            <span>Water Logged</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-amber-100 dark:bg-amber-950 border border-amber-400 dark:border-amber-700" />
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* Today's Hydration Entries Log */}
      <div className="rounded-3xl bg-white dark:bg-[#131e18] border border-stone-200/80 dark:border-[#1e352a] shadow-xs p-5 transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-base font-bold text-stone-800 dark:text-emerald-50">Today's Drinking Activity</h2>
          </div>
          <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
            {todayRecord.drinks.length} recorded servings
          </span>
        </div>

        {todayRecord.drinks.length === 0 ? (
          <div className="py-8 text-center text-stone-400 dark:text-stone-500 text-xs">
            No water logged yet today. Tap the Fill Up button to quench your cactus!
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {todayRecord.drinks.map((entry, idx) => (
              <div
                key={entry.id || idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-[#0d1410] border border-stone-200/60 dark:border-[#1e352a]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 flex items-center justify-center text-xs font-bold border border-transparent dark:border-cyan-900/60">
                    #{idx + 1}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-stone-800 dark:text-emerald-100 block">
                      +{formatVol(entry.amount)}
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">{entry.time}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-800/60">
                    +{entry.growthAdded}% Growth
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
