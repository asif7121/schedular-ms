import { sendSaleActivationNotification } from "@core/sendSaleNotificationToUsers"
import { Product } from "@models/product"
import { Sale } from "@models/sale"
import { User } from "@models/user"


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
				product.productPrice = discountedPrice
				productDoc.isInSale = true
				await productDoc.save()
			}
		}
		await sale.save()
		// Fetch all users to notify about the active sale
		const users = await User.find({ isVerified: true, isBlocked: false, isEmailVerified: true })

		// Send email notifications to users
		await sendSaleActivationNotification(sale, users)
	}
}


