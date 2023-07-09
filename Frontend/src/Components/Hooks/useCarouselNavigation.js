import { useEffect, useRef, useState } from "react";

const useCarouselNavigate = (data) => {
  const scrollRef = useRef(null);
  const itemRef = useRef(null);

  const [btnActive, setBtnActive] = useState({ left: true, right: true });

  useEffect(() => {
    if (data && data.length > 0 && scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      let btns = { left: true, right: true };
      if (scrollLeft + clientWidth < scrollWidth) btns.right = false;
      if (scrollLeft > 0) btns.left = false;
      setBtnActive({ ...btns });
    }
  }, [data]);

  const calcItemWidth = () => {
    if (!itemRef.current) return 0;

    const screenWidth = document.body.clientWidth;
    let scrollWidth = itemRef.current.clientWidth;
    if (screenWidth > 520) scrollWidth *= 1.5;
    return scrollWidth;
  };

  const handleScrollLeft = () => {
    if (!scrollRef.current) return;
    const { scrollLeft } = scrollRef.current;

    const width = calcItemWidth();
    scrollRef.current.scrollLeft -= width;

    if (scrollLeft - width <= 0) setBtnActive({ right: false, left: true });
    else setBtnActive({ right: false, left: false });
  };

  const handleScrollRight = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    const width = calcItemWidth();
    scrollRef.current.scrollLeft += width;

    if (scrollLeft + clientWidth + width >= scrollWidth)
      setBtnActive({ left: false, right: true });
    else setBtnActive({ left: false, right: false });
  };

  return {
    scrollRef,
    itemRef,
    btnActive,
    handleScrollLeft,
    handleScrollRight,
  };
};

export default useCarouselNavigate;
