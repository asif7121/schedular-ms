import nodemailer from 'nodemailer'
import moment from 'moment'

export const sendSaleActivationNotification = async (sale: any, users: any[]) => {
	// Round off the start date and end date to the nearest hour
	const roundedStartDate = moment(sale.startDate).startOf('minutes')
	const roundedEndDate = moment(sale.endDate).startOf('minutes')
	// Email content
	const emailContent = `
		<p>Dear User,</p>
		<p>We are excited to inform you that the sale: <strong>${sale.name}</strong> is now active!</p>
		<p><strong>Description:</strong> ${sale.description}</p>
		<p><strong>Discount:</strong> ${sale.saleDiscount}% off on all products in the category: ${
		sale.name
	}</p>
		<p><strong>Start Date:</strong> ${roundedStartDate.format('YYYY-MM-DD h:mm A')}</p>
		<p><strong>End Date:</strong> ${roundedEndDate.format('YYYY-MM-DD h:mm A')}</p>
		<p>Visit our store now and enjoy amazing discounts!</p>
		<p>Best regards,</p>
		<p>E-commerce app Team</p>
	`

	// Set up nodemailer transporter
	const transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: process.env.EMAIL,
			pass: process.env.EMAIL,
		},
	})

	// Send email to each user
	for (const user of users) {
		await transporter.sendMail({
			from: `E-commerce app <${process.env.EMAIL}>`, // sender address
			to: user.email, // list of receivers
			subject: `Sale on ${sale.name} is Live now`, // Subject line
			html: emailContent, // html body
		})
	}
}
