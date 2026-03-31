import SearchAreaMain from "@components/search-area";

export const metadata = {
  title: "Search Product - Harri Shop",
};

export default async function SearchPage({ searchParams }) {
  const query = (await searchParams)?.query || "";

  return (
    <SearchAreaMain searchText={query} />
  );
}
