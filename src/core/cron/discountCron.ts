import cron from 'node-cron'
import moment from 'moment'
import { Discount } from '@models/discount'
import { applyDiscount } from '@services/discount/applyDiscount'
import { removeDiscount } from '@services/discount/removeDiscount'


export const startDiscountScheduler = () => {
	cron.schedule('* * * * * *', async () => {
		const now = moment().startOf('seconds')

		const discountsToApply = await Discount.find({
			startDate: { $lte: now.toDate() },
			isDeleted: false,
		})
		for (const discount of discountsToApply) {
            if (moment(discount.startDate).isSame(now)) {
                await applyDiscount(discount._id.toString())
            }
		}

		const discountsToEnd = await Discount.find({
			endDate: { $lte: now.toDate() },
			isDeleted: false,
		})
		for (const discount of discountsToEnd) {
            if (moment(discount.endDate).isSame(now)) {
                await removeDiscount(discount._id.toString())
            }
		}
	})
}
