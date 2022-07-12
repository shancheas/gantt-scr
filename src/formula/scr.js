import { faker } from "@faker-js/faker";

import * as _ from "lodash";
import moment from "moment";
import {
  distribution,
  taskDistribution,
  arrival,
} from "../formula/distribution";
faker.setLocale("id_ID");

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getTaskDistribution(totalTask, a, c, m, threshold) {
  return distribution({
    a,
    c,
    m,
    totalTask,
    func: taskDistribution,
    threshold,
  });
}

export function getArrivalDistribution(totalTask, a, c, m) {
  return distribution({
    a,
    c,
    m,
    totalTask,
    func: arrival,
  });
}

function getDistribution(totalTask, a, c, m, threshold) {
  return getTaskDistribution(totalTask, a, c, m, threshold).map(
    (dist) => dist.value - 1
  );
}

function randomDecimal(min, max) {
  return Math.random() * (max - min + 1) + min;
}

function getConstantRange(num, range = 2) {
  return randomDecimal(num - range, num + range);
}

function getProgrammers(total, skills) {
  const programmers = [];
  for (let i = 0; i < total; i++) {
    const skill = skills[randomInteger(0, 1)];
    programmers.push({
      name: faker.name.findName(),
      ...skill,
    });
  }

  return programmers;
}

function getAssignee(dist, programmers, totalTask, index) {
  const seniorProgrammers = programmers.filter(
    (programmer) => programmer.status === "senior"
  );
  const juniorProgrammers = programmers.filter(
    (programmer) => programmer.status === "junior"
  );

  const rework = juniorProgrammers.length < 1 || seniorProgrammers.length < 1;

  const rand = _.sampleSize(dist, totalTask);
  const programmer = rand[index] ? juniorProgrammers : seniorProgrammers;
  return rework ? _.sample(programmers) : _.sample(programmer);
}

function getTaskProb(totalTask, a, c, m, threshold) {
  return getDistribution(totalTask, a, c, m, threshold);
}

function assignTask(tasks, programmers, rework = false) {
  const taskName = ["New Feature", "Modify Feature"];
  const affix = rework ? "(rework)" : "";
  return tasks.map((task, i) => {
    const programmer = getAssignee(tasks, programmers, tasks.length, i);
    return {
      task: `${taskName[task]}${affix}`,
      rework,
      ...programmer,
    };
  });
}

function reworkTask(tasks, skill, task, prob) {
  const totalTask = tasks.filter((t) => {
    return t.status === skill && t.task === task;
  });

  const rework = Math.ceil(totalTask.length * prob);
  return [...Array(rework).keys()].map((item) =>
    task === "New Feature" ? 0 : 1
  );
}

function totalTask(tasks) {
  const newFeature = tasks.filter((task) => task.text === "New Feature");
  const modifyFeature = tasks.filter((task) => task.text === "Modify Feature");

  const newFeatureRework = tasks.filter(
    (task) => task.text === "New Feature(rework)"
  );
  const modifyFeatureRework = tasks.filter(
    (task) => task.text === "Modify Feature(rework)"
  );

  return { newFeature, modifyFeature, newFeatureRework, modifyFeatureRework };
}

function summaryProgrammer(tasks) {
  const start = tasks[0];
  const end = tasks.slice(-1)[0];
  const { newFeature, modifyFeature, newFeatureRework, modifyFeatureRework } =
    totalTask(tasks);
  const totalRework = newFeatureRework.length + modifyFeatureRework.length;

  const name = start.name;
  const status = start.status;
  const salary = tasks.reduce((a, b) => {
    return a + b.salary;
  }, 0);
  const hours = tasks.slice(totalRework).reduce((a, b) => {
    return a + b.hours;
  }, 0);
  const hoursRework = tasks.slice(-totalRework).reduce((a, b) => {
    return a + b.hours;
  }, 0);

  return {
    name,
    status,
    start: start.start,
    end: end.end,
    rate: start.rate,
    hours,
    hoursRework,
    salary,
    totalTask: tasks.length,
    totalRework,
    newFeature: newFeature.length,
    modifyFeature: modifyFeature.length,
    newFeatureRework: newFeatureRework.length,
    modifyFeatureRework: modifyFeatureRework.length,
  };
}

function summaryProject(tasks, programmers) {
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
  const hours = tasks.map((task) => task.hours).reduce((a, b) => a + b);

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

function getHourRate(skills, status) {
  return skills.find((s) => s.status === status).salary;
}

function workDay(start, duration) {
  const mStart = moment(start);
  const end = moment(start).add(duration, "hours");
  const diff = moment(end)
    .set({ hours: 0 })
    .diff(moment(mStart).set({ hours: 0 }), "day");
  const diffH = end.diff(moment(start).set({ hours: 17 }), "hours");
  if (diffH > 0 || diff > 0) {
    const days = diffH > 6 ? 0 : 1;
    end.add(days, "days").set({ hours: 9 + diffH });
  }
  // console.log({start, mStart: moment(start).set({hours: 17}), end, diffH, diff, duration})

  return {
    start: mStart,
    end,
  };
}

export function generateTask(params) {
  const {
    totalTask,
    totalProgrammer,
    dns,
    dms,
    rns,
    rms,
    dnj,
    dmj,
    rnj,
    rmj,
    startDate,
    arrivalA,
    arrivalC,
    arrivalM,
    taskA,
    taskC,
    taskM,
    threshold,
    taskTimeTolerance,
  } = params;
  const skills = [
    {
      status: "junior",
      salary: 20000,
    },
    {
      status: "senior",
      salary: 30000,
    },
  ];

  const durations = {
    "New Feature": {
      senior: dns,
      junior: dnj,
    },
    "Modify Feature": {
      senior: dms,
      junior: dmj,
    },
    "New Feature(rework)": {
      senior: dns,
      junior: dnj,
    },
    "Modify Feature(rework)": {
      senior: dms,
      junior: dmj,
    },
  };
  const programmers = [...getProgrammers(totalProgrammer, skills)];
  const seniorProgrammers = programmers.filter(
    (programmer) => programmer.status === "senior"
  );
  const juniorProgrammers = programmers.filter(
    (programmer) => programmer.status === "junior"
  );
  const tasks = getTaskProb(totalTask, taskA, taskC, taskM, threshold);
  let coreTask = assignTask(tasks, programmers);

  coreTask.push(
    ...assignTask(
      reworkTask(coreTask, "junior", "New Feature", rnj),
      juniorProgrammers,
      true
    )
  );
  coreTask.push(
    ...assignTask(
      reworkTask(coreTask, "junior", "Modify Feature", rmj),
      juniorProgrammers,
      true
    )
  );
  coreTask.push(
    ...assignTask(
      reworkTask(coreTask, "senior", "New Feature", rns),
      seniorProgrammers,
      true
    )
  );
  coreTask.push(
    ...assignTask(
      reworkTask(coreTask, "senior", "Modify Feature", rms),
      seniorProgrammers,
      true
    )
  );

  coreTask = coreTask.map((tasks) => {
    const { task, status } = tasks;
    return {
      ...tasks,
      duration: getConstantRange(durations[task][status], taskTimeTolerance),
    };
  });

  coreTask = _.groupBy(coreTask, "name");
  const gantt = [];
  const summaryWorker = [];
  let i = 1;
  for (const [key, value] of Object.entries(coreTask)) {
    let start = startDate.add(9, "hours");
    // eslint-disable-next-line no-loop-func
    const timeline = value.map((val) => {
      const hours = val.duration;
      const work = workDay(start, val.duration);
      const duration = moment(work.end)
        .set({ hours: 0 })
        .diff(moment(work.start).set({ hours: 0 }), "days");

      const retVal = {
        id: i,
        type: "task",
        ...val,
        ...work,
        text: val.task,
        start_date: work.start.toDate(),
        start_f: work.start.format("YYYY/MM/DD H:mm"),
        end_f: work.end.format("YYYY/MM/DD H:mm"),
        hours,
        rate: getHourRate(skills, val.status),
        salary: getHourRate(skills, val.status) * hours,
        duration: duration === 0 ? 1 : duration,
      };
      start = work.end;
      i++;
      return retVal;
    });
    coreTask[key] = timeline;
    gantt.push(...timeline);
    summaryWorker.push(summaryProgrammer(timeline));
  }

  const summary = summaryProject(gantt, summaryWorker);
  const distributionTask = getTaskDistribution(
    totalTask,
    taskA,
    taskC,
    taskM,
    threshold
  );
  const arrivalDisribution = getArrivalDistribution(
    totalTask,
    arrivalA,
    arrivalC,
    arrivalM
  );
  return {
    gantt,
    summary,
    summaryWorker,
    arrivalDisribution,
    taskDistribution: distributionTask,
  };
}
