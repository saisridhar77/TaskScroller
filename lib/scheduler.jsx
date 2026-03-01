const WEIGHTS = {
  urgency: 0.30,
  importance: 0.25,
  consequences: 0.15,
  effort: 0.15,
  difficulty: 0.15
};

const FAIRNESS_ALPHA = 1.5;

export function calculateDaysRemaining(deadline) {
  if (!deadline) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let d;
  if (typeof deadline === 'string') {
    const datePart = deadline.split('T')[0]; 
    const [year, month, day] = datePart.split('-').map(Number);
    d = new Date(year, month - 1, day);
  } else {
    d = new Date(deadline);
  }
  d.setHours(0, 0, 0, 0);
  return Math.ceil((d - today) / (1000 * 60 * 60 * 24));
}

export function calculateTaskMetrics(task) {
  const daysRemaining = calculateDaysRemaining(task.deadline);
  const remainingWork = task.remaining_days ?? task.estimated_days;
  const safeDays = Math.max(daysRemaining, 1);
  const dailyRequired = remainingWork / safeDays;
  const urgency = Math.min(10, dailyRequired * 10);
  const slack = daysRemaining - remainingWork;
  const effortScore = 10 - task.effort;
  const difficultyScore = 10 - task.difficulty;
  
  const baseScore =
    urgency * WEIGHTS.urgency +
    task.importance * WEIGHTS.importance +
    task.consequences * WEIGHTS.consequences +
    effortScore * WEIGHTS.effort +
    difficultyScore * WEIGHTS.difficulty;

  const daysSinceLast =
    task.last_scheduled_at
      ? (new Date() - new Date(task.last_scheduled_at)) / (1000 * 60 * 60 * 24)
      : 10;

  const fairnessPenalty = FAIRNESS_ALPHA / Math.max(daysSinceLast, 0.1);
  const adjustedScore = baseScore - fairnessPenalty;
  const isCritical = remainingWork >= daysRemaining;

  // IMPORTANT: Explicitly preserve _id so it doesn't get lost in the spread
  return {
    ...task,
    _id: task._id || task.id, 
    daysRemaining,
    remainingWork,
    dailyRequired,
    urgency,
    slack, 
    baseScore,
    adjustedScore,
    isCritical
  };
}

export function generateDailySchedule(tasks, dailyCapacity = 3) {
  const activeTasks = tasks.filter(
    t => t.status !== "completed" && t.status !== "missed"
  );
  
  let enriched = activeTasks.map(calculateTaskMetrics);
  
  enriched.sort((a, b) => {
    if (a.isCritical && !b.isCritical) return -1;
    if (!a.isCritical && b.isCritical) return 1;
    const diff = b.dailyRequired - a.dailyRequired;
    if (Math.abs(diff) > 0.001) {
      return diff;
    }
    return b.adjustedScore - a.adjustedScore;
  });

  let capacity = dailyCapacity;
  const allocations = [];

  for (let task of enriched) {
    if (capacity <= 0) break;
    const alloc = Math.min(task.dailyRequired, capacity);
    if (alloc > 0) {
      allocations.push({
        ...task,
        _id: task._id || task.id,
        allocated: alloc
      });
      capacity -= alloc;
    }
  }

  const mustDoTask = allocations.length > 0 ? allocations[0] : null;

  return {
    mustDoTask,
    scheduledTasks: allocations,
    allTasks: enriched
  };
}

export function calculateNextTaskState(task) {
  const chunk = task.allocated || 1;
  const currentRemaining = task.remaining_days ?? task.estimated_days;
  const newRemaining = Math.max(0, currentRemaining - chunk);

  const daysRemaining = calculateDaysRemaining(task.deadline);

  let status = task.status;


  if (newRemaining <= 0) {
    status = "completed";
  }

  else if (daysRemaining < 0) {
    status = "missed";
  }

  return {
    ...task,
    remaining_days: newRemaining,
    status,
    completed_at: status === "completed" ? new Date().toISOString() : task.completed_at,
    last_scheduled_at: new Date().toISOString()
  };
}