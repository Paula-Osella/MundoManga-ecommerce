import Ticket from '../daos/models/ticket.model.js';

const money = n => {
  const num = Math.round((Number(n) || 0) * 100) / 100;
  return '$' + num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const showReceipt = async (req, res) => {
  try {
    const { code } = req.params;
    const ticket = await Ticket.findOne({ code }).lean();
    if (!ticket) {
      return res.status(404).render('purchase', {
        layout: 'main',
        error: 'No encontramos tu comprobante (ticket).',
      });
    }

    res.render('purchase', {
      layout: 'main',
      ticket: {
        code: ticket.code,
        purchaser: ticket.purchaser,
        amount: money(ticket.amount),
        date: ticket.purchase_datetime?.toLocaleString('es-AR') || '-',
        items: (ticket.items || []).map(i => ({
          title: i.title,
          price: money(i.price),
          quantity: i.quantity,
          subtotal: money(i.subtotal),
        }))
      }
    });
  } catch (err) {
    console.error('Error al mostrar comprobante:', err);
    res.status(500).render('purchase', {
      layout: 'main',
      error: 'Error al mostrar el comprobante',
    });
  }
};
