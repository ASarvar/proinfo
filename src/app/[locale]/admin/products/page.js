import Link from "next/link";
import Footer from "@layout/footer";
import Header from "@layout/header";
import Wrapper from "@layout/wrapper";
import { getAdminProducts } from "@lib/content-api";
import { prisma, createEntityTranslations, Language } from "@lib/api-helpers";
import { revalidatePath } from "next/cache";
import { normalizeSlug, normalizeText, isValidSlug, parseOptionalNumber } from "@lib/validation";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Products - ProInfo.uz",
};

export default async function AdminProductsPage({ params, searchParams }) {
  const { locale } = await params;
  const query = (await searchParams) || {};
  const feedbackStatus = query.status || "";
  const feedbackMessage = query.message || "";
  const basePath = `/${locale}/admin/products`;

  const products = await getAdminProducts(locale);
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  async function createProduct(formData) {
    "use server";

    const slug = normalizeSlug(formData.get("slug"));
    const title = normalizeText(formData.get("title"));
    const categorySlug = normalizeSlug(formData.get("categorySlug"));
    const price = parseOptionalNumber(formData.get("price"));

    if (!slug || !title || !categorySlug || !isValidSlug(slug) || !isValidSlug(categorySlug)) {
      redirect(`${basePath}?status=error&message=${encodeURIComponent("Проверьте slug, категорию и название")}`);
    }

    const [exists, category] = await Promise.all([
      prisma.product.findUnique({ where: { slug } }),
      prisma.category.findUnique({ where: { slug: categorySlug } }),
    ]);

    if (exists) {
      redirect(`${basePath}?status=error&message=${encodeURIComponent("Товар с таким slug уже существует")}`);
    }

    if (!category) {
      redirect(`${basePath}?status=error&message=${encodeURIComponent("Категория не найдена")}`);
    }

    const product = await prisma.product.create({
      data: {
        slug,
        categoryId: category.id,
        price,
        order: 0,
      },
    });

    await createEntityTranslations("Product", product.id, {
      [Language.RU]: { title, description: "" },
      [Language.UZ]: { title, description: "" },
      [Language.EN]: { title, description: "" },
    });

    revalidatePath(basePath);
    redirect(`${basePath}?status=success&message=${encodeURIComponent("Товар создан")}`);
  }

  async function deleteProduct(formData) {
    "use server";

    const slug = `${formData.get("slug") || ""}`.trim();
    if (!slug) {
      redirect(`${basePath}?status=error&message=${encodeURIComponent("Slug обязателен")}`);
    }

    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) {
      redirect(`${basePath}?status=error&message=${encodeURIComponent("Товар не найден")}`);
    }

    await prisma.product.delete({ where: { slug } });
    revalidatePath(basePath);
    redirect(`${basePath}?status=success&message=${encodeURIComponent("Товар удален")}`);
  }

  async function updateProduct(formData) {
    "use server";

    const slug = normalizeSlug(formData.get("slug"));
    const title = normalizeText(formData.get("title"));
    const price = parseOptionalNumber(formData.get("price"));

    if (!slug || !title || !isValidSlug(slug)) {
      redirect(`${basePath}?status=error&message=${encodeURIComponent("Проверьте slug и название")}`);
    }

    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) {
      redirect(`${basePath}?status=error&message=${encodeURIComponent("Товар не найден")}`);
    }

    await prisma.product.update({
      where: { slug },
      data: { price },
    });

    await prisma.translation.updateMany({
      where: { entityType: "Product", entityId: product.id },
      data: { title },
    });

    revalidatePath(basePath);
    redirect(`${basePath}?status=success&message=${encodeURIComponent("Товар обновлен")}`);
  }

  return (
    <Wrapper>
      <Header style_2={true} />
      <section className="tp-blog-area pt-120 pb-100">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-30">
            <h1 className="mb-0">Товары</h1>
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
            <h4 className="mb-20">Добавить товар</h4>
            <form action={createProduct} className="row g-3">
              <div className="col-md-3">
                <input type="text" name="slug" className="form-control" placeholder="slug" required />
              </div>
              <div className="col-md-3">
                <input type="text" name="title" className="form-control" placeholder="Название" required />
              </div>
              <div className="col-md-3">
                <select name="categorySlug" className="form-select" required defaultValue="">
                  <option value="" disabled>Категория</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.slug}>{category.slug}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <input type="number" step="0.01" name="price" className="form-control" placeholder="Цена" />
              </div>
              <div className="col-md-1">
                <button type="submit" className="tp-btn-border w-100">OK</button>
              </div>
            </form>
          </div>

          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Категория</th>
                  <th>Цена</th>
                  <th>ID</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>
                      {product.slug ? (
                        <form action={updateProduct} className="d-flex gap-2 align-items-center">
                          <input type="hidden" name="slug" value={product.slug} />
                          <input
                            type="text"
                            name="title"
                            defaultValue={product.title}
                            className="form-control form-control-sm"
                            required
                          />
                          <input
                            type="number"
                            step="0.01"
                            name="price"
                            defaultValue={product.price || ""}
                            className="form-control form-control-sm"
                            placeholder="Цена"
                          />
                          <button type="submit" className="btn btn-sm btn-outline-primary">Сохранить</button>
                        </form>
                      ) : (
                        product.title
                      )}
                    </td>
                    <td>{product.category}</td>
                    <td>{product.price}</td>
                    <td>{product._id}</td>
                    <td>
                      <form action={deleteProduct}>
                        <input type="hidden" name="slug" value={product.slug || ""} />
                        <button
                          type="submit"
                          className="btn btn-sm btn-outline-danger"
                          disabled={!product.slug}
                          title={!product.slug ? "Удаление доступно только для DB-записей" : "Удалить"}
                        >
                          Удалить
                        </button>
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