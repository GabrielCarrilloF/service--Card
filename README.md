# Card Service

Integrante C — Card Service (Worker SQS, transacciones, reportes).

## Funcionalidades

- Crear tarjetas (DEBIT/CREDIT) desde cola SQS.
- Activación de tarjetas.
- Transacciones: compra, consignación, pago crédito.
- Reportes en S3.
- Manejo de DLQ.

## Cómo correr localmente

```bash
npm install
npm run build
npm run start
