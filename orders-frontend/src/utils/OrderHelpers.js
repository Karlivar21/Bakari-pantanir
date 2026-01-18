export const formatProducts = (order) => {
  const products = [];

  const orderProducts =
    typeof order.products === "string" ? JSON.parse(order.products) : order.products;

  let hasBites = false;

  (orderProducts ?? []).forEach((product) => {
    switch (product.type) {
      case "cake": {
        const cake = product.details;
        if (cake.cake === "Sykurmassamynd") {
          products.push(`${cake.cake}`);
        } else {
          products.push(
            `${cake.cake} - Stærð: ${cake.size}` +
              `${cake.filling ? `, Fylling: ${cake.filling}` : ""}` +
              `${cake.bottom ? `, Botn: ${cake.bottom}` : ""}` +
              `${cake.smjorkrem ? `, Smjörkrem: ${cake.smjorkrem}` : ""}`
          );
        }
        break;
      }

      case "bread": {
        const bread = product.details;
        products.push(`${bread.bread} - Magn: ${bread.quantity}`);
        break;
      }

      case "minidonut": {
        const minidonut = product.details;
        products.push(`Minidonuts - Magn: ${minidonut.quantity}`);
        break;
      }

      case "bite": {
        hasBites = true; // mark that this order contains smáréttir
        break;
      }

      default: {
        const d = product.details ?? {};
        const label = d.other ?? d.name ?? product.type ?? "Vara";
        products.push(`${label} - Magn: ${d.quantity ?? 0}`);
      }
    }
  });

  // Add ONE line for all bites
  if (hasBites) {
    products.push("Smáréttapöntun");
  }

  return products;
};



export const formatDateIS = (date) => {
    const [day, month, year] = date.split('/');
    const monthNames = [
        'janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní',
        'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember'
    ];
    const parsedDate = new Date(`${year}-${month}-${day}`);
    return `${parsedDate.getDate()}. ${monthNames[parsedDate.getMonth()]}`;
};
