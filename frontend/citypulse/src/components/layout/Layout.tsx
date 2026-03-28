import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }: any) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-zinc-900 to-purple-900">
      <Navbar />

      <div className="flex-1 p-6 pt-20">{children}</div>

      <Footer />
    </div>
  );
}