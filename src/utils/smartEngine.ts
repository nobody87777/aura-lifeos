import { AppData, Task, Subject } from '../types';

export interface SmartRecommendation {
  id: string;
  title: string;
  durationLabel: string;
  durationMinutes: number;
  reason: string;
  category: 'study' | 'project' | 'fitness' | 'habit' | 'task' | 'routine';
  actionType: 'focus' | 'task' | 'habit' | 'fitness' | 'reflection';
  targetId?: string;
  priorityText: string;
}

export function generateSmartRecommendations(data: AppData, now: Date = new Date()): SmartRecommendation[] {
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTotalMinutes = currentHour * 60 + currentMinute;
  const dayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
  const todayStr = now.toISOString().split('T')[0];

  const recommendations: SmartRecommendation[] = [];

  // 1. Time-of-day contextual analysis
  // Morning block: 05:00 - 08:30 (300 to 510 mins)
  const isMorning = currentTotalMinutes >= 300 && currentTotalMinutes < 510;
  // College block: 09:00 - 17:00 (540 to 1020 mins)
  const isCollegeHours = isWeekday && currentTotalMinutes >= 540 && currentTotalMinutes < 1020;
  // Evening block: 17:00 - 21:00 (1020 to 1260 mins)
  const isEvening = currentTotalMinutes >= 1020 && currentTotalMinutes < 1260;
  // Night block: 21:00 - 23:30 (1260 to 1410 mins)
  const isNight = currentTotalMinutes >= 1260 || currentTotalMinutes < 300;

  // Hydration check
  if (data.water.currentGlasses < 4 && currentHour >= 14) {
    recommendations.push({
      id: 'rec-water',
      title: 'Hydrate: Drink 1-2 glasses of water',
      durationLabel: '2 min',
      durationMinutes: 2,
      reason: `You have had ${data.water.currentGlasses}/${data.water.targetGlasses} glasses today. Proper hydration keeps your cognitive focus sharp.`,
      category: 'habit',
      actionType: 'habit',
      targetId: 'water',
      priorityText: 'High Energy Boost'
    });
  }

  // Top 3 Priority Tasks
  const incompleteTop3 = data.tasks.filter(t => t.isTop3 && t.status !== 'completed');
  if (incompleteTop3.length > 0) {
    const topTask = incompleteTop3[0];
    recommendations.push({
      id: `rec-task-${topTask.id}`,
      title: topTask.title,
      durationLabel: `${topTask.estimatedMinutes || 30} min`,
      durationMinutes: topTask.estimatedMinutes || 30,
      reason: `This is locked in your "Today's Top 3" priorities. Knocking this out eliminates today's mental burden.`,
      category: topTask.category === 'MultitaskCoder' ? 'project' : topTask.category === 'College' ? 'study' : 'task',
      actionType: 'focus',
      targetId: topTask.id,
      priorityText: 'Top 3 Priority'
    });
  }

  // MultitaskCoder specific progress
  const multitaskCoder = data.projects.find(p => p.name.toLowerCase().includes('multitaskcoder'));
  if (multitaskCoder && isEvening && !isCollegeHours) {
    const pendingMilestone = multitaskCoder.milestones.find(m => !m.completed);
    recommendations.push({
      id: 'rec-multitaskcoder',
      title: `MultitaskCoder: ${multitaskCoder.nextTask || 'Advance Debugger Module'}`,
      durationLabel: '35 min',
      durationMinutes: 35,
      reason: pendingMilestone
        ? `You are at ${multitaskCoder.progress}% completion. Working on "${pendingMilestone.title}" moves your flagship project toward deployment.`
        : `Flagship project needs consistent momentum after college hours.`,
      category: 'project',
      actionType: 'focus',
      targetId: multitaskCoder.id,
      priorityText: 'Flagship Project'
    });
  }

  // Study Tracker Target
  const todayStudyLogs = data.studySessions.filter(s => s.date === todayStr);
  const totalStudyToday = todayStudyLogs.reduce((acc, s) => acc + s.durationMinutes, 0);

  // Find priority subjects (e.g. Java, Python, Data Structures)
  const javaSubject = data.subjects.find(s => s.name.toLowerCase().includes('java'));
  const studiedJavaToday = todayStudyLogs.some(s => s.subjectName.toLowerCase().includes('java'));

  if (javaSubject && !studiedJavaToday && (isEvening || isNight || !isWeekday)) {
    recommendations.push({
      id: 'rec-study-java',
      title: 'Study Java Streams & OOP for 30 minutes',
      durationLabel: '30 min',
      durationMinutes: 30,
      reason: `You planned Java study today and haven't logged a session yet. A focused 30m block locks in daily engineering progress.`,
      category: 'study',
      actionType: 'focus',
      targetId: javaSubject.id,
      priorityText: 'Core Academic'
    });
  }

  // Upcoming Exam / Deadline urgency
  if (data.exams.length > 0) {
    const sortedExams = [...data.exams].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    const nearestExam = sortedExams[0];
    const daysLeft = Math.max(0, Math.ceil((new Date(nearestExam.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    if (nearestExam.prepPercentage < 70) {
      recommendations.push({
        id: `rec-exam-${nearestExam.id}`,
        title: `Prepare for ${nearestExam.title} (${daysLeft}d left)`,
        durationLabel: '40 min',
        durationMinutes: 40,
        reason: `Exam is in ${daysLeft} days with preparation currently at ${nearestExam.prepPercentage}%. Doing a short revision session now keeps stress away.`,
        category: 'study',
        actionType: 'focus',
        priorityText: 'Deadline Pressure'
      });
    }
  }

  // Fitness / Gym Recommendation
  const todayDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
  const todaySplit = data.fitness.weeklySplit[todayDayName];
  if (todaySplit && todaySplit !== 'Rest' && !data.fitness.todayWorkoutDone && (isEvening || !isWeekday)) {
    recommendations.push({
      id: 'rec-fitness',
      title: `Workout Session: ${todaySplit} Day`,
      durationLabel: '45 min',
      durationMinutes: 45,
      reason: `Today's designated split is ${todaySplit}. Hitting this workout energizes your brain and keeps your 7-day fitness streak alive.`,
      category: 'fitness',
      actionType: 'fitness',
      priorityText: 'Physical Resilience'
    });
  }

  // Night Routine / Reflection
  if (isNight) {
    const hasReflected = !!data.reflections[todayStr];
    if (!hasReflected) {
      recommendations.push({
        id: 'rec-night-reflection',
        title: 'Daily Shutdown & Reflection',
        durationLabel: '5 min',
        durationMinutes: 5,
        reason: `It's time to wind down. Review today's wins, log what went well, and prep tomorrow so you sleep with a calm, clear mind.`,
        category: 'routine',
        actionType: 'reflection',
        priorityText: 'Mental Clarity'
      });
    }
  }

  // College hours recommendation
  if (isCollegeHours) {
    recommendations.unshift({
      id: 'rec-college',
      title: 'Active Lab & Lecture Focus: Computer Engineering',
      durationLabel: 'Academic',
      durationMinutes: 50,
      reason: `You are currently in your 9:00 AM - 5:00 PM college block. Focus on practical lab work and absorb core lecture concepts.`,
      category: 'study',
      actionType: 'focus',
      priorityText: 'College Schedule'
    });
  }

  // Fallback / default recommendation
  if (recommendations.length === 0) {
    const unfinishedTask = data.tasks.find(t => t.status !== 'completed');
    if (unfinishedTask) {
      recommendations.push({
        id: `rec-default-${unfinishedTask.id}`,
        title: unfinishedTask.title,
        durationLabel: `${unfinishedTask.estimatedMinutes} min`,
        durationMinutes: unfinishedTask.estimatedMinutes,
        reason: `High priority item waiting on your queue. Quick 25-minute Pomodoro will get it done.`,
        category: 'task',
        actionType: 'focus',
        targetId: unfinishedTask.id,
        priorityText: 'Next in Queue'
      });
    } else {
      recommendations.push({
        id: 'rec-free-choice',
        title: 'Learn Something New or Take a Walk',
        durationLabel: '20 min',
        durationMinutes: 20,
        reason: `You have cleared your main queue! Reward your discipline with a restful break or free creative coding.`,
        category: 'routine',
        actionType: 'reflection',
        priorityText: 'Rest & Recharge'
      });
    }
  }

  return recommendations;
}
