import AOS from "aos";
import "aos/dist/aos.css";

export const initAOS = () => {
  AOS.init({
    // Chạy 1 lần duy nhất
    once: true,
    // Khoảng cách từ đáy viewport đến element để bắt đầu
    offset: 120,
    // Thời gian hiệu ứng
    duration: 800,
    // Độ trễ
    delay: 100,
    // Easing
    easing: 'ease-in-out',
  });
};
