import cron from 'node-cron'
import moment from 'moment'
import { Sale } from '@models/sale'
import { activateSale } from '@services/sales/activateSale'
import { deactivateSale } from '@services/sales/deactivaleSale'



export const startSaleScheduler = () => {
	cron.schedule('* * * * * *', async () => {
		const now = moment().startOf('seconds')

		const salesToStart = await Sale.find({
			startDate: { $lte: now.toDate() },
			isActive: false,
			isDeleted: false,
		})
		for (const sale of salesToStart) {
            if (moment(sale.startDate).isSame(now)) {
                await activateSale(sale._id.toString())
            }
		}

		const salesToEnd = await Sale.find({
			endDate: { $lte: now.toDate() },
			isActive: true,
			isDeleted: false,
		})
		for (const sale of salesToEnd) {
            if (moment(sale.endDate).isSame(now)) {
                await deactivateSale(sale._id.toString())
            }
		}
	})
}
