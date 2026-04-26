const services = [
  { icon: "💻", title: "Web Development", desc: "Static sites, full-stack apps, integrations" },
  { icon: "🎨", title: "Graphic Design", desc: "Logos, brand identity, social media" },
  { icon: "🎬", title: "Video Editing", desc: "Reels, YouTube, motion graphics" },
  { icon: "✍️", title: "Writing", desc: "Blogs, copywriting, technical docs" },
  { icon: "🤖", title: "AI & ML", desc: "Prompt engineering, fine-tuning, chatbots" },
  { icon: "📱", title: "Mobile Apps", desc: "iOS, Android, React Native, Flutter" },
];

export default function Services() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-white text-3xl font-semibold mb-2">Popular categories</h2>
      <p className="text-gray-400 mb-10">Hand-picked work from verified student freelancers.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {services.map((s) => (
          <div
            key={s.title}
            className="rounded-xl border border-[#0f3d34] bg-[#062a23] p-6 hover:border-[#18c29c] transition"
          >
            <div className="text-3xl mb-3">{s.icon}</div>
            <h3 className="text-white font-medium">{s.title}</h3>
            <p className="text-gray-400 text-sm mt-1">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
