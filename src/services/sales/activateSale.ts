import { Product } from "@models/product"
import { Sale } from "@models/sale"


export const activateSale = async (saleId: string) => {
	const sale = await Sale.findById(saleId)
	if (sale && !sale.isActive) {
		sale.isActive = true

		// Adjust product prices based on saleDiscount
		for (const product of sale.products) {
			const productDoc = await Product.findById(product.productId)
			if (productDoc) {
				const discountedPrice = productDoc.mrp - (productDoc.mrp * sale.saleDiscount) / 100
				productDoc.price = discountedPrice
				await productDoc.save()
			}
		}
		await sale.save()
	}
}


