import { faker } from "@faker-js/faker";
import moment from "moment";
faker.setLocale("id_ID");
const totalTask = 500;
const officeStart = 9;
const officeHour = 8;

function randomNumber(min, max) {
  return Math.random() * (max - min + 1) + min;
}

const taskAssignDistribution = ({
  a = 9,
  c = 7,
  m = 64,
  threshold = 0.65,
  programmers,
}) => {
  const programmerThreshold =
    programmers.filter((p) => p === 2).length / programmers.length;

  let initial = 1;

  const scrTask = [];

  for (let i = 1; i <= totalTask; i++) {
    const first = a * initial + c;
    const zi = first % m;
    const ui = zi / m;

    const value = 0 <= ui && ui <= threshold ? 1 : 2;
    const skillValue = 0 <= ui && ui <= programmerThreshold ? 1 : 2;

    initial = zi;

    scrTask.push({ i, first, zi, ui, value, skillValue });
  }

  return scrTask;
};

const scrArrivalDistribution = ({
  a = 21,
  c = 5,
  m = 24,
  arrivalConstant = 8,
}) => {
  let initial = 1;
  const arrival = [];

  for (let i = 1; i <= totalTask; i++) {
    const first = a * initial + c;
    const zi = first % m;
    const ui = zi / m;

    const value = Math.abs(Math.log(1 - ui)) * arrivalConstant;
    initial = zi;

    const arrivalBefore = i === 1 ? 0 : arrival[i - 2].taskArrival;
    const taskArrival = arrivalBefore + value;

    arrival.push({ i, first, zi, ui, taskArrival, value: value });
  }

  return arrival;
};

function srcDuration(scr, skill, durationTable, tolerance = 2) {
  const duration = durationTable[scr - 1][skill - 1];
  return randomNumber(duration - tolerance, duration + tolerance);
}

function findReadyProgrammer(programmers) {
  const programmerTask = programmers
    .map((programmer) => {
      const { task, id } = programmer;
      const lastTask = [...task].pop();
      return {
        id,
        lastTask,
        total: task.length,
        end: lastTask ? lastTask.end : 0,
      };
    })
    .sort((a, b) => a.end - b.end);

  const freeProgrammer = programmerTask.filter((task) => task.total === 0);

  return freeProgrammer.length > 0 ? freeProgrammer[0] : programmerTask[0];
}

function generateProgrammers(total) {
  return Array.from(Array(total).keys()).map(() => {
    return Math.floor(randomNumber(1, 2));
  });
}

const programmerStatus = [
  {
    status: "junior",
    rate: 20000,
  },
  {
    status: "senior",
    rate: 30000,
  },
];

const scrStatus = ["Modify Task", "New Task"];

function taskDetail(tasks, startDate) {
  return tasks.map((task, i) => {
    const { start, end, name, skill, scr, duration } = task;
    const dayStart = Math.floor(start / officeHour);
    const hourStart = officeStart + (start % officeHour);
    const startTime = moment(startDate)
      .add(dayStart, "days")
      .add(hourStart, "hours");

    const dayEnd = Math.floor(end / officeHour);
    const hourEnd = officeStart + (end % officeHour);
    const endTime = moment(startDate).add(dayEnd, "days").add(hourEnd, "hours");

    const start_f = startTime.format("YYYY/MM/DD H:mm");
    const end_f = endTime.format("YYYY/MM/DD H:mm");
    const text = scrStatus[scr - 1];
    const status = programmerStatus[skill - 1].status;

    return {
      ...task,
      start_date: startTime.toDate(),
      end_date: endTime.toDate(),
      startTime,
      endTime,
      start_f,
      end_f,
      text,
      status,
      name,
      // duration: Math.ceil(duration / officeHour),
      hours: duration.toFixed(2),
      id: i + 1,
    };
  });
}

function summaryProgrammer(programmers, startDate) {
  return programmers.map((programmer) => {
    const { status, rate } = programmerStatus[programmer.skill - 1];
    const detail = taskDetail(
      programmer.task.map((t) => {
        return { ...t, skill: programmer.skill, name: programmer.name };
      }),
      startDate
    );
    const name = programmer.name;
    const totalTask = programmer.task.length;
    const hours = programmer.task.reduce((a, b) => {
      return a + b.duration;
    }, 0);
    const salary = hours * rate;
    const hoursRework = 0;
    const totalRework = 0;
    const newFeatureRework = 0;
    const modifyFeatureRework = 0;
    const start = detail[0].startTime;
    const end = [...detail].pop().endTime;
    const newFeature = programmer.task.filter(
      (task) => task.value === 2
    ).length;
    const modifyFeature = programmer.task.filter(
      (task) => task.value === 1
    ).length;

    return {
      ...programmer,
      rate,
      name,
      totalTask,
      hours,
      salary,
      status,
      hoursRework,
      totalRework,
      newFeature,
      modifyFeature,
      newFeatureRework,
      modifyFeatureRework,
      end,
      start,
    };
  });
}

function summaryProject(programmers) {
  const start = programmers
    .map((programmer) => programmer.start)
    .sort((a, b) => a.unix() - b.unix())[0];
  const end = programmers
    .map((programmer) => programmer.end)
    .sort((a, b) => a.unix() - b.unix())
    .slice(-1)[0];
  const cost = programmers
    .map((programmer) => programmer.salary)
    .reduce((a, b) => a + b);
  const seniorProgrammers = programmers.filter(
    (programmer) => programmer.status === "senior"
  ).length;
  const juniorProgrammers = programmers.filter(
    (programmer) => programmer.status === "junior"
  ).length;
  const tasks = programmers.map((p) => p.task).flat();

  const hours = tasks.map((task) => task.duration).reduce((a, b) => a + b);

  const duration = end.diff(start, "days");
  const totalTask = tasks.length;
  const totalProgrammer = programmers.length;

  return {
    start,
    end,
    duration,
    hours,
    cost,
    totalTask,
    totalProgrammer,
    seniorProgrammers,
    juniorProgrammers,
  };
}

function createGantt(programmers, startDate) {
  const tasks = programmers
    .map((p) => {
      const { task, name, skill, id } = p;
      return task.map((t) => {
        return { ...t, name, skill, id };
      });
    })
    .flat();

  return taskDetail(tasks, startDate);
}

export function generateTask(params) {
  const {
    totalProgrammer,
    dns,
    dms,
    // rns,
    // rms,
    dnj,
    dmj,
    // rnj,
    // rmj,
    startDate,
    arrivalA,
    arrivalC,
    arrivalM,
    taskA,
    taskC,
    taskM,
    threshold,
    taskTimeTolerance,
    duration,
  } = params;

  const programmers = generateProgrammers(totalProgrammer);
  let taskAssign = taskAssignDistribution({
    a: taskA,
    c: taskC,
    m: taskM,
    threshold,
    programmers,
  });
  let scrArrival = scrArrivalDistribution({
    a: arrivalA,
    c: arrivalC,
    m: arrivalM,
  });
  const durationTable = [
    [dmj, dms],
    [dnj, dns],
  ];

  const maxHours = duration * 8 * 21;
  const maxIndex = scrArrival.findIndex(
    (arrival) => arrival.taskArrival > maxHours
  );

  taskAssign = taskAssign.slice(0, maxIndex);
  scrArrival = scrArrival.slice(0, maxIndex);

  const scrDistribution = scrArrival.map((scr, i) => {
    const { value, skillValue } = taskAssign[i];
    const duration = srcDuration(
      value,
      skillValue,
      durationTable,
      taskTimeTolerance
    );

    return { ...scr, duration, skillValue, value, arrive: scr.value };
  });

  const workers = programmers.map((programmer, i) => {
    return {
      id: i,
      skill: programmer,
      task: [],
    };
  });

  const summaryWorker = [];

  let index = 1;
  for (const scr of scrDistribution) {
    const { skillValue, taskArrival, duration, value } = scr;
    const programmers = workers.filter((worker) => worker.skill === skillValue);

    const assignee = findReadyProgrammer(programmers);

    const queue = assignee?.lastTask
      ? Math.max(0, assignee.lastTask.end - taskArrival)
      : 0;
    const durationProcess = duration + queue;
    const worker = workers.find((worker) => worker.id === assignee.id);

    worker.name = faker.name.findName();
    worker.task.push({
      index,
      taskArrival,
      start: taskArrival + queue,
      end: taskArrival + durationProcess,
      scr: value,
      duration,
      queue,
      durationProcess,
    });
    index++;
  }

  summaryWorker.push(...summaryProgrammer(workers, startDate));
  const summary = summaryProject(summaryWorker);
  const gantt = createGantt(
    workers,
    startDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
  );

  return {
    gantt,
    summary,
    summaryWorker,
    workers,
    arrivalDisribution: scrArrival,
    taskDistribution: taskAssign,
  };
}
