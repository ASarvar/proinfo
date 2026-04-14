import { cookies } from "next/headers";
import { parseSession } from "@lib/admin-auth";
import { prisma } from "@lib/api-helpers";
import Link from "next/link";

// ── Tiny SVG icons ──────────────────────────────────────────────
const IconBox = ({ bg, icon, bgClass }) => (
  <span className={bgClass || "admin-dashboard__stats__card__icon-box"} style={{ background: bg }}>{icon}</span>
);

const icons = {
  products: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  categories: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  content: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  blog: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  video: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
    </svg>
  ),
  photo: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  download: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  faq: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  arrow: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
    </svg>
  ),
};

const navIcons = {
  Dashboard: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  Categories: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  Products: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  Blog: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  Video: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  Photo: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Download: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  FAQ: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

// ── Status badge ─────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const published = status === "published";
  return (
    <span className={`status-badge status-badge--${published ? "published" : "draft"}`}>
      {published ? "Published" : "Draft"}
    </span>
  );
};

// ── Dashboard ────────────────────────────────────────────────────
export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const session = parseSession(cookieStore.get("proinfo_admin_session")?.value);

  // Real counts from DB
  const [productCount, categoryCount, postCount, videoCount, photoCount, downloadCount, faqCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.post.count(),
    prisma.video.count(),
    prisma.photoAlbum.count(),
    prisma.downloadFile.count(),
    prisma.faq.count(),
  ]);
  // Recent items
  const recentProducts = await prisma.product.findMany({
    orderBy: { updatedAt: "desc" },
    take: 6,
    include: { category: { select: { slug: true } } },
  });

  const recentPosts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    take: 5,
  });

  const STATS = [
    { title: "Products", value: productCount, bg: "#E26666", icon: icons.products, href: "/admin/products" },
    { title: "Categories", value: categoryCount, bg: "#E26666", icon: icons.categories, href: "/admin/categories" },
    { title: "Blog Posts", value: postCount, bg: "#E26666", icon: icons.blog, href: "/admin/blog" },
    { title: "Videos", value: videoCount, bg: "#E26666", icon: icons.video, href: "/admin/video" },
    { title: "Photos", value: photoCount, bg: "#E26666", icon: icons.photo, href: "/admin/photo" },
    { title: "Downloads", value: downloadCount, bg: "#E26666", icon: icons.download, href: "/admin/download" },
    { title: "FAQ Entries", value: faqCount, bg: "#E26666", icon: icons.faq, href: "/admin/faq" },
  ];

  return (
    <div className="admin-dashboard">

      {/* ── Header ── */}
      <div className="admin-dashboard__header">
        <h1 className="admin-dashboard__header__title">
          Welcome back, {session?.username} 👋
        </h1>
        <p className="admin-dashboard__header__subtitle">
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          {" · "}<span>{session?.role}</span>
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="admin-dashboard__stats">
        {STATS.map((s) => (
          <Link key={s.title} href={s.href} className="admin-dashboard__stats__card">
            <IconBox bg={s.bg} icon={s.icon} />
            <div className="admin-dashboard__stats__card__content">
              <div className="admin-dashboard__stats__card__label">
                {s.title}
              </div>
              <div className="admin-dashboard__stats__card__value">
                {s.value}
              </div>
              {s.sub && <div className="admin-dashboard__stats__card__sub">{s.sub}</div>}
            </div>
            <span className="admin-dashboard__stats__card__arrow">{icons.arrow}</span>
          </Link>
        ))}
      </div>

      {/* ── Two-column section ── */}
      <div className="admin-dashboard__grid">

        {/* Recent Products */}
        <div className="admin-dashboard__card">
          <div className="admin-dashboard__card__header">
            <span className="admin-dashboard__card__title">
              Recent Products
            </span>
            <Link href="/admin/products" className="admin-dashboard__card__link">View all →</Link>
          </div>
          <div>
            {recentProducts.length === 0 && (
              <div className="admin-dashboard__card__empty">No products yet.</div>
            )}
            {recentProducts.map((p, i) => (
              <div key={p.id} className={`admin-dashboard__card__item ${i < recentProducts.length - 1 ? '' : 'admin-dashboard__card__item--last'}`}>
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt="" width={36} height={36} className="admin-dashboard__card__item__image" />
                ) : (
                  <div className="admin-dashboard__card__item__placeholder" />
                )}
                <div className="admin-dashboard__card__item__content">
                  <div className="admin-dashboard__card__item__name">
                    {p.slug}
                  </div>
                  <div className="admin-dashboard__card__item__category">{p.category?.slug}</div>
                </div>
                <div className="admin-dashboard__card__item__date">
                  {new Date(p.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div className="admin-dashboard__card">
          <div className="admin-dashboard__card__header">
            <span className="admin-dashboard__card__title">
              Recent Blog Posts
            </span>
            <Link href="/admin/blog" className="admin-dashboard__card__link">View all →</Link>
          </div>
          <div>
            {recentPosts.length === 0 && (
              <div className="admin-dashboard__card__empty">No posts yet.</div>
            )}
            {recentPosts.map((p, i) => (
              <div key={p.id} className={`admin-dashboard__card__item ${i < recentPosts.length - 1 ? '' : 'admin-dashboard__card__item--last'}`}>
                {p.coverImageUrl ? (
                  <img src={p.coverImageUrl} alt="" width={36} height={36} className="admin-dashboard__card__item__image" />
                ) : (
                  <div className="admin-dashboard__card__item__placeholder" />
                )}
                <div className="admin-dashboard__card__item__content">
                  <div className="admin-dashboard__card__item__name">
                    {p.slug}
                  </div>
                  <div className="admin-dashboard__card__item__status">
                    <StatusBadge status={p.publishedAt ? "published" : "draft"} />
                  </div>
                </div>
                <div className="admin-dashboard__card__item__date">
                  {new Date(p.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content Breakdown ── */}
      <div className="admin-dashboard__overview">
        <div className="admin-dashboard__overview__title">
          Content Overview
        </div>
        <div className="admin-dashboard__overview__grid">
          {[
            { label: "Blog Posts", count: postCount, href: "/admin/blog" },
            { label: "Videos", count: videoCount, href: "/admin/video" },
            { label: "Photos", count: photoCount, href: "/admin/photo" },
            { label: "Downloads", count: downloadCount, href: "/admin/download" },
            { label: "FAQ Items", count: faqCount, href: "/admin/faq" },
            { label: "Categories", count: categoryCount, href: "/admin/categories" },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="admin-dashboard__overview__tile">
              <div className="admin-dashboard__overview__tile__count">
                {item.count}
              </div>
              <div className="admin-dashboard__overview__tile__label">{item.label}</div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
