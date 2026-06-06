import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ICTLogForm from "../components/ICTLogForm";

function ICTLog() {
  return (
    <>
      <Navbar title="E-Log Makmal Komputer" />

      <main className="min-h-screen p-6">

        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">

          <h2 className="text-3xl font-bold mb-6">
            Pendaftaran Penggunaan
          </h2>

          <ICTLogForm />

        </div>

      </main>

      <Footer />
    </>
  );
}

export default ICTLog;