export interface Transaction {
    transactionId: string;
    cardId: string;
    userId: string;
    type: "PURCHASE" | "SAVING" | "PAYMENT_BALANCE";
    merchant: string;
    amount: number;
    createdAt: string;
  }
  