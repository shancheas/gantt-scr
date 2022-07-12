import React, { useState } from "react";
import { Row, Col, Descriptions, Tabs, Table } from "antd";
import Gantt from "@dhtmlx/trial-react-gantt";

import { getData } from "./common/data";
import { generateTask } from "./formula/scr";
import { FormInput } from "./ScrForm";

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
  },
  {
    title: "Zi",
    dataIndex: "zi",
    key: "zi",
  },
  {
    title: "Ui",
    dataIndex: "ui",
    key: "ui",
  },
  {
    title: "Value",
    dataIndex: "value",
    key: "value",
  },
];

export default function GanttMin({ cellHeight, borders }) {
  const [gantt, setGantt] = useState(null);
  const [projectSummary, setSummary] = useState(null);
  const [programmerSummary, setProgrammer] = useState(null);
  const [arrival, setArrival] = useState(null);
  const [taskDistribution, setTaskDistribution] = useState(null);
  const { scales, columns } = getData();

  function onGenerate(value) {
    const {
      gantt,
      summary,
      summaryWorker,
      arrivalDisribution,
      taskDistribution,
    } = generateTask(value);
    setGantt(gantt);
    setSummary(summary);
    setProgrammer(summaryWorker);
    setArrival(arrivalDisribution);
    setTaskDistribution(taskDistribution);
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
      {gantt &&
        projectSummary &&
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
                    <Descriptions.Item label="Total SCR">
                      {projectSummary.totalTask.toLocaleString()} Tasks
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
              <TabPane tab="Timeline" key="1" style={{ height: "800px" }}>
                <Gantt
                  cellHeight={cellHeight}
                  borders={borders}
                  tasks={gantt}
                  scales={scales}
                  columns={columns}
                  grid={{ width: 700 }}
                />
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
                  <Col span={8}>
                    <h2>Arrival Distribution</h2>
                    <Table
                      dataSource={arrival}
                      columns={tableColumns}
                      pagination={false}
                      rowKey="i"
                    />
                    ;
                  </Col>
                  <Col span={8}>
                    <h2>Task Distribution</h2>
                    <Table
                      dataSource={taskDistribution}
                      columns={tableColumns}
                      pagination={false}
                      rowKey="i"
                    />
                    ;
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </>
        )}
    </>
  );
}
