import { useEffect, useRef } from 'react';

const EmailInput = ({ onValidation }) => {
  const inputRef = useRef();

  useEffect(() => {
    if (window.NeverBounce && inputRef.current) {
      window.NeverBounce.init(inputRef.current, {
        onResult: (result) => {
          console.log("Kết quả kiểm tra NeverBounce:", result);
          if (onValidation) onValidation(result);
        }
      });
    }
  }, []);

  return (
    <input
      type="email"
      ref={inputRef}
      placeholder="Nhập email để kiểm tra"
      className="border p-2 rounded w-full"
    />
  );
};

export default EmailInput;
