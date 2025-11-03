import React, { useMemo, useState } from "react";

const DATA = {"Jadwal Mingguan (per Slot)": [{"Hari":"Senin","Slot":"08:00-10:00","Orang":"Asep","Kegiatan":"Meeting","Catatan":""},{"Hari":"Senin","Slot":"10:00-12:00","Orang":"Budi","Kegiatan":"Produksi","Catatan":""},{"Hari":"Senin","Slot":"13:00-15:00","Orang":"Citra","Kegiatan":"Quality Check","Catatan":""},{"Hari":"Selasa","Slot":"08:00-10:00","Orang":"Asep","Kegiatan":"Training","Catatan":""},{"Hari":"Selasa","Slot":"10:00-12:00","Orang":"Budi","Kegiatan":"Maintenance","Catatan":""},{"Hari":"Rabu","Slot":"08:00-10:00","Orang":"Citra","Kegiatan":"Meeting","Catatan":""},{"Hari":"Rabu","Slot":"10:00-12:00","Orang":"Asep","Kegiatan":"Produksi","Catatan":""},{"Hari":"Kamis","Slot":"08:00-10:00","Orang":"Budi","Kegiatan":"Training","Catatan":""},{"Hari":"Jumat","Slot":"08:00-10:00","Orang":"Citra","Kegiatan":"Maintenance","Catatan":""},{"Hari":"Sabtu","Slot":"09:00-11:00","Orang":"Asep","Kegiatan":"Inventaris","Catatan":""},{"Hari":"Minggu","Slot":"09:00-11:00","Orang":"Budi","Kegiatan":"Libur","Catatan":""}]};

export default function JadwalViewer() {
  const rows = DATA["Jadwal Mingguan (per Slot)"] || [];
  const people = useMemo(() => {
    const s = new Set(rows.map(r => r.Orang).filter(Boolean));
    return ["(Semua)", ...Array.from(s)];
  }, [rows]);

  const days = ["Semua", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

  const [selectedPerson, setSelectedPerson] = useState("(Semua)");
  const [selectedDay, setSelectedDay] = useState("Semua");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return rows.filter(r => {
      if (selectedPerson !== "(Semua)" && r.Orang !== selectedPerson) return false;
      if (selectedDay !== "Semua" && r.Hari !== selectedDay) return false;
      if (query) {
        const q = query.toLowerCase();
        return (r.Orang || "").toLowerCase().includes(q) || (r.Kegiatan || "").toLowerCase().includes(q) || (r.Catatan || "").toLowerCase().includes(q);
      }
      return true;
    }).sort((a,b) => {
      const dayOrder = {"Senin":1,"Selasa":2,"Rabu":3,"Kamis":4,"Jumat":5,"Sabtu":6,"Minggu":7};
      const da = dayOrder[a.Hari] || 99;
      const db = dayOrder[b.Hari] || 99;
      if (da !== db) return da - db;
      return (a.Slot || "").localeCompare(b.Slot || "");
    });
  }, [rows, selectedPerson, selectedDay, query]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold">Jadwal Mingguan</h1>
            <p className="text-sm text-slate-500">Menampilkan jadwal dan filter per-orang.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select value={selectedPerson} onChange={e => setSelectedPerson(e.target.value)} className="px-3 py-2 border rounded-lg">
              {people.map(p => <option key={p} value={p}>{p}</option>)}
            </select>

            <select value={selectedDay} onChange={e => setSelectedDay(e.target.value)} className="px-3 py-2 border rounded-lg">
              {days.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Cari nama, kegiatan, atau catatan..." className="px-3 py-2 border rounded-lg min-w-[220px]" />

            <button onClick={() => { setSelectedPerson("(Semua)"); setSelectedDay("Semua"); setQuery(""); }} className="px-3 py-2 bg-slate-100 rounded-lg">Reset</button>
          </div>
        </header>

        <main className="mt-6">
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left text-sm text-slate-600 border-b">
                  <th className="py-3">Hari</th>
                  <th className="py-3">Slot</th>
                  <th className="py-3">Orang</th>
                  <th className="py-3">Kegiatan</th>
                  <th className="py-3">Catatan</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="py-6 text-center text-slate-500">Tidak ada jadwal yang cocok.</td></tr>
                ) : (
                  filtered.map((r, i) => (
                    <tr key={i} className="even:bg-slate-50 odd:bg-white">
                      <td className="py-2 align-top font-medium">{r.Hari}</td>
                      <td className="py-2 align-top">{r.Slot}</td>
                      <td className="py-2 align-top">{r.Orang}</td>
                      <td className="py-2 align-top">{r.Kegiatan}</td>
                      <td className="py-2 align-top text-sm text-slate-600">{r.Catatan}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-slate-500">Menampilkan {filtered.length} dari {rows.length} entri</div>
            <div className="text-sm text-slate-500">Tips: gunakan filter "Orang" untuk melihat jadwal per orang.</div>
          </div>
        </main>
      </div>
    </div>
  );
}
