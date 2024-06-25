import { useEffect, useState } from "react";
import axios from "axios";
import { useGetToken, useHandleAxiosError } from "../../hooks";
import { User } from "../../types";
import { CourseDetails } from "./Course";
import { toast } from "react-hot-toast";

const Attendance = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [courses, setCourses] = useState<CourseDetails[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [attendance, setAttendance] = useState<{ [key: string]: string }>({});

  const token = useGetToken();

  useEffect(() => {
    if (!token) return;

    const fetchStudents = async (): Promise<void> => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data) setStudents(data);
      } catch (error: any) {
        useHandleAxiosError(error);
      }
    };
    fetchStudents();
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const fetchCourses = async (): Promise<void> => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER}/api/course`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (data) setCourses(data.course);
      } catch (error: any) {
        useHandleAxiosError(error);
      }
    };
    fetchCourses();
  }, [token]);

  const handleAttendanceChange = (studentId: string, present: boolean) => {
    const status = present ? "present" : "absent";
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const markAttendance = async () => {
    const currentDate = new Date().toLocaleDateString();
    try {
      if (!selectedCourse) {
        throw new Error("Please select a course.");
      }

      const attendanceData = {
        courseId: selectedCourse,
        attendance: Object.entries(attendance).map(([userId, status]) => ({
          userId,
          status,
        })),
        date: currentDate,
      };

      await axios.post(
        `${import.meta.env.VITE_SERVER}/api/attendance/mark`,
        attendanceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Attendance marked successfully");
      setAttendance({});
    } catch (error: any) {
      useHandleAxiosError(error);
    }
  };

  return (
    <div className="dashboard attendance-container">
      <h2>Attendance Management</h2>

      <div className="course-select">
        <label htmlFor="courseSelect">Select a course:</label>
        <select
          id="courseSelect"
          onChange={(e) => setSelectedCourse(e.target.value)}
          value={selectedCourse}
        >
          <option value="" disabled>
            Select a course
          </option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.courseName}
            </option>
          ))}
        </select>
      </div>

      <div className="students-list">
        <h3>Students:</h3>
        <ul>
          {students.map((student) => (
            <li key={student._id}>
              <span className="student-name">{student.username}</span>
              <div className="attendance-buttons">
                <button
                  onClick={() => handleAttendanceChange(student._id, true)}
                  className="present-btn"
                  disabled={!selectedCourse}
                >
                  Present
                </button>
                <button
                  onClick={() => handleAttendanceChange(student._id, false)}
                  className="absent-btn"
                  disabled={!selectedCourse}
                >
                  Absent
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button
        className="submit-attendance-btn"
        onClick={markAttendance}
        disabled={!selectedCourse}
      >
        Submit Attendance
      </button>
    </div>
  );
};

export default Attendance;
