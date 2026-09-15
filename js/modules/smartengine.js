// Smart Decision Engine: Deterministic recommendation to eliminate decision fatigue
import { getLocalDateString } from '../state.js';

export function getSmartRecommendations(state, now = new Date()) {
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTotalMins = currentHour * 60 + currentMinute;
  const dayOfWeek = now.getDay();
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
  const todayStr = getLocalDateString(now);

  const recs = [];

  // 1. College schedule hours (09:00 - 17:00 weekday)
  const isCollegeHours = isWeekday && currentTotalMins >= 540 && currentTotalMins < 1020;
  if (isCollegeHours) {
    recs.push({
      id: 'rec-college',
      title: 'Active Lab & Lecture Focus: Computer Engineering',
      duration: 50,
      durationMinutes: 50,
      durationLabel: '50 min',
      reason: `You are in your 09:00 AM — 05:00 PM college block. Focus on practical lab work and core concepts.`,
      category: 'study',
      actionType: 'focus',
      actionTab: 'focus',
      priority: 'College Schedule'
    });
  }

  // 2. Hydration check
  if (state.water?.currentGlasses < 4 && currentHour >= 14) {
    recs.push({
      id: 'rec-water',
      title: 'Hydrate: Drink 1-2 glasses of water',
      duration: 2,
      durationMinutes: 2,
      durationLabel: '2 min',
      reason: `You have had ${state.water?.currentGlasses || 0}/${state.water?.targetGlasses || 8} glasses. Hydration keeps cognitive stamina sharp.`,
      category: 'habit',
      actionType: 'water',
      actionTab: 'health',
      priority: 'Energy Boost'
    });
  }

  // 3. Today's Top 3 Incomplete
  const topIncomplete = (state.tasks || []).filter(t => t.isTop3 && t.status !== 'completed');
  if (topIncomplete.length > 0) {
    const top = topIncomplete[0];
    const dur = top.estimatedMinutes || 25;
    recs.push({
      id: `rec-task-${top.id}`,
      title: top.title,
      duration: dur,
      durationMinutes: dur,
      durationLabel: `${dur} min`,
      reason: `Locked in your "Today's Top 3" priorities. Knocking this out eliminates today's mental burden.`,
      category: top.category?.toLowerCase().includes('multitask') ? 'project' : 'task',
      actionType: 'focus',
      actionTab: 'focus',
      targetId: top.id,
      priority: 'Top 3 Priority'
    });
  }

  // 4. MultitaskCoder Flagship
  const multitask = (state.projects || []).find(p => p.name.toLowerCase().includes('multitaskcoder'));
  if (multitask && currentHour >= 17 && currentHour < 21) {
    recs.push({
      id: 'rec-multitask',
      title: `MultitaskCoder: ${multitask.nextTask || 'Advance Debugger Module'}`,
      duration: 35,
      durationMinutes: 35,
      durationLabel: '35 min',
      reason: `You are at ${multitask.progress}% completion. Advancing the debugger moves your flagship project toward production.`,
      category: 'project',
      actionType: 'focus',
      actionTab: 'focus',
      priority: 'Flagship Project'
    });
  }

  // 5. Engineering Study (Java / DSA)
  const todayStudyLogs = (state.studySessions || []).filter(s => s.date === todayStr);
  const studiedJava = todayStudyLogs.some(s => s.subjectName.toLowerCase().includes('java'));
  if (!studiedJava && (currentHour >= 17 || !isWeekday)) {
    recs.push({
      id: 'rec-java',
      title: 'Study Java Streams & Exception Handling',
      duration: 30,
      durationMinutes: 30,
      durationLabel: '30 min',
      reason: `Planned Java study today hasn't been logged yet. A 30m block locks in daily engineering progress.`,
      category: 'study',
      actionType: 'focus',
      actionTab: 'focus',
      priority: 'Core Academic'
    });
  }

  // 6. Gym Split
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todaySplit = state.fitness?.weeklySplit?.[dayNames[dayOfWeek]];
  if (todaySplit && todaySplit !== 'Rest & Recovery' && !state.fitness?.todayWorkoutDone && currentHour >= 17) {
    recs.push({
      id: 'rec-gym',
      title: `Workout Session: ${todaySplit}`,
      duration: 45,
      durationMinutes: 45,
      durationLabel: '45 min',
      reason: `Today's split is ${todaySplit}. Completing this preserves your workout consistency and boosts your focus score.`,
      category: 'fitness',
      actionType: 'fitness',
      actionTab: 'health',
      priority: 'Physical Resilience'
    });
  }

  // Fallback
  if (recs.length === 0) {
    const uncompleted = (state.tasks || []).find(t => t.status !== 'completed');
    if (uncompleted) {
      const dur = uncompleted.estimatedMinutes || 25;
      recs.push({
        id: `rec-uncompleted-${uncompleted.id}`,
        title: uncompleted.title,
        duration: dur,
        durationMinutes: dur,
        durationLabel: `${dur} min`,
        reason: `Next item on your queue. Quick Pomodoro will get it done.`,
        category: 'task',
        actionType: 'focus',
        actionTab: 'focus',
        priority: 'Next in Queue'
      });
    } else {
      recs.push({
        id: 'rec-free',
        title: 'Rest, Stretch or Learn Something New',
        duration: 20,
        durationMinutes: 20,
        durationLabel: '20 min',
        reason: `You have cleared your queue for today! Reward yourself with restful downtime or creative coding.`,
        category: 'routine',
        actionType: 'routine',
        actionTab: 'home',
        priority: 'Rest & Recharge'
      });
    }
  }

  return recs;
}
