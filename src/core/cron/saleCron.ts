import cron from 'node-cron'
import moment from 'moment'
import { Sale } from '@models/sale'
import { activateSale } from '@services/sales/activateSale'
import { deactivateSale } from '@services/sales/deactivaleSale'



export const startSaleScheduler = () => {
	cron.schedule('* * * * *', async () => {
		const now = moment().toDate()

		const salesToStart = await Sale.find({
			startDate: { $lte: now },
			isActive: false,
			isDeleted: false,
		})
		for (const sale of salesToStart) {
			await activateSale(sale._id.toString())
		}

		const salesToEnd = await Sale.find({
			endDate: { $lte: now },
			isActive: true,
			isDeleted: false,
		})
		for (const sale of salesToEnd) {
			await deactivateSale(sale._id.toString())
		}
	})
}
