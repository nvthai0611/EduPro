import { Server } from 'socket.io';
import axios from 'axios';
import OrderService from '../order/order.service';

export interface SepayTransactionsResponse {
  status: number;
  messages: any;
  error: any;
  transactions: any[];
}

function extractOrderId(content: string) {
  // orderId MongoDB: 24 ký tự hex
  const match = content.match(/[a-f0-9]{24}/i);
  return match ? match[0] : null;
}

const BASE_URL = process.env.NODE_ENV === 'development' ? "http://localhost:9999" : "https://edu-pro-delta.vercel.app/";

export class PaymentService {
  private io: Server;
  private baseURL: string;
  private apiKey: string;
  private accountNumber: string;
  private bankCode: string;
  private bankAccountName: string;

  constructor(io: Server) {
    this.io = io;
    this.baseURL = 'https://my.sepay.vn/userapi';
    this.apiKey = process.env.SE_PAY_API_KEY;
    this.accountNumber = process.env.SE_PAY_ACCOUNT_VA;
    this.bankCode = process.env.SE_PAY_BANK_CODE;
    this.bankAccountName = process.env.SE_PAY_BANK_ACCOUNT_NAME;
  }

  // Xử lý webhook
  async handleWebhook(webhookData: any): Promise<any> {
    console.log('Webhook received:', webhookData);

    const content = webhookData.content;
    const amount = webhookData.transferAmount;
    const orderId = extractOrderId(content);

    const order = await OrderService.getOrderById(orderId);

    let paymentStatus: string;

    if (order.notes === orderId && order.price === amount) {
      paymentStatus = "completed";
      await axios.post(
        `${BASE_URL}/api/v1/admin/user/purchase/course`,
        {
          userId: order.userId,
          courseId: order.courseId,
          price: order.price,
          orderId: order._id
        }
      );
    } else {
      paymentStatus = "failed";
    }

    return { status: paymentStatus };
  }

  async getTransactions(limit = 50): Promise<any[]> {
    try {
      const response = await axios.get<SepayTransactionsResponse>(
        `${this.baseURL}/transactions/list`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
          params: {
            limit,
            account_number: this.accountNumber,
          },
        }
      );

      return response.data.transactions || [];
    } catch (error) {
      console.error(
        'Lỗi khi lấy danh sách giao dịch từ Sepay',
        error.response?.data || error
      );
      throw error;
    }
  }

  async verifyTransaction(orderCode: string): Promise<any> {
    return {
      orderCode,
      status: 'completed',
      amount: 1000000,
    };
  }
}