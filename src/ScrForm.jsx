import {
  Row,
  Col,
  Card,
  Form,
  InputNumber,
  Input,
  DatePicker,
  Button,
  Tabs,
  Slider,
  Tooltip,
  // Divider,
} from "antd";
import moment from "moment";

const { TabPane } = Tabs;

const TOTAL_SCR = 100;

const dns = 11.5;
const dms = 6.75;
const rms = 0.15;
const rns = 0.5;

const dnj = 15;
const dmj = 9;
const rmj = 0.25;
const rnj = 0.4;

const arrivalA = 21;
const arrivalC = 5;
const arrivalM = 8;

const taskA = 9;
const taskC = 7;
const taskM = 64;

const threshold = 0.6;
const taskTimeTolerance = 0;
const interarrival = 8;

const seniorRate = 30000;
const juniorRate = 20000;

const marks = {
  "-2": (
    <Tooltip title="Easy">
      <span>😄</span>
    </Tooltip>
  ),
  0: (
    <Tooltip title="Medium">
      <span>🙂</span>
    </Tooltip>
  ),
  2: (
    <Tooltip title="Difficult">
      <span>😫</span>
    </Tooltip>
  ),
};

export const FormInput = ({ onGenerate }) => {
  const [form] = Form.useForm();

  function durationRange(durationName, tolerance) {
    const duration = form.getFieldValue(durationName);
    const time = duration + tolerance;

    return time > duration ? `${duration} - ${time}` : `${time} - ${duration}`;
  }

  return (
    <div style={{ margin: 16 }}>
      <Form
        form={form}
        layout="vertical"
        // labelCol={{ span: 12 }}
        onFinish={onGenerate}
        initialValues={{
          totalTask: TOTAL_SCR,
          seniorProgrammer: 1,
          rateseniorProgrammer: seniorRate,
          ratejuniorProgrammer: juniorRate,
          juniorProgrammer: 1,
          startDate: moment(),
          duration: 2,
          loopTimes: 5,
          isExport: false,
          dns,
          dms,
          rns,
          rms,
          dnj,
          dmj,
          rnj,
          rmj,
          arrivalA,
          arrivalC,
          arrivalM,
          taskA,
          taskC,
          taskM,
          threshold,
          taskTimeTolerance,
          interarrival,
        }}
        // wrapperCol={{ span: 14 }}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="INPUT" key="1">
            <Card>
              <Row gutter={16}>
                <Col span={8}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="seniorProgrammer"
                        label="Senior Programmer"
                      >
                        <InputNumber
                          placeholder="input placeholder"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="rateseniorProgrammer"
                        label="Rate Senior Programmer"
                      >
                        <InputNumber
                          addonBefore="Rp"
                          addonAfter="/ Jam"
                          placeholder="input placeholder"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="juniorProgrammer"
                        label="Junior Programmer"
                      >
                        <InputNumber
                          placeholder="input placeholder"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="ratejuniorProgrammer"
                        label="Rate Junior Programmer"
                      >
                        <InputNumber
                          addonBefore="Rp"
                          addonAfter="/ Jam"
                          placeholder="input placeholder"
                          style={{ width: "100%" }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item name="startDate" label="Start Date">
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                  <Form.Item name="duration" label="Durasi Pengembangan">
                    <InputNumber
                      addonAfter="Bulan"
                      placeholder="dalam bulan"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                  <Form.Item name="taskTimeTolerance" label="Complexity">
                    <Slider marks={marks} max={2} min={-2} />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      onClick={() => {
                        form.setFieldsValue({
                          isExport: false,
                        });
                        form.submit();
                      }}
                    >
                      Generate
                    </Button>
                    <Button
                      style={{ margin: "0 8px" }}
                      onClick={() => {
                        form.setFieldsValue({
                          isExport: true,
                        });
                        form.submit();
                      }}
                    >
                      Export
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </TabPane>
          <TabPane tab="CONFIGURATION " key="2" forceRender>
            <Form.Item shouldUpdate noStyle>
              {({ getFieldValue }) => {
                const complexity = getFieldValue("taskTimeTolerance");
                return (
                  <Card>
                    <Row gutter={16}>
                      <Col span={6}>
                        <Form.Item>
                          <h2>Durasi</h2>
                        </Form.Item>
                        <Form.Item
                          name="dns"
                          label={`Durasi New Senior (Dns) (${durationRange(
                            "dns",
                            complexity
                          )})`}
                        >
                          <InputNumber
                            placeholder="input placeholder"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                        <Form.Item
                          name="dms"
                          label={`Durasi Modif Senior (Dms) (${durationRange(
                            "dms",
                            complexity
                          )})`}
                        >
                          <InputNumber
                            placeholder="input placeholder"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                        <Form.Item
                          name="dnj"
                          label={`Durasi New Junior (Dnj) (${durationRange(
                            "dnj",
                            complexity
                          )})`}
                        >
                          <InputNumber
                            placeholder="input placeholder"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                        <Form.Item
                          name="dmj"
                          label={`Durasi Modif Junior (Dmj) (${durationRange(
                            "dmj",
                            complexity
                          )})`}
                        >
                          <InputNumber
                            placeholder="input placeholder"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item>
                          <h2>Peluang Rework</h2>
                        </Form.Item>
                        <Form.Item name="rnj" label="Rework New Junior (Pnj)">
                          <InputNumber
                            placeholder="input placeholder"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                        <Form.Item name="rmj" label="Rework Modif Junior (Pmj)">
                          <InputNumber
                            placeholder="input placeholder"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                        <Form.Item name="rns" label="Rework New Senior (Pns)">
                          <InputNumber
                            placeholder="input placeholder"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                        <Form.Item name="rms" label="Rework Modif Senior (Pms)">
                          <InputNumber
                            placeholder="input placeholder"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item>
                          <h2>Distribusi Kedatangan SCR</h2>
                        </Form.Item>
                        <Form.Item name="arrivalA" label="Arrival A">
                          <InputNumber
                            placeholder="input placeholder"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                        <Form.Item name="arrivalC" label="Arrival C">
                          <InputNumber
                            placeholder="input placeholder"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                        <Form.Item name="arrivalM" label="Arrival M">
                          <InputNumber
                            placeholder="input placeholder"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                        <Form.Item name="interarrival" label="Inter Arrival">
                          <InputNumber
                            placeholder="input placeholder"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                        <Form.Item name="threshold" label="Pnm">
                          <InputNumber
                            placeholder="input placeholder"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item>
                          <h2>Distribusi Penugasan</h2>
                        </Form.Item>
                        <Form.Item name="taskA" label="Task A">
                          <InputNumber
                            placeholder="input placeholder"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                        <Form.Item name="taskC" label="Task C">
                          <InputNumber
                            placeholder="input placeholder"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                        <Form.Item name="taskM" label="Task M">
                          <InputNumber
                            placeholder="input placeholder"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item>
                          <h2>Simulasi</h2>
                        </Form.Item>
                        <Form.Item name="loopTimes" label="Total Sample">
                          <InputNumber
                            placeholder="input placeholder"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                        <Form.Item
                          name="isExport"
                          label="Export Data"
                          hidden={true}
                        >
                          <Input
                            placeholder="input placeholder"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                );
              }}
            </Form.Item>
          </TabPane>
        </Tabs>
      </Form>
    </div>
  );
};
