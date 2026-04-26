export default function Footer() {
  return (
    <footer className="border-t border-[#0f3d34] bg-[#021b16]">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-[#18c29c] rounded-md flex items-center justify-center text-black font-bold">g</div>
            <span className="text-white font-semibold">GigMate</span>
          </div>
          <p className="text-gray-400">The freelancing platform built for students.</p>
        </div>
        <div>
          <h4 className="text-white font-medium mb-3">Marketplace</h4>
          <ul className="space-y-2 text-gray-400">
            <li>Web Development</li>
            <li>Design</li>
            <li>Writing</li>
            <li>Video</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-3">Company</h4>
          <ul className="space-y-2 text-gray-400">
            <li>About</li>
            <li>Careers</li>
            <li>Press</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-3">Support</h4>
          <ul className="space-y-2 text-gray-400">
            <li>Help Center</li>
            <li>Trust & Safety</li>
            <li>Terms</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#0f3d34] py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} GigMate. All rights reserved.
      </div>
    </footer>
  );
}
