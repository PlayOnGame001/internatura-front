import { lazy, Suspense } from "react";
import "./index.css";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const NewsPage = lazy(() => import("./pages/PageNews"));
const AdsDebugPagePrebidJs = lazy(() => import("./pages/PageAdsDebugPrebidJs"));
const StatPage = lazy(() => import("./pages/StatisticPage"));

export default function App() {
  return (
    <Router>
      <Suspense fallback={<div className="text-center mt-20 text-lg">Load...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/log" />} />
          <Route path="/log" element={<LoginPage />} />
          <Route path="/reg" element={<RegisterPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/ads-debug-prebidjs" element={<AdsDebugPagePrebidJs />}/>
          <Route path="/statistik" element={<StatPage/>}/>
        </Routes>
      </Suspense>
    </Router>
  );
}
