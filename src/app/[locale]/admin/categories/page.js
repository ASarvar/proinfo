import Link from "next/link";
import Footer from "@layout/footer";
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import { getAdminCategories } from "@lib/content-api";
import { prisma, createEntityTranslations, Language } from "@lib/api-helpers";
import { revalidatePath } from "next/cache";
import { normalizeSlug, normalizeText, isValidSlug } from "@lib/validation";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Categories - ProInfo.uz",
};

export default async function AdminCategoriesPage({ params, searchParams }) {
  const { locale } = await params;
  const query = (await searchParams) || {};
  const feedbackStatus = query.status || "";
  const feedbackMessage = query.message || "";
  const basePath = `/${locale}/admin/categories`;

  const categories = await getAdminCategories(locale);

  async function createCategory(formData) {
    "use server";

    const slug = normalizeSlug(formData.get("slug"));
    const title = normalizeText(formData.get("title"));
    const description = normalizeText(formData.get("description"));

    if (!slug || !title || !isValidSlug(slug)) {
      redirect(`${basePath}?status=error&message=${encodeURIComponent("Проверьте slug и название")}`);
    }

    const exists = await prisma.category.findUnique({ where: { slug } });
    if (exists) {
      redirect(`${basePath}?status=error&message=${encodeURIComponent("Категория с таким slug уже существует")}`);
    }

    const category = await prisma.category.create({
      data: {
        slug,
        order: 0,
      },
    });

    await createEntityTranslations("Category", category.id, {
      [Language.RU]: { title, description },
      [Language.UZ]: { title, description },
      [Language.EN]: { title, description },
    });

    revalidatePath(basePath);
    redirect(`${basePath}?status=success&message=${encodeURIComponent("Категория создана")}`);
  }

  async function updateCategory(formData) {
    "use server";

    const slug = normalizeSlug(formData.get("slug"));
    const title = normalizeText(formData.get("title"));

    if (!slug || !title || !isValidSlug(slug)) {
      redirect(`${basePath}?status=error&message=${encodeURIComponent("Проверьте slug и название")}`);
    }

    const category = await prisma.category.findUnique({ where: { slug } });
    if (!category) {
      redirect(`${basePath}?status=error&message=${encodeURIComponent("Категория не найдена")}`);
    }

    await prisma.translation.updateMany({
      where: { entityType: "Category", entityId: category.id },
      data: { title },
    });

    revalidatePath(basePath);
    redirect(`${basePath}?status=success&message=${encodeURIComponent("Категория обновлена")}`);
  }

  async function deleteCategory(formData) {
    "use server";

    const slug = `${formData.get("slug") || ""}`.trim();
    if (!slug) {
      redirect(`${basePath}?status=error&message=${encodeURIComponent("Slug обязателен")}`);
    }

    const category = await prisma.category.findUnique({
      where: { slug },
      include: { products: { select: { id: true } } },
    });

    if (!category) {
      redirect(`${basePath}?status=error&message=${encodeURIComponent("Категория не найдена")}`);
    }

    if (category.products.length > 0) {
      redirect(`${basePath}?status=error&message=${encodeURIComponent("Нельзя удалить категорию с товарами")}`);
    }

    await prisma.category.delete({ where: { slug } });
    revalidatePath(basePath);
    redirect(`${basePath}?status=success&message=${encodeURIComponent("Категория удалена")}`);
  }

  return (
    <Wrapper>
      <Header style_2={true} />
      <section className="tp-blog-area pt-120 pb-100">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-30">
            <h1 className="mb-0">Категории</h1>
            <Link href={`/${locale}/admin`} className="tp-btn-border">
              Назад в админ
            </Link>
          </div>

          {feedbackMessage ? (
            <div className={`alert ${feedbackStatus === "error" ? "alert-danger" : "alert-success"} mb-30`}>
              {feedbackMessage}
            </div>
          ) : null}

          <div className="mb-30 p-4 border rounded">
            <h4 className="mb-20">Добавить категорию</h4>
            <form action={createCategory} className="row g-3">
              <div className="col-md-3">
                <input type="text" name="slug" className="form-control" placeholder="slug" required />
              </div>
              <div className="col-md-3">
                <input type="text" name="title" className="form-control" placeholder="Название" required />
              </div>
              <div className="col-md-4">
                <input type="text" name="description" className="form-control" placeholder="Описание" />
              </div>
              <div className="col-md-2">
                <button type="submit" className="tp-btn-border w-100">Создать</button>
              </div>
            </form>
          </div>

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Slug</th>
                  <th>Parent</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.slug}>
                    <td>
                      <form action={updateCategory} className="d-flex gap-2 align-items-center">
                        <input type="hidden" name="slug" value={category.slug} />
                        <input
                          type="text"
                          name="title"
                          defaultValue={category.name}
                          className="form-control form-control-sm"
                          required
                        />
                        <button type="submit" className="btn btn-sm btn-outline-primary">Сохранить</button>
                      </form>
                    </td>
                    <td>{category.slug}</td>
                    <td>{category.parentSlug || "-"}</td>
                    <td>
                      <form action={deleteCategory}>
                        <input type="hidden" name="slug" value={category.slug} />
                        <button type="submit" className="btn btn-sm btn-outline-danger">Удалить</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <Footer />
    </Wrapper>
  );
}