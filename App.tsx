
import React from 'react';
import { HashRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import EventDetailPage from './pages/EventDetailPage';
import OrganizerDashboardPage from './pages/OrganizerDashboardPage';
import CreateEventPage from './pages/CreateEventPage';
import Layout from './components/Layout';
import StudentDashboardPage from './pages/StudentDashboardPage';
import { mockEvents, UniversityEvent } from './hooks/useMockData';

export type NewEventData = Omit<UniversityEvent, 'id' | 'collegeName' | 'eligibility'>;

const App: React.FC = () => {
  // Mock user and authentication state
  const MOCK_USER_COLLEGE = 'Mohan Babu University';
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isOrganizer, setIsOrganizer] = React.useState(false);
  const [rsvpedEvents, setRsvpedEvents] = React.useState<Set<string>>(new Set(['1', '4'])); // Pre-register for some events
  const [interestedEvents, setInterestedEvents] = React.useState<Set<string>>(new Set(['2', '6'])); // Pre-interest in some events
  const [events, setEvents] = React.useState<UniversityEvent[]>(mockEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

  const handleLogin = (organizer: boolean) => {
    setIsAuthenticated(true);
    setIsOrganizer(organizer);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsOrganizer(false);
  };

  const addEvent = (eventData: NewEventData) => {
    const newEvent: UniversityEvent = {
      ...eventData,
      id: Date.now().toString(),
      collegeName: MOCK_USER_COLLEGE,
      eligibility: 'My College', // Default eligibility for new events
    };
    setEvents(prevEvents => [newEvent, ...prevEvents]);
  };

  const toggleRsvp = (eventId: string) => {
    setRsvpedEvents(prevRsvps => {
      const newRsvps = new Set(prevRsvps);
      if (newRsvps.has(eventId)) {
        newRsvps.delete(eventId);
      } else {
        newRsvps.add(eventId);
      }
      return newRsvps;
    });
  };

  const toggleInterested = (eventId: string) => {
    setInterestedEvents(prev => {
        const newInterested = new Set(prev);
        if (newInterested.has(eventId)) {
            newInterested.delete(eventId);
        } else {
            newInterested.add(eventId);
        }
        return newInterested;
    });
  };
  
  // A wrapper for protected routes
  const ProtectedRoute: React.FC<{ isAllowed: boolean; redirectTo?: string; children: React.ReactNode }> = ({ isAllowed, redirectTo = "/login", children }) => {
    if (!isAllowed) {
        return <Navigate to={redirectTo} replace />;
    }
    return <>{children}</>;
  };


  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignUpPage />} />
          
          {/* New route for the professional dashboard */}
          <Route 
            path="/student-dashboard/*" 
            element={
              <ProtectedRoute isAllowed={isAuthenticated} redirectTo="/">
                <StudentDashboardPage 
                  userCollege={MOCK_USER_COLLEGE}
                  rsvpedEvents={rsvpedEvents}
                  interestedEvents={interestedEvents}
                  toggleRsvp={toggleRsvp}
                  toggleInterested={toggleInterested}
                  events={events}
                />
              </ProtectedRoute>
            }
          />
          
          <Route element={
            <Layout 
              isAuthenticated={isAuthenticated} 
              isOrganizer={isOrganizer} 
              onLogout={handleLogout} 
              rsvpedEvents={rsvpedEvents} 
              toggleRsvp={toggleRsvp}
              interestedEvents={interestedEvents}
              toggleInterested={toggleInterested}
              userCollege={MOCK_USER_COLLEGE}
              events={events}
              addEvent={addEvent}
            />}
          >
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute isAllowed={isAuthenticated} redirectTo="/">
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/events/:id" 
              element={
                <ProtectedRoute isAllowed={isAuthenticated} redirectTo="/">
                  <EventDetailPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/organizer" 
              element={
                <ProtectedRoute isAllowed={isAuthenticated && isOrganizer} redirectTo="/dashboard">
                  <OrganizerDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/create-event" 
              element={
                <ProtectedRoute isAllowed={isAuthenticated && isOrganizer} redirectTo="/dashboard">
                  <CreateEventPage />
                </ProtectedRoute>
              } 
            />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </>
  );
};

export default App;
