import React, { useRef, useState } from "react";
import moment from "moment";
import { Row, Col, Descriptions, Tabs, Table } from "antd";
import Gantt from "./components/Gantt";
import Toolbar from "./components/Toolbar";

import { getData } from "./common/data";
import { generateTask } from "./formula/new-scr";
import { FormInput } from "./ScrForm";

import csvDownload from "json-to-csv-export";

const { TabPane } = Tabs;

const tableColumns = [
  {
    title: "No",
    dataIndex: "i",
    key: "no",
  },
  {
    title: "Initial",
    dataIndex: "first",
    key: "first",
    render: (text) => text.toFixed(2),
  },
  {
    title: "Zi",
    dataIndex: "zi",
    key: "zi",
    render: (text) => text.toFixed(2),
  },
  {
    title: "Ui",
    dataIndex: "ui",
    key: "ui",
    render: (text) => text.toFixed(2),
  },
  {
    title: "Jenis SCR",
    dataIndex: "value",
    key: "value",
  },
  {
    title: "Programmer Skill",
    dataIndex: "skillValue",
    key: "skillValue",
  },
];

const tableArrivalColumns = [
  {
    title: "No",
    dataIndex: "i",
    key: "no",
  },
  {
    title: "Initial",
    dataIndex: "first",
    key: "first",
    render: (text) => text.toFixed(2),
  },
  {
    title: "Zi",
    dataIndex: "zi",
    key: "zi",
    render: (text) => text.toFixed(2),
  },
  {
    title: "Ui",
    dataIndex: "ui",
    key: "ui",
    render: (text) => text.toFixed(2),
  },
  {
    title: "Value",
    dataIndex: "scrArrive",
    key: "scrArrive",
    render: (text) => text.toFixed(2),
  },
  {
    title: "Arrival Time",
    dataIndex: "taskArrival",
    key: "taskArrival",
    render: (text) => text.toFixed(2),
  },
];

const tableTaskColumns = [
  {
    title: "No",
    dataIndex: "index",
    key: "index",
  },
  {
    title: "Arrival",
    dataIndex: "taskArrival",
    key: "taskArrival",
    render: (text) => text.toFixed(2),
  },
  {
    title: "Start",
    dataIndex: "start",
    key: "start",
    render: (text) => text.toFixed(2),
  },
  {
    title: "End",
    dataIndex: "end",
    key: "end",
    render: (text) => text.toFixed(2),
  },
  {
    title: "Duration",
    dataIndex: "duration",
    key: "duration",
    render: (text) => text.toFixed(2),
  },
  {
    title: "Duration Process",
    dataIndex: "durationProcess",
    key: "durationProcess",
    render: (text) => text.toFixed(2),
  },
  {
    title: "Queue",
    dataIndex: "queue",
    key: "queue",
    render: (text) => text.toFixed(2),
  },
];

export default function GanttMin({ cellHeight, borders }) {
  const [gantt, setGantt] = useState(null);
  const [workers, setWorkers] = useState(null);
  const [projectSummary, setSummary] = useState(null);
  const [programmerSummary, setProgrammer] = useState(null);
  const [arrival, setArrival] = useState(null);
  const [taskDistribution, setTaskDistribution] = useState(null);
  const [zoom, setZoom] = useState("Days");
  const { scales, columns } = getData();

  const ganttRef = useRef();

  function round2digit(num) {
    return Math.round(num * 100) / 100;
  }

  function onGenerate(value) {
    const { isExport, loopTimes } = value;
    if (isExport) {
      const time = moment().format("YYYY-MM-DD_HHmmss");
      const tasks = [];
      const arrivals = [];
      const programmers = [];
      const timelines = [];
      const summaries = [];
      Array(loopTimes)
        .fill(0)
        .forEach((_val, index) => {
          const {
            arrivalDisribution,
            taskDistribution,
            workers,
            gantt,
            summary,
          } = generateTask(value);

          const workerDistribution = workers.map((programmer) => {
            const task = programmer.task.map((task) => {
              const taskArrival = round2digit(task.taskArrival);
              const start = round2digit(task.start);
              const end = round2digit(task.end);
              const queue = round2digit(task.queue);
              const durationProcess = round2digit(task.durationProcess);

              return {
                sample: index + 1,
                ...task,
                taskArrival,
                start,
                end,
                queue,
                durationProcess,
                name: programmer.name,
              };
            });
            return task;
          });

          const ganttMap = gantt.map((g) => {
            const taskArrival = round2digit(g.taskArrival);
            const start = round2digit(g.start);
            const end = round2digit(g.end);
            const durationProcess = round2digit(g.durationProcess);
            return {
              sample: index + 1,
              ...g,
              taskArrival,
              start,
              end,
              durationProcess,
            };
          });

          const arrivalMap = arrivalDisribution.map((g) => {
            const taskArrival = round2digit(g.taskArrival);
            const scrArrive = round2digit(g.scrArrive);
            const arrive = round2digit(g.arrive);
            return {
              sample: index + 1,
              ...g,
              taskArrival,
              scrArrive,
              arrive,
            };
          });

          const taskMap = taskDistribution.map((task) => {
            return {
              sample: index + 1,
              ...task,
            };
          });

          const summaryMap = {
            sample: index + 1,
            ...summary,
            cost: round2digit(summary.cost),
            hours: round2digit(summary.hours),
          };

          const programmerDistribution = workerDistribution
            .flat()
            .sort((a, b) => a.index - b.index);

          tasks.push(taskMap);
          arrivals.push(arrivalMap);
          programmers.push(programmerDistribution);
          timelines.push(ganttMap);
          summaries.push(summaryMap);
        });

      csvDownload(tasks.flat(), `task-distribution-${time}.csv`);
      csvDownload(arrivals.flat(), `arrival-distribution-${time}.csv`);
      csvDownload(timelines.flat(), `timeline-${time}.csv`);
      csvDownload(programmers.flat(), `programmer-distribution-${time}.csv`);
      csvDownload(summaries.flat(), `summary-${time}.csv`);
    } else {
      const {
        gantt,
        workers,
        summary,
        summaryWorker,
        arrivalDisribution,
        taskDistribution,
      } = generateTask(value);
      setGantt(gantt);
      setWorkers(workers);
      setSummary(summary);
      setProgrammer(summaryWorker);
      setArrival(arrivalDisribution);
      setTaskDistribution(taskDistribution);
      ganttRef.current.forceUpdate();
    }
  }

  function hoursToMonth(hours) {
    const dayInMonth = 21;
    const days = hours / 8;

    return days > dayInMonth
      ? `${(days / dayInMonth).toFixed(2)} months`
      : `${Math.ceil(days)} days`;
  }

  return (
    <>
      <FormInput onGenerate={onGenerate} />
      {projectSummary &&
        gantt &&
        workers &&
        programmerSummary &&
        arrival &&
        taskDistribution && (
          <>
            <div style={{ margin: 16 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Descriptions
                    title="Summary Project"
                    bordered
                    column={1}
                    size="small"
                  >
                    <Descriptions.Item label="Start Date">
                      {projectSummary.start.format("DD MMMM YYYY")}
                    </Descriptions.Item>
                    <Descriptions.Item label="End Date">
                      {projectSummary.end.format("DD MMMM YYYY")}
                    </Descriptions.Item>
                    <Descriptions.Item label="Duration">
                      {projectSummary.duration.toLocaleString()} days
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Task">
                      {projectSummary.totalTask.toLocaleString()} Tasks (
                      {projectSummary.totalSCR.toLocaleString()} SCR,{" "}
                      {projectSummary.totalRework.toLocaleString()} Rework)
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Hours">
                      {projectSummary.hours.toLocaleString()} hours
                    </Descriptions.Item>
                    <Descriptions.Item label="Total Programmer">
                      {projectSummary.totalProgrammer.toLocaleString()}{" "}
                      Programmers
                    </Descriptions.Item>
                    <Descriptions.Item label="Cost">
                      Rp. {projectSummary.cost.toLocaleString()}{" "}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </div>

            <Tabs defaultActiveKey="1">
              <TabPane
                tab="Timeline"
                key="1"
                style={{ height: "800px" }}
                forceRender
              >
                <div>
                  <div className="zoom-bar">
                    <Toolbar zoom={zoom} onZoomChange={setZoom} />
                  </div>
                  <div className="gantt-container">
                    <Gantt
                      ref={ganttRef}
                      zoom={zoom}
                      tasks={{ scales, columns, data: gantt }}
                      cellHeight={cellHeight}
                      borders={borders}
                      grid={{ width: 700 }}
                    />
                  </div>
                </div>
              </TabPane>
              <TabPane tab="Programmers" key="2">
                <div style={{ margin: 16 }}>
                  <Row gutter={16}>
                    {programmerSummary.map((programmer) => {
                      return (
                        <Col span={8} key={programmer.name}>
                          <Descriptions
                            bordered
                            column={1}
                            size="small"
                            style={{ marginBottom: 20 }}
                          >
                            <Descriptions.Item label="Name">
                              {programmer.name}
                            </Descriptions.Item>
                            <Descriptions.Item label="Skill">
                              {programmer.status}
                            </Descriptions.Item>
                            <Descriptions.Item label="Start Date">
                              {programmer.start.format("DD MMMM YYYY")}
                            </Descriptions.Item>
                            <Descriptions.Item label="End Date">
                              {programmer.end.format("DD MMMM YYYY")}
                            </Descriptions.Item>
                            <Descriptions.Item label="Rate">
                              Rp. {programmer.rate.toLocaleString()} / hours
                            </Descriptions.Item>
                            <Descriptions.Item label="Total Task">
                              {programmer.totalTask.toLocaleString()} Tasks (
                              {programmer.totalTask - programmer.totalRework}{" "}
                              core, {programmer.totalRework} rework)
                            </Descriptions.Item>
                            <Descriptions.Item label="Total Core Task Hours">
                              {programmer.hours.toLocaleString()} hours (
                              {hoursToMonth(programmer.hours)})
                            </Descriptions.Item>
                            <Descriptions.Item label="Total Rework Task Hours">
                              {programmer.hoursRework.toLocaleString()} hours (
                              {hoursToMonth(programmer.hoursRework)})
                            </Descriptions.Item>
                            <Descriptions.Item label="Total Salary">
                              Rp. {programmer.salary.toLocaleString()}
                            </Descriptions.Item>
                          </Descriptions>
                        </Col>
                      );
                    })}
                  </Row>
                </div>
              </TabPane>
              <TabPane tab="Distribution Table" key="3">
                <Row gutter={16}>
                  <Col span={11}>
                    <h2>Arrival Distribution</h2>
                    <Table
                      dataSource={arrival}
                      columns={tableArrivalColumns}
                      pagination={false}
                      rowKey="i"
                      size="small"
                      bordered
                    />
                  </Col>
                  <Col span={11}>
                    <h2>Task Distribution</h2>
                    <Table
                      dataSource={taskDistribution}
                      columns={tableColumns}
                      pagination={false}
                      rowKey="i"
                      size="small"
                      bordered
                    />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Programmers Distribution" key="4">
                <Row gutter={16}>
                  {workers.map((worker, i) => {
                    return (
                      <Col span={8} key={i}>
                        <h2>{worker.name}</h2>
                        <Table
                          dataSource={worker.task}
                          columns={tableTaskColumns}
                          pagination={false}
                          size="small"
                          rowKey="index"
                          bordered
                        />
                      </Col>
                    );
                  })}
                </Row>
              </TabPane>
            </Tabs>
          </>
        )}
    </>
  );
}
