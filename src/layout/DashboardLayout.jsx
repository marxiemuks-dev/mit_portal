import React, { useEffect, useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import Dashboard from '../pages/admin/Dashboard';
import NotFound from '../pages/NotFound';
import ResponsiveAppBar from '../components/AppBar'
import { Box } from '@mui/material'
import Enrollment from '../pages/admin/Enrollment';
import Schedule from '../pages/admin/Schedule';
import Grades from '../pages/admin/Grades';
// import Billing from '../pages/admin/Billing';
import Billing from '../pages/admin/Billing-Copy';
import NotificationsPage from '../pages/admin/Notification';
import Enroll from '../pages/admin/Enroll';
import EnrolledList from '../pages/admin/EnrolledList';
import UserManagement from '../pages/admin/UserManagement';
import SchoolCalendar from '../pages/admin/SchoolCalendarPage';
import UserProfilePage from '../pages/admin/UserProfilePage';

import DashboardS from '../pages/student/DashboardS';
import BillingS from '../pages/student/Billing';
import EnrollmentS from '../pages/student/EnrollmentS';
import GradesS from '../pages/student/GradesS'
import NotificationS from '../pages/student/NotificationS';
import SchoolCalendarPageS from '../pages/student/SchoolCalendarPage';
import ScheduleS from '../pages/student/ScheduleS';
import UserProfilePageS from '../pages/student/UserProfilePageS';

import GradesF from '../pages/faculty/GradesF'
import NotificationF from '../pages/faculty/NotificationF';
import ScheduleF from '../pages/faculty/ScheduleF';
import SchoolCalendarPageF from '../pages/faculty/SchoolCalendarPageF';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('mitportal_user');
    if (!storedUser) {
      navigate('/signin');
    } else {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Failed to parse user:', err);
        navigate('/signin');
      }
    }
  }, [navigate]);

  return (
    <Box>
      <ResponsiveAppBar/>
      <Box component="main" sx={{ flexGrow: 1, width: "100%", p: 2 }}>
        <Routes>
            {user?.role === 'admin' && (
                <>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/enrollment" element={<Enrollment />} />
                  <Route path="/list" element={<EnrolledList />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/grades" element={<Grades />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/notification" element={<NotificationsPage />} />
                  <Route path="/calendar" element={<SchoolCalendar/>} />
                  <Route path="/account" element={<UserManagement />} />
                  <Route path="/profile" element={<UserProfilePage />} />
                </>
              )}
              {user?.role === 'registrar' && (
                <>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/enrollment" element={<Enrollment />} />
                  <Route path="/list" element={<EnrolledList />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/grades" element={<Grades />} />
                  <Route path="/notification" element={<NotificationsPage />} />
                  <Route path="/calendar" element={<SchoolCalendar/>} />
                  <Route path="/profile" element={<UserProfilePage />} />
                </>
              )}
              {user?.role === 'cashier' && (
                <>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/notification" element={<NotificationsPage />} />
                  <Route path="/calendar" element={<SchoolCalendar/>} />
                  <Route path="/account" element={<UserManagement />} />
                  <Route path="/profile" element={<UserProfilePage />} />
                </>
              )}
              {user?.role === 'student' && (
                <>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/enrollment" element={<EnrollmentS />} />
                  <Route path="/schedule" element={<ScheduleS />} />
                  <Route path="/grades" element={<GradesS />} />
                  <Route path="/billing" element={<BillingS />} />
                  <Route path="/notification" element={<NotificationS />} />
                  <Route path="/calendar" element={<SchoolCalendarPageS/>} />
                  <Route path="/profile" element={<UserProfilePageS />} />
                </>
              )}
              {user?.role === 'faculty' && (
                <>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/schedule" element={<ScheduleF />} />
                  <Route path="/grades" element={<GradesF />} />
                  <Route path="/notification" element={<NotificationsPage />} />
                  <Route path="/calendar" element={<SchoolCalendarPageF/>} />
                  <Route path="/profile" element={<UserProfilePage />} />
                  {/* <Route path="/" element={<ScheduleF />} />
                  <Route path="/grades" element={<GradesF />} />
                  <Route path="/notification" element={<NotificationF />} /> */}
                  {/* You can add more student-specific routes here */}
                </>
              )}
          {/*Catching 404 routes*/}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </Box>
  )
}

export default DashboardLayout
