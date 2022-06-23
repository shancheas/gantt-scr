import React, { useState, useEffect } from "react";
import { Input, Button, Form } from "antd";
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation,
  withRouter,
} from "react-router-dom";

import classes from "classnames";
import GanttMin from "./GanttMin";

import css from "./Demos.module.css";

const skins = [
  {
    id: "default",
    name: "Classic",
    settings: { borders: "full", cellHeight: 38 },
  },
  {
    id: "material",
    name: "Material",
    settings: { borders: "", cellHeight: 32 },
  },
];
const skinSettings = {};
skins.forEach((a) => (skinSettings[a.id] = a.settings));

const demos = [["/base", "Gantt basic", GanttMin]];

// eslint-disable-next-line no-unused-vars
const FormInput = () => {
  const [form] = Form.useForm();

  return (
    <Form layout={"horizontal"} form={form}>
      <Form.Item label="Total Task">
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item label="Total Programmer">
        <Input placeholder="input placeholder" />
      </Form.Item>
      <Form.Item>
        <Button type="primary">Submit</Button>
      </Form.Item>
    </Form>
  );
};

function Routes({ history }) {
  const [skin, setSkin] = useState({});

  let location = useLocation();
  useEffect(() => {
    const parts = location.pathname.split("/");
    if (parts.length === 3) {
      setSkin(parts[2]);
    }
  }, [location]);

  return (
    <Router>
      <div className={css.layout}>
        <div className={classes(css.content, "wx-" + skin)}>
          {/* <FormInput /> */}
          <Switch>
            <Route
              exact
              path="/"
              render={() => <Redirect to="/base/default"></Redirect>}
            />
            {demos.map((data) => (
              <Route
                key={data[0]}
                path={`${data[0]}/:skin`}
                render={({ match }) => {
                  const Demo = data[2];
                  return <Demo {...skinSettings[match.params.skin]} />;
                }}
              />
            ))}
          </Switch>
          {/* <demo.comp  /> */}
        </div>
      </div>
    </Router>
  );
}

const RoutesWithHistory = withRouter(Routes);

function Demos() {
  return (
    <Router>
      <RoutesWithHistory />
    </Router>
  );
}

export default Demos;
