import { Bundle } from "@models/bundle"
import { Discount } from "@models/discount"
import { Product } from "@models/product"





export const removeDiscount = async (discountId: string) => {
	const discount = await Discount.findById(discountId)
    if (discount && !discount.isDeleted && discount.isActive) {
        discount.isActive = false
		// Revert products to original price
		if (discount._products?.length) {
			for (const productId of discount._products) {
				const product = await Product.findById(productId)
				if (product) {
					product.price = product.discount
						? product.mrp - (product.mrp * product.discount) / 100
						: product.mrp
					product.platformDiscount = undefined
					await product.save()
				}
			}
		}

		// Revert bundles to original price
		if (discount._bundles?.length) {
			for (const bundleId of discount._bundles) {
				const bundle = await Bundle.findById(bundleId)
				if (bundle) {
					bundle.price = bundle.discount
						? bundle.mrp - (bundle.mrp * bundle.discount) / 100
						: bundle.mrp
					bundle.platformDiscount = undefined
					await bundle.save()
				}
			}
        }
        await discount.save()
	}
}
