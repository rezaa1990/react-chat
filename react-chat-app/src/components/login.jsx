import React from "react";
import { useEffect, useState, useContext} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import ChatContext from "./context";
import {useNavigate} from "react-router-dom";

const Login = () => {
  const {
    setLoginedUser,
    allUsers, 
    setAllUsers,
    rooms,
    setRooms,
    selectedRoom,
    setSelectedRoom,
    inputMessage,
    setInputMessage,
  } = useContext(ChatContext);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3030/api/getallusers"
        );
        setAllUsers(response.data);
        console.log("allUsers:", response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:3030/api/login",
        values
      );
      const { token , user } = response.data;
      
      setLoginedUser(user);
      // ذخیره توکن در لوکال استوریج
      localStorage.setItem("token", token);

      console.log("ورود موفقیت‌آمیز.");
      
      navigate("/chat")
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
