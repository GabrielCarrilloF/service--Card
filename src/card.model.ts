export interface Card {
    cardId: string;
    userId: string;
    type: "DEBIT" | "CREDIT";
    status: "PENDING" | "ACTIVATED";
    balance: number;
    used?: number; // para crédito
    createdAt: string;
  }
  