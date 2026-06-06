import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">
        iFMS-TKR
      </h1>

      <Link
        to="/elog"
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg"
      >
        Log Penggunaan ICT
      </Link>
    </div>
  );
}

export default Home;