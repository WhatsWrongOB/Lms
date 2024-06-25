import { Route, Routes } from "react-router-dom";
import { AdminRoute } from "../../routes";
import { Suspense, lazy } from "react";
import Course from "./Course";
import Loader from "../../components/Loader";
import Sidebar from "../../components/Sidebar";

const Dashboard = lazy(() => import("./Dashboard"));
const Attendance = lazy(() => import("./Attendance"));
const Feedback = lazy(() => import("./Feedback"));
const Complain = lazy(() => import("./Complain"));
const Student = lazy(() => import("./Student"));

const AdminApp = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Sidebar />
      <Routes>
        <Route element={<AdminRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<Course />} />
          <Route path="/attendances" element={<Attendance />} />
          <Route path="/feedbacks" element={<Feedback />} />
          <Route path="/complains" element={<Complain />} />
          <Route path="/students" element={<Student />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AdminApp;