export const weekScaleTemplate = (a, b) => {
  return `${a.getMonth()} - ${b.getMonth()}`;
};

export const dayStyle = (a) => {
  const day = a.getDay() === 5 || a.getDay() === 6;
  return day ? "sday" : "";
};

export const complexScales = [
  { unit: "year", step: 1, format: "yyyy" },
  { unit: "month", step: 2, format: "MMMM yyy" },
  { unit: "week", step: 1, format: "w" },
  { unit: "day", step: 1, format: "d", css: dayStyle },
];

export const simpleColumns = [
  { name: "text", label: "Task name", width: "100%" },
];

export function getData(prefix, maxSize, maxYears) {
  maxYears = maxYears || 100;
  maxSize = maxSize || 50;
  prefix = prefix || "";
  const tasks = [];
  for (let i = 1; i <= maxSize; i++) {
    const ii = i % (365 * maxYears);

    let start = 2 + ii - (ii >= 13 ? 12 : 0);
    let end = start + 1 + Math.round(Math.random() * 2);
    tasks.push({
      id: i,
      start_date: new Date(2020, 2, start),
      end_date: new Date(2020, 2, end),
      text: prefix + "Task " + i,
      progress: Math.round((100 * i) / maxSize),
      parent: 0,
      type: "task",
    });
  }

  tasks[3].parent = 3;
  tasks[4].parent = 3;
  tasks[5].parent = 3;
  tasks[6].parent = 6;
  tasks[7].parent = 6;
  tasks[8].parent = 6;
  tasks[9].parent = 9;
  tasks[10].parent = 9;
  tasks[11].parent = 9;

  tasks[3].type = "project";
  tasks[15].type = "milestone";

  const links = [
    { id: 1, source: 3, target: 4, type: 0 },
    { id: 2, source: 1, target: 2, type: 0 },
    { id: 21, source: 8, target: 1, type: 1 },
    { id: 22, source: 1, target: 6, type: 1 },
    { id: 23, source: 1, target: 3, type: 1 },
    { id: 24, source: 1, target: 13, type: 1 },
    { id: 25, source: 1, target: 14, type: 1 },
    { id: 26, source: 1, target: 15, type: 1 },
    { id: 27, source: 1, target: 16, type: 1 },
    { id: 28, source: 1, target: 14, type: 1 },
    { id: 3, source: 5, target: 6, type: 3 },
    { id: 4, source: 8, target: 6, type: 1 },
  ];

  const scales = [
    { unit: "month", step: 1, format: "MMMM yyy" },
    { unit: "day", step: 1, format: "d", css: dayStyle },
  ];

  const columns = [
    { name: "id", label: "No.", width: "30" },
    { name: "text", label: "Task name", width: "125" },
    { name: "name", label: "Assignee", width: "125" },
    { name: "status", label: "Skill", width: "70", align: "center" },
    { name: "arrival", label: "Arrival time", width: 125 },
    { name: "start_f", label: "Start time", width: 125 },
    { name: "end_f", label: "End time", width: 125 },
    // { name: "start_date", label: "Start time", align: "center" },
    // { name: "end_date", label: "End time", align: "center" },
    { name: "queue", label: "Queue", width: "70", align: "center" },
    // { name: "arrival", label: "Arrival", width: "70", align: "center" },
    { name: "hours", label: "Duration", width: "70", align: "center" },
    // { name: "add-task", label: "", width: "50", align: "center" },
  ];

  return { tasks, links, scales, columns };
}
