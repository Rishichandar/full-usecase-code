import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "./formikControl";

function FormikContainer() {
  const optionval = [
    { key: "select an option", value: "" },
    { key: " option1", value: "option1" },
    { key: "option2", value: "option 2" },
    { key: "option3", value: "option 3" },
    { key: " option4", value: "option 4" },
  ];
  const initialValues = {
    email: "",
    description: "",
    optionval: "",
  };
  const validationSchema = Yup.object({
    email: Yup.string().required("Required!"),
    description: Yup.string().required("Required!"),
    optionval: Yup.string().required("required!"),
  });
  const onsubmit = (values) => console.log("form values", values);
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onsubmit}
    >
      {(formik) => (
        <Form>
          <FormikControl
            control="input"
            type="email"
            label="Email"
            name="email"
          />
          <FormikControl
            control="textarea"
            label="Description"
            name="description"
          />
          <FormikControl
            control="select"
            label="select a topic"
            name="selectOption"
            options={dropdownOption}
          />
          <button type="submit">Submit</button>
        </Form>
      )}
    </Formik>
  );
}

export default FormikContainer;
