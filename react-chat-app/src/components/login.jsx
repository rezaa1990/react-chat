import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";

const Login = () => {
  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:3030/api/login",
        values
      );
      const { token } = response.data;

      // ذخیره توکن در لوکال استوریج
      localStorage.setItem("token", token);

      console.log("ورود موفقیت‌آمیز.");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validate={(values) => {
        const errors = {};
        if (!values.email) {
          errors.email = "ایمیل اجباری است";
        }
        if (!values.password) {
          errors.password = "رمز عبور اجباری است";
        }
        return errors;
      }}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              ایمیل
            </label>
            <Field type="email" name="email" className="form-control" />
            <ErrorMessage
              name="email"
              component="div"
              className="text-danger"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              رمز عبور
            </label>
            <Field type="password" name="password" className="form-control" />
            <ErrorMessage
              name="password"
              component="div"
              className="text-danger"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            ورود
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default Login;
