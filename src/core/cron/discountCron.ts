import cron from 'node-cron'
import moment from 'moment'
import { Discount } from '@models/discount'
import { applyDiscount } from '@services/discount/applyDiscount'
import { removeDiscount } from '@services/discount/removeDiscount'


export const startDiscountScheduler = () => {
	cron.schedule('* * * * *', async () => {
		const now = moment().toDate()

		const discountsToApply = await Discount.find({ startDate: { $lte: now }, isDeleted: false })
		for (const discount of discountsToApply) {
			await applyDiscount(discount._id.toString())
		}

		const discountsToEnd = await Discount.find({ endDate: { $lte: now }, isDeleted: false })
		for (const discount of discountsToEnd) {
			await removeDiscount(discount._id.toString())
		}
	})
}
