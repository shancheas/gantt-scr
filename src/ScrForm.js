import { Row, Col, Card, Form, InputNumber, DatePicker, Button } from "antd";
import moment from "moment";

const TOTAL_SCR = 100;
const TOTAL_PROGRAMMER = 3;

const dns = 11.5;
const dms = 6.75;
const rms = 0.15;
const rns = 0.5;

const dnj = 15;
const dmj = 9;
const rmj = 0.25;
const rnj = 0.4;

export const FormInput = ({ onGenerate }) => {
  const [form] = Form.useForm();

  return (
    <div style={{ margin: 16 }}>
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 12 }}
        onFinish={onGenerate}
        initialValues={{
          totalTask: TOTAL_SCR,
          totalProgrammer: TOTAL_PROGRAMMER,
          startDate: moment(),
          dns,
          dms,
          rns,
          rms,
          dnj,
          dmj,
          rnj,
          rmj,
        }}
        // wrapperCol={{ span: 14 }}
      >
        <Card>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="totalTask" label="Total SCR">
                <InputNumber
                  placeholder="input placeholder"
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item name="totalProgrammer" label="Total Programmer">
                <InputNumber
                  placeholder="input placeholder"
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item name="startDate" label="Start Date">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="dns" label="Durasi New Senior (Dns)">
                <InputNumber
                  placeholder="input placeholder"
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item name="dms" label="Durasi Modif Senior (Dms)">
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
            <Col span={8}>
              <Form.Item name="dnj" label="Durasi New Junior (Dnj)">
                <InputNumber
                  placeholder="input placeholder"
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item name="dmj" label="Durasi Modif Junior (Dmj)">
                <InputNumber
                  placeholder="input placeholder"
                  style={{ width: "100%" }}
                />
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
            </Col>
            <Col span={8}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Generate
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </div>
  );
};
