import { lazy, Suspense } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./index.css";
import Navbar from "./UI/Navbar";
import Footer from "./UI/Footer";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const NewsPage = lazy(() => import("./pages/PageNews"));
const AdsDebugPagePrebidJs = lazy(() => import("./pages/PageAdsDebugPrebidJs"));
const StatPage = lazy(() => import("./pages/StatisticPage"));
const LineItemsPage = lazy(() => import("./pages/LineItem"));

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<div className="text-center mt-20 text-lg">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Navigate to="/log" />} />
              <Route path="/log" element={<LoginPage />} />
              <Route path="/reg" element={<RegisterPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/ads-debug-prebidjs" element={<AdsDebugPagePrebidJs />} />
              <Route path="/statistik" element={<StatPage />} />
              <Route path="/line-items" element={<LineItemsPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}