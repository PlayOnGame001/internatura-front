import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <div className="font-bold text-lg">Internatura</div>
      <div className="flex gap-4">
        <Link to="/news" className="hover:text-gray-300">News</Link>
        {/* <Link to="/ads-debug-prebidjs" className="hover:text-gray-300">Ads Debug</Link> */}
        <Link to="/statistik" className="hover:text-gray-300">Statistics</Link>
        <Link to="/log" className="hover:text-gray-300">Login</Link>
      </div>
    </nav>
  );
}
