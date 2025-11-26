export default class Transformer {
    #data: any; // Thuộc tính private

    constructor(resource: any) {
        // Kiểm tra xem resource có phải là mảng hay không
        if (Array.isArray(resource)) {
            // Nếu là mảng, gọi `response` trên mỗi phần tử
            this.#data = resource.map((instance: any) => {
                return this.response(instance);
            });
        } else {
            // Nếu là đối tượng đơn, gọi `response` một lần
            this.#data = this.response(resource);
        }
    }

    // Phương thức trừu tượng cần phải được triển khai bởi lớp con
    response(instance: any) {
        throw new Error("Method not implemented.");
    }

    // Getter để truy xuất dữ liệu private `#data`
    getData() {
        return this.#data;
    }
}