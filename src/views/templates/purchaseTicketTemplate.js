export const purchaseTicketTemplate = (ticket, email, items = []) => {
  const date = new Date(ticket.purchase_datetime || Date.now()).toLocaleString('es-AR');
  const amount = Number(ticket.amount || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const itemsRows = items.map(it => `
    <tr>
      <td style="padding:6px 8px; border-bottom:1px solid #eee;">${it.title}</td>
      <td style="padding:6px 8px; border-bottom:1px solid #eee; text-align:center;">${it.quantity}</td>
      <td style="padding:6px 8px; border-bottom:1px solid #eee; text-align:right;">$${Number(it.price).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
      <td style="padding:6px 8px; border-bottom:1px solid #eee; text-align:right;"><strong>$${Number(it.subtotal).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</strong></td>
    </tr>
  `).join('');

  return `
  <div style="font-family: Arial, Helvetica, sans-serif; color:#333; padding:24px; background:#f7f7f9;">
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;border:1px solid #eee;">
      <tr>
        <td style="background:#E74C3C; color:#fff; padding:18px 24px;">
          <h1 style="margin:0; font-size:20px;">Mundo Manga · Ticket de compra</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 24px;">
          <p>Hola <strong>${email}</strong>, ¡gracias por tu compra! Este es tu comprobante:</p>

          <table style="width:100%; border-collapse:collapse; margin-top:12px;">
            <tr><td style="color:#777;">Código</td><td style="text-align:right;"><strong>${ticket.code}</strong></td></tr>
            <tr><td style="color:#777;">Fecha</td><td style="text-align:right;">${date}</td></tr>
            <tr><td style="color:#777;">Comprador</td><td style="text-align:right;">${ticket.purchaser}</td></tr>
          </table>

          <h3 style="margin:18px 0 8px;">Productos</h3>
          <table style="width:100%; border-collapse:collapse;">
            <thead>
              <tr>
                <th style="text-align:left; border-bottom:2px solid #eee; padding:6px 8px;">Producto</th>
                <th style="text-align:center; border-bottom:2px solid #eee; padding:6px 8px;">Cant.</th>
                <th style="text-align:right; border-bottom:2px solid #eee; padding:6px 8px;">Precio</th>
                <th style="text-align:right; border-bottom:2px solid #eee; padding:6px 8px;">Subtotal</th>
              </tr>
            </thead>
            <tbody>${itemsRows}</tbody>
          </table>

          <p style="text-align:right; margin-top:12px; font-size:16px;">Total: <strong>$${amount}</strong></p>

          <p style="margin-top:18px;">Ante cualquier consulta, respondé este email. ¡Gracias por elegirnos! 🙌</p>
        </td>
      </tr>
      <tr>
        <td style="background:#fafafa; color:#999; font-size:12px; padding:12px 24px; text-align:center;">
          © ${new Date().getFullYear()} Mundo Manga
        </td>
      </tr>
    </table>
  </div>`;
};
