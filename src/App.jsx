import { useState, useEffect } from "react"; import { motion } from "framer-motion"; import { Card, CardContent } from "./components/ui/card"; import { Button } from "./components/ui/button"; import { Mail, Phone, Globe, MessageCircle, Trash2 } from "lucide-react"; import { db } from "./firebaseConfig"; import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore"; import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function App() { const [selectedSystem, setSelectedSystem] = useState(""); const [isAdmin, setIsAdmin] = useState(false); const [form, setForm] = useState({ name: "", firm: "", email: "", phone: "", note: "" }); const [requests, setRequests] = useState([]);

const systems = [ { name: "Aidat Takip & Site Yönetim Sistemi", desc: "Site yöneticileri için muhasebe, duyuru ve ödeme takibi sistemi." }, { name: "Kurs Yönetim Sistemi", desc: "Sanat, spor, müzik ve resim kursları için kayıt, ödeme ve ders takibi." }, { name: "Kuaför / Berber Yönetim Sistemi", desc: "Randevu, müşteri ve gelir takibini kolaylaştıran sistem." }, { name: "Veteriner Yönetim Sistemi", desc: "Hasta kayıt, aşı ve randevu hatırlatma özellikli klinik çözümü." }, { name: "Psikolog & Doktor Hasta Takip Sistemi", desc: "Randevu planlama, seans geçmişi ve ödeme takibi özellikli panel." }, { name: "Anaokulu Öğrenci Takip Sistemi", desc: "Ödeme, veli iletişimi ve öğrenci gelişim takibi." }, { name: "Makbuz Oluşturma Sistemi", desc: "Profesyonel makbuz oluştur, PDF olarak paylaş." }, { name: "Koçluk & Öğrenci Takip Sistemi", desc: "Koçlar için öğrenci ilerleme, deneme ve plan takibi." }, ];

const handleSubmit = async (e) => { e.preventDefault(); try { await addDoc(collection(db, "demoRequests"), { ...form, system: selectedSystem, createdAt: new Date().toISOString(), }); alert("Demo talebiniz başarıyla gönderildi!"); setForm({ name: "", firm: "", email: "", phone: "", note: "" }); setSelectedSystem(""); } catch (error) { console.error("Firebase kayıt hatası:", error); alert("Bir hata oluştu. Lütfen tekrar deneyin."); } };

const fetchRequests = async () => { const querySnapshot = await getDocs(collection(db, "demoRequests")); setRequests(querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }))); };

const deleteRequest = async (id) => { await deleteDoc(doc(db, "demoRequests", id)); setRequests((prev) => prev.filter((r) => r.id !== id)); };

useEffect(() => { if (isAdmin) fetchRequests(); }, [isAdmin]);

// Chart data oluşturma const systemCount = systems.map((sys) => ({ name: sys.name.split(" ")[0], count: requests.filter((r) => r.system === sys.name).length, }));

return ( <div className="min-h-screen bg-gray-50 text-gray-800 font-inter relative"> {/* Header */} <header className="bg-white shadow-md sticky top-0 z-50"> <div className="max-w-6xl mx-auto flex justify-between items-center p-4"> <div className="flex items-center gap-3"> <img src="/logo.png" alt="TYOSIS Logo" className="h-10 w-10" /> <h1 className="text-2xl font-bold text-[#7b2cbf]">TYOSİS</h1> </div> <nav className="hidden md:flex gap-6 text-sm font-medium"> <a href="#home" className="hover:text-[#7b2cbf]">Ana Sayfa</a> <a href="#products" className="hover:text-[#7b2cbf]">Ürünler</a> <a href="#about" className="hover:text-[#7b2cbf]">Hakkımızda</a> <a href="#contact" className="hover:text-[#7b2cbf]">İletişim</a> <button onClick={() => setIsAdmin(!isAdmin)} className="hover:text-[#7b2cbf]"> {isAdmin ? "Kullanıcı Görünümü" : "Admin Paneli"} </button> </nav> </div> </header>

{!isAdmin ? (
    <>
      {/* Hero */}
      <section id="home" className="text-center py-20 bg-gradient-to-b from-[#edf2ff] to-white">
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-bold text-[#14213d]">
          İşinizi Dijitale Taşıyın
        </motion.h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          TYOSİS – Takip Yönetim Sistemleri ile kayıt, randevu, müşteri ve gelir gider yönetimini tek panelden yönetin.
        </p>
      </section>

      {/* Products */}
      <section id="products" className="max-w-6xl mx-auto py-16 px-4">
        <h3 className="text-3xl font-semibold text-center mb-10 text-[#14213d]">Ürünlerimiz</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systems.map((sys, i) => (
            <motion.div key={i} whileHover={{ scale: 1.03 }}>
              <Card className="shadow-md hover:shadow-lg transition-all h-full">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-lg mb-2 text-[#7b2cbf]">{sys.name}</h4>
                  <p className="text-sm text-gray-600 mb-4">{sys.desc}</p>
                  <Button onClick={() => setSelectedSystem(sys.name)} className="bg-[#14213d] text-white hover:bg-[#0d1b2a]">
                    Demo Talep Et
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="max-w-3xl mx-auto py-20 px-4">
        <h3 className="text-3xl font-semibold text-center mb-10 text-[#14213d]">Demo Talep Formu</h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} type="text" placeholder="Ad Soyad" className="w-full p-3 border rounded-md" required />
          <input value={form.firm} onChange={(e) => setForm({ ...form, firm: e.target.value })} type="text" placeholder="Firma Adı" className="w-full p-3 border rounded-md" />
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="E-posta" className="w-full p-3 border rounded-md" required />
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} type="tel" placeholder="Telefon" className="w-full p-3 border rounded-md" />
          <select value={selectedSystem} onChange={(e) => setSelectedSystem(e.target.value)} className="w-full p-3 border rounded-md">
            <option value="">Sistem Seçiniz</option>
            {systems.map((sys, i) => (
              <option key={i} value={sys.name}>{sys.name}</option>
            ))}
          </select>
          <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Açıklama" className="w-full p-3 border rounded-md h-24" />
          <Button type="submit" className="w-full bg-[#7b2cbf] text-white hover:bg-[#5a189a]">Gönder</Button>
        </form>
      </section>
    </>
  ) : (
    <section className="max-w-6xl mx-auto py-20 px-4">
      <h3 className="text-3xl font-semibold text-center mb-10 text-[#14213d]">Admin Paneli – Demo Talepleri</h3>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="overflow-x-auto bg-white p-4 shadow rounded-lg">
          <h4 className="font-semibold mb-4 text-[#7b2cbf]">Talepler Listesi</h4>
          <table className="min-w-full text-sm border rounded-md">
            <thead className="bg-[#7b2cbf] text-white">
              <tr>
                <th className="p-2 text-left">Ad Soyad</th>
                <th className="p-2 text-left">Sistem</th>
                <th className="p-2 text-left">E-posta</th>
                <th className="p-2 text-center">Sil</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{r.name}</td>
                  <td className="p-2">{r.system}</td>
                  <td className="p-2">{r.email}</td>
                  <td className="p-2 text-center">
                    <button onClick={() => deleteRequest(r.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Grafik Bölümü */}
        <div className="bg-white p-6 shadow rounded-lg">
          <h4 className="font-semibold mb-4 text-[#7b2cbf]">Sistem Bazlı Talep Grafiği</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={systemCount}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#7b2cbf" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )}

  {/* WhatsApp Floating Button */}
  <a href="https://wa.me/905000000000?text=Merhaba! TYOSİS sistemleri hakkında bilgi almak istiyorum." target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-105 transition-all z-50">
    <MessageCircle size={28} />
  </a>

  {/* Footer */}
  <footer className="bg-[#14213d] text-gray-300 py-8">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 gap-4">
      <p>© 2025 TYOSİS – Takip Yönetim Sistemleri | Tüm Hakları Saklıdır.</p>
      <div className="flex gap-4">
        <a href="mailto:info@tyosis.com" className="flex items-center gap-1"><Mail size={16}/> info@tyosis.com</a>
        <a href="tel:+900000000000" className="flex items-center gap-1"><Phone size={16}/> +90 000 000 00 00</a>
        <a href="https://tyosis.com" className="flex items-center gap-1"><Globe size={16}/> tyosis.com</a>
      </div>
    </div>
  </footer>
</div>

); }
