import React from "react";
import Gantt from "@dhtmlx/trial-react-gantt";
import { getData } from "./common/data";

import { faker } from "@faker-js/faker";
import * as _ from "lodash";
import moment from "moment";

const TOTAL_SCR = 100;
const TOTAL_PROGRAMMER = 3;

const startDate = "2022-01-05";
const format = "YYYY-MM-DD";

const dns = 11.5;
const dms = 6.75;
const rms = 0.15;
const rns = 0.5;

const dnj = 15;
const dmj = 9;
const rmj = 0.25;
const rnj = 0.4;

const skills = [
  {
    status: "senior",
    salary: 30000,
  },
  {
    status: "junior",
    salary: 20000,
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
};

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getProgrammers(total) {
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

function getAssignee(totalProgrammer) {
  return randomInteger(0, totalProgrammer - 1);
}

function getTaskProb(totalTask) {
  return [...Array(totalTask).keys()].map((item) => randomInteger(0, 1));
}

function assignTask(tasks, programmers) {
  const taskName = ["New Feature", "Modify Feature"];
  return tasks.map((task) => {
    const programmerId = getAssignee(programmers.length);
    const programmer = programmers[programmerId];
    return {
      task: taskName[task],
      ...programmer,
    };
  });
}

function reworkTask(tasks, skill, task, prob) {
  const totalTask = tasks.filter((t) => {
    return t.status == skill && t.task == task;
  });

  const rework = Math.ceil(totalTask.length * prob);
  return [...Array(rework).keys()].map((item) =>
    task == "New Feature" ? 0 : 1
  );
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

function generateTask() {
  const programmers = [...getProgrammers(TOTAL_PROGRAMMER)];
  const seniorProgrammers = programmers.filter(
    (programmer) => programmer.status == "senior"
  );
  const juniorProgrammers = programmers.filter(
    (programmer) => programmer.status == "junior"
  );
  const tasks = getTaskProb(TOTAL_SCR);
  let coreTask = assignTask(tasks, programmers);

  coreTask.push(
    ...assignTask(
      reworkTask(coreTask, "junior", "New Feature", rnj),
      juniorProgrammers
    )
  );
  coreTask.push(
    ...assignTask(
      reworkTask(coreTask, "junior", "Modify Feature", rmj),
      juniorProgrammers
    )
  );
  coreTask.push(
    ...assignTask(
      reworkTask(coreTask, "senior", "New Feature", rns),
      seniorProgrammers
    )
  );
  coreTask.push(
    ...assignTask(
      reworkTask(coreTask, "senior", "Modify Feature", rms),
      seniorProgrammers
    )
  );

  coreTask = coreTask.map((tasks) => {
    const { task, status } = tasks;
    return {
      ...tasks,
      duration: durations[task][status],
    };
  });

  coreTask = _.groupBy(coreTask, "name");
  const gantt = [];
  let i = 0;
  for (const [key, value] of Object.entries(coreTask)) {
    let start = moment(startDate, format).add(9, "hours");
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
        end_date: work.end.toDate(),
        start_f: work.start.format("YYYY/MM/DD H:mm"),
        end_f: work.end.format("YYYY/MM/DD H:mm"),
        hours,
        duration: duration == 0 ? 1 : duration,
      };
      start = work.end;
      i++;
      return retVal;
    });
    coreTask[key] = timeline;
    gantt.push(...timeline);
  }

  return gantt;
}

const { scales, columns } = getData();
const taskGantt = generateTask();

export default function GanttMin({ cellHeight, borders }) {
  return (
    <Gantt
      cellHeight={cellHeight}
      borders={borders}
      tasks={taskGantt}
      scales={scales}
      columns={columns}
      grid={{ width: 700 }}
    />
  );
}
