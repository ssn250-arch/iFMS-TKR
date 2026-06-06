import { useState } from "react";

function ICTLogForm() {
  const [lokasi, setLokasi] = useState("");

  return (
    <form className="space-y-5">

      {/* Nama */}
      <div>
        <label className="block font-semibold mb-2">
          Nama Penuh
        </label>
        <input
          type="text"
          className="w-full border rounded-lg p-3"
          placeholder="Masukkan nama penuh"
        />
      </div>

      {/* Matrik */}
      <div>
        <label className="block font-semibold mb-2">
          No Matrik
        </label>
        <input
          type="text"
          className="w-full border rounded-lg p-3"
          placeholder="Contoh: SDK12345"
        />
      </div>

      {/* Lokasi */}
      <div>
        <label className="block font-semibold mb-2">
          Lokasi Makmal
        </label>

        <select
          className="w-full border rounded-lg p-3"
          value={lokasi}
          onChange={(e) => setLokasi(e.target.value)}
        >
          <option value="">Pilih Makmal</option>

          <option value="Lab Aplikasi">
            Lab Aplikasi
          </option>

          <option value="Lab Server">
            Lab Server
          </option>

          <option value="Lab Troubleshooting">
            Lab Troubleshooting
          </option>

          <option value="Lab Maintenance">
            Lab Maintenance
          </option>
        </select>
      </div>

      {/* Server */}
      {lokasi === "Lab Server" && (
        <div>
          <label className="block font-semibold mb-2">
            Pilih Server
          </label>

          <select className="w-full border rounded-lg p-3">
            <option value="">
              Pilih Server
            </option>

            {[...Array(7)].map((_, i) => (
              <option
                key={i}
                value={`Server ${i + 1}`}
              >
                Server {i + 1}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* PC */}
      <div>
        <label className="block font-semibold mb-2">
          No PC
        </label>

        <select className="w-full border rounded-lg p-3">
          <option value="">
            Pilih PC
          </option>

          {[...Array(30)].map((_, i) => (
            <option
              key={i}
              value={`PC ${i + 1}`}
            >
              PC {i + 1}
            </option>
          ))}
        </select>
      </div>

      {/* Tarikh */}
      <div>
        <label className="block font-semibold mb-2">
          Tarikh Penggunaan
        </label>

        <input
          type="date"
          className="w-full border rounded-lg p-3"
        />
      </div>

      {/* Masa */}
      <div>
        <label className="block font-semibold mb-2">
          Masa Penggunaan
        </label>

        <input
          type="time"
          className="w-full border rounded-lg p-3"
        />
      </div>

      {/* Tujuan */}
      <div>
        <label className="block font-semibold mb-2">
          Tujuan Penggunaan
        </label>

        <textarea
          rows="4"
          className="w-full border rounded-lg p-3"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg"
      >
        Hantar Rekod
      </button>

    </form>
  );
}

export default ICTLogForm;