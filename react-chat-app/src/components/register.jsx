import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";

const RegisterForm = () => {
  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:3030/api/register",
        values
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <Formik
      initialValues={{ username: "", email: "", password: "" }}
      validate={(values) => {
        const errors = {};
        if (!values.username) {
          errors.username = "نام کاربری اجباری است";
        }
        if (!values.email) {
          errors.email = "ایمیل اجباری است";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
          errors.email = "ایمیل نامعتبر است";
        }
        if (!values.password) {
          errors.password = "رمز عبور اجباری است";
        } else if (values.password.length < 6) {
          errors.password = "رمز عبور باید حداقل 6 کاراکتر باشد";
        }
        return errors;
      }}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              نام کاربری
            </label>
            <Field type="text" name="username" className="form-control" />
            <ErrorMessage
              name="username"
              component="div"
              className="text-danger"
            />
          </div>
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
            ثبت نام
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default RegisterForm;
