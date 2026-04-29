import { cookies } from "next/headers";
import { parseSession } from "@lib/admin-auth";
import { prisma } from "@lib/api-helpers";
import Link from "next/link";
import {
  adminGroupBodyStyle,
  adminGroupCardStyle,
  adminHeroStyle,
  adminHeroMetaWrapStyle,
  adminHeroSubtitleStyle,
  adminMetaLabelStyle,
  adminMetaPillStyle,
  adminMetaValueStyle,
  adminPageShellStyle,
  adminPageTitleStyle,
  adminSectionStyle,
  adminStatusDraftStyle,
  adminStatusPublishedStyle,
} from "@components/admin/admin-ui-tokens";

// ── Tiny SVG icons ──────────────────────────────────────────────
const IconBox = ({ bg, icon }) => (
  <span style={{ ...statIconBoxStyle, background: bg }}>{icon}</span>
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

// ── Status badge ─────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const published = status === "published";
  return (
    <span style={published ? adminStatusPublishedStyle : adminStatusDraftStyle}>
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
    <div style={pageStyle}>

      {/* ── Header ── */}
      <div style={heroStyle}>
        <div style={{ minWidth: 0 }}>
        <h1 style={heroTitleStyle}>
          Welcome back, {session?.username} 👋
        </h1>
        <p style={heroSubtitleStyle}>
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          {" · "}<span>{session?.role}</span>
        </p>
        </div>
        <div style={heroMetaWrapStyle}>
          <div style={metaPillStyle}>
            <span style={metaLabelStyle}>Products</span>
            <strong style={metaValueStyle}>{productCount}</strong>
          </div>
          <div style={metaPillStyle}>
            <span style={metaLabelStyle}>Posts</span>
            <strong style={metaValueStyle}>{postCount}</strong>
          </div>
          <div style={metaPillStyle}>
            <span style={metaLabelStyle}>Media</span>
            <strong style={metaValueStyle}>{videoCount + photoCount + downloadCount}</strong>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={statsGridStyle}>
        {STATS.map((s) => (
          <Link key={s.title} href={s.href} style={statCardStyle}>
            <IconBox bg={s.bg} icon={s.icon} />
            <div style={statContentStyle}>
              <div style={statLabelStyle}>
                {s.title}
              </div>
              <div style={statValueStyle}>
                {s.value}
              </div>
              {s.sub && <div style={statSubStyle}>{s.sub}</div>}
            </div>
            <span style={statArrowStyle}>{icons.arrow}</span>
          </Link>
        ))}
      </div>

      {/* ── Two-column section ── */}
      <div style={twoColumnGridStyle}>

        {/* Recent Products */}
        <div style={contentCardStyle}>
          <div style={contentCardHeaderStyle}>
            <span style={contentCardTitleStyle}>
              Recent Products
            </span>
            <Link href="/admin/products" style={contentCardLinkStyle}>View all →</Link>
          </div>
          <div>
            {recentProducts.length === 0 && (
              <div style={emptyCardStyle}>No products yet.</div>
            )}
            {recentProducts.map((p, i) => (
              <div key={p.id} style={{ ...cardItemStyle, ...(i < recentProducts.length - 1 ? null : cardItemLastStyle) }}>
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt="" width={36} height={36} style={cardItemImageStyle} />
                ) : (
                  <div style={cardItemPlaceholderStyle} />
                )}
                <div style={cardItemContentStyle}>
                  <div style={cardItemNameStyle}>
                    {p.slug}
                  </div>
                  <div style={cardItemMetaStyle}>{p.category?.slug}</div>
                </div>
                <div style={cardItemDateStyle}>
                  {new Date(p.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div style={contentCardStyle}>
          <div style={contentCardHeaderStyle}>
            <span style={contentCardTitleStyle}>
              Recent Blog Posts
            </span>
            <Link href="/admin/blog" style={contentCardLinkStyle}>View all →</Link>
          </div>
          <div>
            {recentPosts.length === 0 && (
              <div style={emptyCardStyle}>No posts yet.</div>
            )}
            {recentPosts.map((p, i) => (
              <div key={p.id} style={{ ...cardItemStyle, ...(i < recentPosts.length - 1 ? null : cardItemLastStyle) }}>
                {p.coverImageUrl ? (
                  <img src={p.coverImageUrl} alt="" width={36} height={36} style={cardItemImageStyle} />
                ) : (
                  <div style={cardItemPlaceholderStyle} />
                )}
                <div style={cardItemContentStyle}>
                  <div style={cardItemNameStyle}>
                    {p.slug}
                  </div>
                  <div style={cardItemMetaStyle}>
                    <StatusBadge status={p.publishedAt ? "published" : "draft"} />
                  </div>
                </div>
                <div style={cardItemDateStyle}>
                  {new Date(p.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content Breakdown ── */}
      <div style={overviewWrapStyle}>
        <div style={overviewTitleStyle}>
          Content Overview
        </div>
        <div style={overviewGridStyle}>
          {[
            { label: "Blog Posts", count: postCount, href: "/admin/blog" },
            { label: "Videos", count: videoCount, href: "/admin/video" },
            { label: "Photos", count: photoCount, href: "/admin/photo" },
            { label: "Downloads", count: downloadCount, href: "/admin/download" },
            { label: "FAQ Items", count: faqCount, href: "/admin/faq" },
            { label: "Categories", count: categoryCount, href: "/admin/categories" },
          ].map((item) => (
            <Link key={item.label} href={item.href} style={overviewTileStyle}>
              <div style={overviewTileCountStyle}>
                {item.count}
              </div>
              <div style={overviewTileLabelStyle}>{item.label}</div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}

const pageStyle = {
  ...adminPageShellStyle,
  padding: "12px 0 6px",
};

const heroStyle = {
  ...adminHeroStyle,
  marginBottom: 18,
};

const heroTitleStyle = {
  ...adminPageTitleStyle,
  margin: "0 0 6px",
};

const heroSubtitleStyle = adminHeroSubtitleStyle;

const heroMetaWrapStyle = adminHeroMetaWrapStyle;

const metaPillStyle = adminMetaPillStyle;
const metaLabelStyle = adminMetaLabelStyle;
const metaValueStyle = adminMetaValueStyle;

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
  gap: 14,
  marginBottom: 18,
};

const statCardStyle = {
  ...adminSectionStyle,
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  gap: 14,
  minWidth: 0,
};

const statIconBoxStyle = {
  width: 52,
  height: 52,
  borderRadius: 16,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  boxShadow: "0 12px 22px rgba(226,102,102,0.18)",
};

const statContentStyle = { minWidth: 0, flex: 1 };
const statLabelStyle = {
  fontSize: 11,
  fontWeight: 700,
  color: "#6A7188",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginBottom: 4,
};
const statValueStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 28,
  fontWeight: 700,
  color: "#03041C",
  letterSpacing: "-0.03em",
};
const statSubStyle = { fontSize: 13, color: "#667085", marginTop: 2 };
const statArrowStyle = { color: "#98A2B3", flexShrink: 0 };

const twoColumnGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 16,
  marginBottom: 18,
};

const contentCardStyle = adminGroupBodyStyle;

const contentCardHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 12,
  padding: "18px 20px 10px",
};

const contentCardTitleStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 18,
  fontWeight: 700,
  color: "#03041C",
  letterSpacing: "-0.02em",
};

const contentCardLinkStyle = {
  color: "#1D4ED8",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 700,
};

const emptyCardStyle = {
  padding: "4px 20px 20px",
  color: "#667085",
  fontSize: 14,
};

const cardItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "14px 20px",
  borderBottom: "1px solid #F0F2F7",
};

const cardItemLastStyle = { borderBottom: "none" };
const cardItemImageStyle = {
  width: 36,
  height: 36,
  borderRadius: 10,
  objectFit: "cover",
  flexShrink: 0,
};
const cardItemPlaceholderStyle = {
  width: 36,
  height: 36,
  borderRadius: 10,
  background: "linear-gradient(145deg, #F3F5FA 0%, #ECEFF7 100%)",
  border: "1px dashed #CDD5E6",
  flexShrink: 0,
};
const cardItemContentStyle = { minWidth: 0, flex: 1 };
const cardItemNameStyle = {
  fontSize: 14,
  fontWeight: 700,
  color: "#101828",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};
const cardItemMetaStyle = { fontSize: 12, color: "#667085", marginTop: 4 };
const cardItemDateStyle = {
  fontSize: 12,
  color: "#98A2B3",
  fontWeight: 700,
  flexShrink: 0,
};

const overviewWrapStyle = {
  ...adminGroupCardStyle,
  ...adminGroupBodyStyle,
  padding: "18px 20px 20px",
};

const overviewTitleStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 18,
  fontWeight: 700,
  color: "#03041C",
  letterSpacing: "-0.02em",
  marginBottom: 14,
};

const overviewGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: 12,
};

const overviewTileStyle = {
  textDecoration: "none",
  background: "#F8FAFD",
  border: "1px solid #E6E9F2",
  borderRadius: 14,
  padding: "16px 14px",
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const overviewTileCountStyle = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: 26,
  fontWeight: 700,
  color: "#03041C",
  letterSpacing: "-0.03em",
};

const overviewTileLabelStyle = {
  fontSize: 12,
  fontWeight: 700,
  color: "#667085",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
};

