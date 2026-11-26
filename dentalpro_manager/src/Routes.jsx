import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import DoctorDashboard from './pages/doctor-dashboard';
import PatientManagement from './pages/patient-management';
import FinancialManagement from './pages/financial-management';
import PatientClinicalRecord from './pages/patient-clinical-record';
import AppointmentScheduling from './pages/appointment-scheduling';
import DocumentGeneration from './pages/document-generation';
import PaymentProcessing from './pages/payment-processing';
import PromotionsManagement from './pages/promotions-management';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AppointmentScheduling />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/patient-management" element={<PatientManagement />} />
        <Route path="/financial-management" element={<FinancialManagement />} />
        <Route path="/patient-clinical-record" element={<PatientClinicalRecord />} />
        <Route path="/appointment-scheduling" element={<AppointmentScheduling />} />
        <Route path="/document-generation" element={<DocumentGeneration />} />
        <Route path="/payment-processing" element={<PaymentProcessing />} />
        <Route path="/promotions-management" element={<PromotionsManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;