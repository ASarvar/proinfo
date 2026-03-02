import { useRouter, useSearchParams } from "next/navigation";

const PriceItem = ({ id, min, max }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");

  // handlePrice
  const handlePrice = (min, max) => {
    if (min) {
      router.push(`/shop?priceMin=${min}&max=${max}`);
    } else {
      router.push(`/shop?priceMax=${max}`);
    }
  };
  return (
    <div className="shop__widget-list-item">
      <input
        onChange={() => handlePrice(min, max)}
        type="checkbox"
        id={`higher-${id}`}
        checked={
          priceMin === `${min}` ||
          priceMax === `${max}`
            ? "checked"
            : false
        }
      />
      {min === 0 ? (
        <label htmlFor={`higher-${id}`}>
          Under ${max.toLocaleString()}
        </label>
      ) : max < 15000 ? (
        <label htmlFor={`higher-${id}`}>
          ${min.toLocaleString()} - ${max.toLocaleString()}
        </label>
      ) : (
        <label htmlFor={`higher-${id}`}>
          ${max.toLocaleString()}+
        </label>
      )}
    </div>
  );
};

export default PriceItem;
