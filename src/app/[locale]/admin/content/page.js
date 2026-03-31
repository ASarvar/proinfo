import Link from "next/link";
import Footer from "@layout/footer";
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import { mediaCrudSchema } from "@data/media-schema";
import { getAdminMedia } from "@lib/content-api";
import { prisma, createEntityTranslations, Language } from "@lib/api-helpers";
import { revalidatePath } from "next/cache";
import { normalizeSlug, normalizeText, isValidSlug } from "@lib/validation";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Content - ProInfo.uz",
};

export default async function AdminContentPage({ params, searchParams }) {
  const { locale } = await params;
  const query = (await searchParams) || {};
  const selectedType = query.type || "all";
  const feedbackStatus = query.status || "";
  const feedbackMessage = query.message || "";

  const getBasePath = (type = selectedType) =>
    `/${locale}/admin/content${type && type !== "all" ? `?type=${type}` : ""}`;

  const mediaItems = await getAdminMedia({ locale, type: selectedType });
  const mediaTypes = ["all", "blog", "video", "photo", "download"];
  const schemaFields = Object.entries(mediaCrudSchema);

  async function createBlogPost(formData) {
    "use server";

    const slug = normalizeSlug(formData.get("slug"));
    const title = normalizeText(formData.get("title"));
    const excerpt = normalizeText(formData.get("excerpt"));

    if (!slug || !title || !isValidSlug(slug)) {
      redirect(`${getBasePath()}${selectedType === "all" ? "?" : "&"}status=error&message=${encodeURIComponent("Проверьте slug и заголовок")}`);
    }

    const exists = await prisma.post.findUnique({ where: { slug } });
    if (exists) {
      redirect(`${getBasePath()}${selectedType === "all" ? "?" : "&"}status=error&message=${encodeURIComponent("Статья с таким slug уже существует")}`);
    }

    const post = await prisma.post.create({
      data: {
        slug,
        publishedAt: new Date(),
      },
    });

    await createEntityTranslations("Post", post.id, {
      [Language.RU]: { title, excerpt, content: excerpt },
      [Language.UZ]: { title, excerpt, content: excerpt },
      [Language.EN]: { title, excerpt, content: excerpt },
    });

    revalidatePath(`/${locale}/admin/content`);
    redirect(`${getBasePath()}${selectedType === "all" ? "?" : "&"}status=success&message=${encodeURIComponent("Статья создана")}`);
  }

  async function deleteMedia(formData) {
    "use server";

    const type = `${formData.get("type") || ""}`.trim();
    const slug = `${formData.get("slug") || ""}`.trim();
    if (!type || !slug) {
      redirect(`${getBasePath()}${selectedType === "all" ? "?" : "&"}status=error&message=${encodeURIComponent("Не хватает данных для удаления")}`);
    }

    if (type === "blog") {
      await prisma.post.delete({ where: { slug } }).catch(() => null);
    }

    if (type === "video") {
      await prisma.video.delete({ where: { slug } }).catch(() => null);
    }

    if (type === "photo") {
      await prisma.photoAlbum.delete({ where: { slug } }).catch(() => null);
    }

    if (type === "download") {
      await prisma.downloadFile.delete({ where: { slug } }).catch(() => null);
    }

    revalidatePath(`/${locale}/admin/content`);
    redirect(`${getBasePath()}${selectedType === "all" ? "?" : "&"}status=success&message=${encodeURIComponent("Запись удалена")}`);
  }

  async function updateMediaTitle(formData) {
    "use server";

    const type = `${formData.get("type") || ""}`.trim();
    const slug = normalizeSlug(formData.get("slug"));
    const title = normalizeText(formData.get("title"));

    if (!type || !slug || !title || !isValidSlug(slug)) {
      redirect(`${getBasePath()}${selectedType === "all" ? "?" : "&"}status=error&message=${encodeURIComponent("Проверьте данные для обновления")}`);
    }

    const entityMap = {
      blog: { model: prisma.post, entityType: "Post" },
      video: { model: prisma.video, entityType: "Video" },
      photo: { model: prisma.photoAlbum, entityType: "PhotoAlbum" },
      download: { model: prisma.downloadFile, entityType: "DownloadFile" },
    };

    const entry = entityMap[type];
    if (!entry) {
      redirect(`${getBasePath()}${selectedType === "all" ? "?" : "&"}status=error&message=${encodeURIComponent("Неподдерживаемый тип")}`);
    }

    const item = await entry.model.findUnique({ where: { slug } });
    if (!item) {
      redirect(`${getBasePath()}${selectedType === "all" ? "?" : "&"}status=error&message=${encodeURIComponent("Запись не найдена")}`);
    }

    await prisma.translation.updateMany({
      where: { entityType: entry.entityType, entityId: item.id },
      data: { title },
    });

    revalidatePath(`/${locale}/admin/content`);
    redirect(`${getBasePath()}${selectedType === "all" ? "?" : "&"}status=success&message=${encodeURIComponent("Запись обновлена")}`);
  }

  return (
    <Wrapper>
      <Header style_2={true} />
      <section className="tp-blog-area pt-120 pb-100">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-30">
            <h1 className="mb-0">Контент</h1>
            <Link href={`/${locale}/admin`} className="tp-btn-border">
              Назад в админ
            </Link>
          </div>

          {feedbackMessage ? (
            <div className={`alert ${feedbackStatus === "error" ? "alert-danger" : "alert-success"} mb-30`}>
              {feedbackMessage}
            </div>
          ) : null}

          <div className="mb-30 d-flex flex-wrap gap-2">
            {mediaTypes.map((type) => (
              <Link
                key={type}
                href={`/${locale}/admin/content${type === "all" ? "" : `?type=${type}`}`}
                className={`tp-btn-border ${selectedType === type ? "active" : ""}`}
              >
                {type === "all" ? "Все" : type}
              </Link>
            ))}
          </div>

          <div className="mb-30 p-4 border rounded">
            <h4 className="mb-20">Быстро добавить статью</h4>
            <form action={createBlogPost} className="row g-3">
              <div className="col-md-3">
                <input type="text" name="slug" className="form-control" placeholder="slug" required />
              </div>
              <div className="col-md-4">
                <input type="text" name="title" className="form-control" placeholder="Заголовок" required />
              </div>
              <div className="col-md-4">
                <input type="text" name="excerpt" className="form-control" placeholder="Короткое описание" />
              </div>
              <div className="col-md-1">
                <button type="submit" className="tp-btn-border w-100">OK</button>
              </div>
            </form>
          </div>

          <div className="mb-40 p-4 border rounded">
            <h4 className="mb-20">CRUD schema media</h4>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Поле</th>
                    <th>Тип</th>
                    <th>Обязательное</th>
                  </tr>
                </thead>
                <tbody>
                  {schemaFields.map(([field, config]) => (
                    <tr key={field}>
                      <td>{field}</td>
                      <td>{config.type}</td>
                      <td>{config.required ? "Да" : "Нет"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 border rounded">
            <h4 className="mb-20">Записи медиа ({mediaItems.length})</h4>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Slug</th>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {mediaItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.type}</td>
                      <td>{item.slug}</td>
                      <td>
                        <form action={updateMediaTitle} className="d-flex gap-2 align-items-center">
                          <input type="hidden" name="type" value={item.type} />
                          <input type="hidden" name="slug" value={item.slug} />
                          <input
                            type="text"
                            name="title"
                            defaultValue={item.title}
                            className="form-control form-control-sm"
                            required
                          />
                          <button type="submit" className="btn btn-sm btn-outline-primary">Сохранить</button>
                        </form>
                      </td>
                      <td>{item.publishedAt}</td>
                      <td>
                        <form action={deleteMedia}>
                          <input type="hidden" name="type" value={item.type} />
                          <input type="hidden" name="slug" value={item.slug} />
                          <button type="submit" className="btn btn-sm btn-outline-danger">Удалить</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </Wrapper>
  );
}
