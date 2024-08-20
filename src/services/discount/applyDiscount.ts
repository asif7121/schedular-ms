import { Bundle } from "@models/bundle"
import { Discount } from "@models/discount"
import { Product } from "@models/product"


export const applyDiscount = async (discountId: string) => {
	const discount = await Discount.findById(discountId)
    if (discount && !discount.isDeleted && !discount.isActive) {
        discount.isActive = true
		// Apply discount to products
		if (discount._products?.length) {
			for (const productId of discount._products) {
				const product = await Product.findById(productId)
				if (product) {
					const discountedPrice =
						discount.type === 'mrp'
							? product.mrp - (product.mrp * discount.value) / 100
							: product.price - (product.price * discount.value) / 100
                    product.price = discountedPrice
                    product.platformDiscount = discount.value
					await product.save()
				}
			}
		}

		// Apply discount to bundles
		if (discount._bundles?.length) {
			for (const bundleId of discount._bundles) {
				const bundle = await Bundle.findById(bundleId)
				if (bundle) {
					const discountedPrice =
						discount.type === 'mrp'
							? bundle.mrp - (bundle.mrp * discount.value) / 100
							: bundle.price - (bundle.price * discount.value) / 100
                    bundle.price = discountedPrice
                    bundle.platformDiscount = discount.value
					await bundle.save()
				}
			}
        }
        await discount.save()
	}
}


