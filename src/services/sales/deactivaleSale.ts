import { Product } from "@models/product"
import { Sale } from "@models/sale"



export const deactivateSale = async (saleId: string) => {
	const sale = await Sale.findById(saleId)
	if (sale && sale.isActive) {
		sale.isActive = false

		// Revert product prices to original
		for (const product of sale.products) {
			const productDoc = await Product.findById(product.productId)
			if (productDoc) {
				productDoc.price = productDoc.discount
					? productDoc.mrp - (productDoc.mrp * productDoc.discount) / 100
                    : productDoc.mrp
                product.productPrice = productDoc.price
                productDoc.isInSale = false
				await productDoc.save()
			}
		}
		await sale.save()
	}
}