import { Server } from 'socket.io';
import axios from 'axios';

export interface SepayTransactionsResponse {
  status: number;
  messages: any;
  error: any;
  transactions: any[];
}

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
    this.apiKey = process.env.SE_PAY_API_KEY || 'your_api_key';
    this.accountNumber = process.env.SE_PAY_ACCOUNT_VA || 'your_account_number';
    this.bankCode = process.env.SE_PAY_BANK_CODE || 'BIDV';
    this.bankAccountName = process.env.SE_PAY_BANK_ACCOUNT_NAME || 'your_account_name';
  }

  // Xử lý webhook
  async handleWebhook(webhookData: any): Promise<any> {
    console.log('Webhook received:', webhookData);

    const paymentStatus =
      webhookData.transferAmount > 0 ? 'completed' : 'failed';

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