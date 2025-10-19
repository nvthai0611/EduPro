export const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDay()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear());
    return `${day}/${month}/${year}`;
  };