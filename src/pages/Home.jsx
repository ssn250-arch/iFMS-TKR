import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar title="iFMS-TKR" />

      <main className="min-h-screen flex flex-col items-center justify-center">

        <h1 className="text-5xl font-bold mb-10">
          iFMS-TKR
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          <button
            className="bg-orange-500 text-white p-8 rounded-xl"
          >
            Aduan Kerosakan ICT
            <br />
            (Dalam Pembinaan)
          </button>

          <Link
            to="/elog"
            className="bg-blue-600 text-white p-8 rounded-xl text-center"
          >
            Log Penggunaan ICT
          </Link>

        </div>

      </main>

      <Footer />
    </>
  );
}

export default Home;