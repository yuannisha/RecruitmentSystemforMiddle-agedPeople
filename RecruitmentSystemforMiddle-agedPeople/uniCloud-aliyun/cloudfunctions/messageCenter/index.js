/**
 * 消息中心云函数
 * @description 处理系统消息和应聘通知
 */
'use strict';

const db = uniCloud.database()
const db_messages = db.collection('messages')
const db_userInformations = db.collection('userInformations')

exports.main = async (event, context) => {
	const { action, data } = event
	
	switch (action) {
		case 'getMessageList':
			return await getMessageList(data)
		case 'sendMessage':
			return await sendMessage(data)
		case 'readMessage':
			return await readMessage(data)
		case 'sendInvitation':
			return await sendInvitation(data)
		default:
			return {
				code: -1,
				msg: '未知操作'
			}
	}
}

/**
 * 获取消息列表
 * @param {Object} data 查询条件
 * @returns {Object} 消息列表
 */
async function getMessageList(data) {
	const { userId, page = 1, pageSize = 10 } = data
	
	const list = await db_messages.where({
		receiverId: userId
	})
	.skip((page - 1) * pageSize)
	.limit(pageSize)
	.orderBy('createTime', 'desc')
	.get()
	
	const total = await db_messages.where({
		receiverId: userId
	}).count()
	
	return {
		code: 0,
		msg: '获取成功',
		data: {
			list: list.data,
			total: total.total
		}
	}
}

/**
 * 发送消息
 * @param {Object} data 消息内容
 * @returns {Object} 发送结果
 */
async function sendMessage(data) {
	const { senderId, receiverId, type, title, content } = data
	
	const message = {
		senderId,
		receiverId,
		type, // 1: 系统消息, 2: 应聘通知
		title,
		content,
		isRead: false,
		createTime: Date.now()
	}
	
	const result = await db_messages.add(message)
	
	if (result.id) {
		return {
			code: 0,
			msg: '发送成功'
		}
	}
	
	return {
		code: -1,
		msg: '发送失败'
	}
}

/**
 * 标记消息已读
 * @param {Object} data 消息ID
 * @returns {Object} 更新结果
 */
async function readMessage(data) {
	const { messageId } = data
	
	const result = await db_messages.doc(messageId).update({
		isRead: true
	})
	
	if (result.updated === 1) {
		return {
			code: 0,
			msg: '标记成功'
		}
	}
	
	return {
		code: -1,
		msg: '标记失败'
	}
}

// 发送面试邀请
async function sendInvitation(data) {
	const { userId , companyId } = data
	
	if (!userId) {
		return {
			code: 1,
			msg: '缺少用户ID'
		}
	}
	
	try {
		// 获取当前登录用户（企业）信息
		const currentUser = await db_userInformations.doc(companyId).get()
		if (!currentUser.data || !currentUser.data.length) {
			return {
				code: 1,
				msg: '企业信息不存在'
			}
		}
		
		const company = currentUser.data[0]
		
		// 创建面试邀请消息
		const message = {
			type: 4,
			title: '面试邀请',
			content: `${company.name}向您发送了面试邀请，请及时查看并回复，联系方式：${company.phone}。`,
			senderId: company._id,
			receiverId: userId,
			createTime: Date.now(),
			isRead: false
		}
		
		await db_messages.add(message)
		
		return {
			code: 0,
			msg: '邀请发送成功'
		}
	} catch (e) {
		console.log("e",e)
		return {
			code: 1,
			msg: '邀请发送失败'
		}
	}
} 