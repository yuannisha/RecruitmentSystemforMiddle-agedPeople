/**
 * 职位中心云函数
 * @description 处理职位相关的所有操作，包括发布、查询、应聘等
 */
'use strict';

const db = uniCloud.database()
const db_jobs = db.collection('jobs')
const db_applications = db.collection('applications')
const db_userInformations = db.collection('userInformations')
const db_messages = db.collection('messages')
const db_collections = db.collection('favorites-job')

exports.main = async (event, context) => {
	const { action, data } = event
	
	switch (action) {
		case 'postJob':
			return await postJob(data)
		case 'getJobList':
			return await getJobList(data)
		case 'getJobDetail':
			return await getJobDetail(data)
		case 'apply':
			return await apply(data)
		case 'getApplicationList':
			return await getApplicationList(data)
		case 'handleApplication':
			return await handleApplication(data)
		case 'getCompanyJobList':
			return await getCompanyJobList(data)
		case 'getMyJobList':
			return await getMyJobList(data)
		case 'deleteJob':
			return await deleteJob(data)
		case 'updateJob':
			return await updateJob(data)
		case 'collectJob':
			return await collectJob(data)
		case 'cancelCollect':
			return await cancelCollect(data)
		case 'getCollectionList':
			return await getCollectionList(data)
		case 'checkCollected':
			return await checkCollected(data)
		default:
			return {
				code: -1,
				msg: '未知操作'
			}
	}
}

/**
 * 发布职位
 * @param {Object} data 职位信息
 * @returns {Object} 发布结果
 */
async function postJob(data) {
	const { userId, ...jobData } = data
	
	// 验证发布者是否为企业用户
	const userInfo = await db_userInformations.doc(userId).get()
	if (!userInfo.data || userInfo.data[0].userType !== 2) {
		return {
			code: -1,
			msg: '非企业用户不能发布职位'
		}
	}
	
	const job = {
		...jobData,
		companyId: userId,
		companyName: userInfo.data[0].name,
		status: 1, // 1: 招聘中
		createTime: Date.now(),
		updateTime: Date.now()
	}
	
	const result = await db_jobs.add(job)
	
	if (result.id) {
		return {
			code: 0,
			msg: '发布成功',
			data: {
				jobId: result.id
			}
		}
	}
	
	return {
		code: -1,
		msg: '发布失败'
	}
}

/**
 * 获取职位列表
 * @param {Object} data 查询条件
 * @returns {Object} 职位列表
 */
async function getJobList(data) {
	const { keyword = '', page = 1, pageSize = 10 } = data
	
	const query = {
		status: 1
	}
	
	if (keyword) {
		query.title = new RegExp(keyword, 'i')
	}
	
	const list = await db_jobs.where(query)
		.skip((page - 1) * pageSize)
		.limit(pageSize)
		.orderBy('createTime', 'desc')
		.get()
		
	const total = await db_jobs.where(query).count()
	
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
 * 获取职位详情
 * @param {Object} data 查询条件
 * @returns {Object} 职位详情
 */
async function getJobDetail(data) {
	const { jobId } = data
	
	const result = await db_jobs.doc(jobId).get()

	const companyInfo = await db_userInformations.doc(result.data[0].companyId).get()

	result.data[0].companyInfo = companyInfo.data[0]
	
	if (result.data && result.data.length > 0) {
		return {
			code: 0,
			msg: '获取成功',
			data: result.data[0]
		}
	}
	
	return {
		code: -1,
		msg: '职位不存在'
	}
}

/**
 * 申请职位
 * @param {Object} data 申请信息
 * @returns {Object} 申请结果
 */
async function apply(data) {
	const { userId, jobId } = data
	
	// 验证申请者是否为求职者
	const userInfo = await db_userInformations.doc(userId).get()
	if (!userInfo.data || userInfo.data[0].userType !== 1) {
		return {
			code: -1,
			msg: '非求职者不能申请职位'
		}
	}
	
	// 检查是否已经申请过
	const existApply = await db_applications.where({
		userId,
		jobId
	}).get()
	
	if (existApply.data.length > 0) {
		return {
			code: -1,
			msg: '您已经申请过该职位'
		}
	}
	
	const application = {
		userId,
		jobId,
		status: 1, // 1: 待处理
		createTime: Date.now(),
		updateTime: Date.now()
	}
	
	const result = await db_applications.add(application)
	
	if (result.id) {
		return {
			code: 0,
			msg: '申请成功'
		}
	}
	
	return {
		code: -1,
		msg: '申请失败'
	}
}

/**
 * 获取应聘记录
 * @param {Object} data 查询条件
 * @returns {Object} 应聘记录列表
 */
async function getApplicationList(data) {
	const { userId, userType, status, page = 1, pageSize = 10 } = data
	
	let query = {}
	
	if (userType === 1) {
		// 求职者查看自己的申请记录
		query.userId = userId
	} else {
		// 企业查看收到的申请
		const jobs = await db_jobs.where({
			companyId: userId
		}).get()
		
		const jobIds = jobs.data.map(job => job._id)
		query.jobId = db.command.in(jobIds)
	}
	
	// 添加状态筛选
	if (status) {
		query.status = status
	}
	
	const list = await db_applications
		.aggregate()
		.match(query)
		.lookup({
			from: 'jobs',
			localField: 'jobId',
			foreignField: '_id',
			as: 'jobInfo'
		})
		.lookup({
			from: 'userInformations',
			localField: 'userId',
			foreignField: '_id',
			as: 'userInfo'
		})
		.skip((page - 1) * pageSize)
		.limit(pageSize)
		.end()
		
	const total = await db_applications.where(query).count()
	
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
 * 处理应聘申请
 * @param {Object} data 处理信息
 * @returns {Object} 处理结果
 */
async function handleApplication(data) {
	const { applicationId, status } = data
	
	// 获取申请信息
	const application = await db_applications.doc(applicationId).get()
	if (!application.data || application.data.length === 0) {
		return {
			code: -1,
			msg: '申请记录不存在'
		}
	}
	
	const applicationInfo = application.data[0]
	
	// 更新申请状态
	const result = await db_applications.doc(applicationId).update({
		status,
		updateTime: Date.now()
	})
	
	if (result.updated === 1) {
		// 获取职位信息
		const job = await db_jobs.doc(applicationInfo.jobId).get()
		const jobInfo = job.data[0]
		
		// 发送消息给求职者
		await db_messages.add({
			senderId: jobInfo.companyId,
			receiverId: applicationInfo.userId,
			type: 2,
			title: status === 2 ? '应聘通过通知' : '应聘未通过通知',
			content: `您申请的职位"${jobInfo.title}"${status === 2 ? '已通过' : '未通过'}筛选`,
			isRead: false,
			createTime: Date.now()
		})
		
		return {
			code: 0,
			msg: '处理成功'
		}
	}
	
	return {
		code: -1,
		msg: '处理失败'
	}
}

// 获取公司职位列表
async function getCompanyJobList(data) {
	const { companyId, page = 1, pageSize = 10 } = data
	
	if (!companyId) {
		return {
			code: 1,
			msg: '缺少公司ID'
		}
	}
	
	const skip = (page - 1) * pageSize
	
	try {
		const countResult = await db_jobs.where({
			companyId: companyId
		}).count()
		
		const { total } = countResult
		
		const listResult = await db_jobs
			.where({
				companyId: companyId
			})
			.skip(skip)
			.limit(pageSize)
			.orderBy('createTime', 'desc')
			.get()
		
		return {
			code: 0,
			msg: '获取成功',
			data: {
				list: listResult.data,
				total
			}
		}
	} catch (e) {
		return {
			code: 1,
			msg: '获取失败'
		}
	}
}

// 获取企业已发布职位列表
async function getMyJobList(data) {
	const { userId, keyword = '', page = 1, pageSize = 10 } = data
	
	const query = {
		companyId: userId
	}
	
	if (keyword) {
		query.title = new RegExp(keyword, 'i')
	}
	
	try {
		const countResult = await db_jobs.where(query).count()
		const { total } = countResult
		
		const listResult = await db_jobs
			.where(query)
			.skip((page - 1) * pageSize)
			.limit(pageSize)
			.orderBy('createTime', 'desc')
			.get()
			
		// 获取每个职位的应聘人数
		const jobList = await Promise.all(
			listResult.data.map(async job => {
				const applicationCount = await db_applications.where({
					jobId: job._id
				}).count()
				
				return {
					...job,
					applicationCount: applicationCount.total
				}
			})
		)
		
		return {
			code: 0,
			msg: '获取成功',
			data: {
				list: jobList,
				total
			}
		}
	} catch (e) {
		return {
			code: 1,
			msg: '获取失败'
		}
	}
}

// 删除职位
async function deleteJob(data) {
	const { jobId } = data
	
	if (!jobId) {
		return {
			code: 1,
			msg: '缺少职位ID'
		}
	}
	
	try {
		// 删除职位
		await db_jobs.doc(jobId).remove()
		
		// 删除相关的应聘记录
		await db_applications.where({
			jobId: jobId
		}).remove()
		
		return {
			code: 0,
			msg: '删除成功'
		}
	} catch (e) {
		return {
			code: 1,
			msg: '删除失败'
		}
	}
}

// 更新职位信息
async function updateJob(data) {
	const { jobId, ...updateData } = data
	
	if (!jobId) {
		return {
			code: 1,
			msg: '缺少职位ID'
		}
	}
	
	try {
		// 更新职位信息
		await db_jobs.doc(jobId).update({
			...updateData,
			updateTime: Date.now()
		})
		
		return {
			code: 0,
			msg: '更新成功'
		}
	} catch (e) {
		return {
			code: 1,
			msg: '更新失败'
		}
	}
}

/**
 * 收藏职位
 * @param {Object} data 收藏信息
 * @returns {Object} 收藏结果
 */
async function collectJob(data) {
	const { userId, jobId } = data
	
	if (!userId || !jobId) {
		return {
			code: 1,
			msg: '参数不完整'
		}
	}
	
	try {
		// 检查是否已收藏
		const existCollection = await db_collections.where({
			userId,
			jobId
		}).get()
		
		if (existCollection.data.length > 0) {
			return {
				code: 1,
				msg: '已收藏该职位'
			}
		}
		
		// 获取职位信息
		const jobInfo = await db_jobs.doc(jobId).get()
		if (!jobInfo.data || !jobInfo.data.length) {
			return {
				code: 1,
				msg: '职位不存在'
			}
		}

		// 获取当前用户信息
		const userInfo = await db_userInformations.doc(userId).get()
		if (!userInfo.data || !userInfo.data.length) {
			return {
				code: 1,
				msg: '用户不存在'
			}
		}
		// 添加收藏记录
		await db_collections.add({
			userId,
			jobId,
			createTime: Date.now()
		})
		
		// 发送消息通知企业
		const job = jobInfo.data[0]
		await uniCloud.callFunction({
			name: 'messageCenter',
			data: {
				action: 'sendMessage',
				data: {
					senderId: userId,
					receiverId: job.companyId,
					type: 3, // 收藏通知
					title: '职位收藏通知',
					content: `用户${userInfo.data[0].name}收藏了您发布的职位：${job.title}`
				}
			}
		})
		
		return {
			code: 0,
			msg: '收藏成功'
		}
	} catch (e) {
		return {
			code: 1,
			msg: '收藏失败'
		}
	}
}

/**
 * 取消收藏
 * @param {Object} data 收藏信息
 * @returns {Object} 取消结果
 */
async function cancelCollect(data) {
	const { userId, jobId } = data
	
	if (!userId || !jobId) {
		return {
			code: 1,
			msg: '参数不完整'
		}
	}

	// 获取职位信息
	const jobInfo = await db_jobs.doc(jobId).get()
	if (!jobInfo.data || !jobInfo.data.length) {
		return {
			code: 1,
			msg: '职位不存在'
		}
	}

	// 获取当前用户信息
	const userInfo = await db_userInformations.doc(userId).get()
	if (!userInfo.data || !userInfo.data.length) {
		return {
			code: 1,
			msg: '用户不存在'
		}
	}
	
	try {
		const result = await db_collections.where({
			userId,
			jobId
		}).remove()
		
		if (result.deleted) {

			// 发送消息通知企业
		const job = jobInfo.data[0]
		await uniCloud.callFunction({
			name: 'messageCenter',
			data: {
				action: 'sendMessage',
				data: {
					senderId: userId,
					receiverId: job.companyId,
					type: 3, // 取消收藏通知
					title: '职位取消收藏通知',
					content: `用户${userInfo.data[0].name}取消收藏了您发布的职位：${job.title}`
				}
			}
		})
		
			return {
				code: 0,
				msg: '取消收藏成功'
			}
		}
		
		return {
			code: 1,
			msg: '取消收藏失败'
		}
	} catch (e) {
		console.log(e)
		return {
			code: 1,
			msg: '取消收藏失败'
		}
	}
}

/**
 * 获取收藏列表
 * @param {Object} data 查询参数
 * @returns {Object} 收藏列表
 */
async function getCollectionList(data) {
	const { userId, page = 1, pageSize = 10 } = data
	
	if (!userId) {
		return {
			code: 1,
			msg: '缺少用户ID'
		}
	}
	
	try {
		const collections = await db_collections
			.where({ userId })
			.skip((page - 1) * pageSize)
			.limit(pageSize)
			.orderBy('createTime', 'desc')
			.get()
		
		// 获取职位详情
		const jobList = await Promise.all(
			collections.data.map(async item => {
				const jobInfo = await db_jobs.doc(item.jobId).get()
				return jobInfo.data[0]
			})
		)
		
		const total = await db_collections.where({ userId }).count()
		
		return {
			code: 0,
			msg: '获取成功',
			data: {
				list: jobList,
				total: total.total
			}
		}
	} catch (e) {
		return {
			code: 1,
			msg: '获取失败'
		}
	}
}

/**
 * 检查职位是否已收藏
 * @param {Object} data 查询参数
 * @returns {Object} 检查结果
 */
async function checkCollected(data) {
	const { userId, jobId } = data
	
	if (!userId || !jobId) {
		return {
			code: 1,
			msg: '参数不完整'
		}
	}
	
	try {
		const collection = await db_collections.where({
			userId,
			jobId
		}).get()
		
		return {
			code: 0,
			msg: '获取成功',
			data: {
				collected: collection.data.length > 0
			}
		}
	} catch (e) {
		return {
			code: 1,
			msg: '获取失败'
		}
	}
} 