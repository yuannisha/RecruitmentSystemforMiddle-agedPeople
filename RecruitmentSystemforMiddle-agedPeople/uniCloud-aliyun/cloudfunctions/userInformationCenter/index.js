/**
 * 用户中心云函数
 * @description 处理用户相关的所有操作，包括登录、注册、信息更新等
 */
'use strict';

const db = uniCloud.database()
const db_userInformations = db.collection('userInformations')

exports.main = async (event, context) => {
	const { action, data } = event
    console.log(event)
	
	switch (action) {
		case 'register':
			return await register(data)
		case 'login':
			return await login(data)
		case 'updateProfile':
			return await updateProfile(data)
		case 'getCompanyInfo':
			return await getCompanyInfo(data)
		case 'getUserDetail':
			return await getUserDetail(data)
		case 'getCompanyList':
			return await getCompanyList(data)
		case 'getCurrentUser':
			return await getCurrentUser(data)
		case 'getUserList':
			return await getUserList(data)
		default:
			return {
				code: -1,
				msg: '未知操作'
			}
	}
}

/**
 * 用户注册
 * @param {Object} data 注册信息
 * @returns {Object} 注册结果
 */
async function register(data) {
	const { phone, password, userType, name } = data
	
	// 检查手机号是否已注册
	const existUser = await db_userInformations.where({
		phone: phone
	}).get()
	
	if (existUser.data.length > 0) {
		return {
			code: -1,
			msg: '该手机号已注册'
		}
	}
	
	// 创建用户
	const userInfo = {
		phone,
		password, // 实际项目中需要加密
		userType, // 1: 求职者, 2: 企业
		name,
		createTime: Date.now(),
		updateTime: Date.now()
	}
	
	const result = await db_userInformations.add(userInfo)
	
	if (result.id) {
		return {
			code: 0,
			msg: '注册成功',
			data: {
				userId: result.id
			}
		}
	}
	
	return {
		code: -1,
		msg: '注册失败'
	}
}

/**
 * 用户登录
 * @param {Object} data 登录信息
 * @returns {Object} 登录结果
 */
async function login(data) {
	const { phone, password } = data
	
	const result = await db_userInformations.where({
		phone,
		password // 实际项目中需要加密
	}).get()
	
	if (result.data.length > 0) {
		const userInfo = result.data[0]
		return {
			code: 0,
			msg: '登录成功',
			data: {
				userId: userInfo._id,
				userType: userInfo.userType,
				name: userInfo.name,
				avatar: userInfo.avatar,
				phone: userInfo.phone
			}
		}
	}
	
	return {
		code: -1,
		msg: '手机号或密码错误'
	}
}

/**
 * 更新用户信息
 * @param {Object} data 用户信息
 * @returns {Object} 更新结果
 */
async function updateProfile(data) {
	const { userId, ...updateData } = data
	
	if (!userId) {
		return {
			code: 1,
			msg: '缺少用户ID'
		}
	}
	
	try {
		// 获取用户当前信息
		const userInfo = await db_userInformations.doc(userId).get()
		if (!userInfo.data || userInfo.data.length === 0) {
			return {
				code: 1,
				msg: '用户不存在'
			}
		}
		
		const currentUser = userInfo.data[0]
		
		// 如果要更新手机号，检查新手机号是否已被使用
		if (updateData.phone && updateData.phone !== currentUser.phone) {
			const existUser = await db_userInformations.where({
				phone: updateData.phone
			}).get()
			
			if (existUser.data.length > 0) {
				return {
					code: 1,
					msg: '该手机号已被使用'
				}
			}
		}
		
		// 如果要更新密码，检查旧密码是否正确
		if (updateData.password && updateData.oldPassword) {
			if (updateData.oldPassword !== currentUser.password) {
				return {
					code: 1,
					msg: '旧密码不正确'
				}
			}
			delete updateData.oldPassword
		}
		
		// 根据用户类型验证字段
		if (currentUser.userType === 1) {
			// 求职者用户
			const allowedFields = [
				'avatar', 'gender', 'age', 'education', 
				'workExperience', 'skills', 'introduction',
				'phone', 'password', 'name'
			]
			Object.keys(updateData).forEach(key => {
				if (!allowedFields.includes(key) || updateData[key] === "") {
					delete updateData[key]
				}
			})
		} else {
			// 企业用户
			const allowedFields = [
				'avatar', 'registeredCapital', 'scale', 
				'companyDescription', 'companyImages',
				'phone', 'password', 'name'
			]
			Object.keys(updateData).forEach(key => {
				if (!allowedFields.includes(key) || updateData[key] === "") {
					delete updateData[key]
				}
			})
		}
		
		// 更新用户信息
		await db_userInformations.doc(userId).update({
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

// 获取公司详情
async function getCompanyInfo(data) {
	const { companyId } = data
	
	if (!companyId) {
		return {
			code: 1,
			msg: '缺少公司ID'
		}
	}
	
	try {
		const company = await db_userInformations.doc(companyId).get()
		
		if (!company.data || !company.data.length) {
			return {
				code: 1,
				msg: '公司不存在'
			}
		}
		
		return {
			code: 0,
			msg: '获取成功',
			data: company.data[0]
		}
	} catch (e) {
		return {
			code: 1,
			msg: '获取失败'
		}
	}
}

// 获取求职者详情
async function getUserDetail(data) {
	const { userId } = data
	
	if (!userId) {
		return {
			code: 1,
			msg: '缺少用户ID'
		}
	}
	
	try {
		const user = await db_userInformations.doc(userId).get()
		
		if (!user.data || !user.data.length) {
			return {
				code: 1,
				msg: '用户不存在'
			}
		}
		
		// 过滤敏感信息
		const userData = user.data[0]
		delete userData.password
		
		return {
			code: 0,
			msg: '获取成功',
			data: userData
		}
	} catch (e) {
		return {
			code: 1,
			msg: '获取失败'
		}
	}
}

// 获取公司列表
async function getCompanyList(data) {
	const { keyword = '', page = 1, pageSize = 10 } = data
	
	const query = {
		userType: 2 // 只查询企业用户
	}
	
	if (keyword) {
		query.name = new RegExp(keyword, 'i')
	}
	
	try {
		const countResult = await db_userInformations.where(query).count()
		const { total } = countResult
		
		const listResult = await db_userInformations
			.where(query)
			.field({
				password: false // 排除密码字段
			})
			.skip((page - 1) * pageSize)
			.limit(pageSize)
			.orderBy('createTime', 'desc')
			.get()
			
		// 获取每个公司的在招职位数量
		const db_jobs = db.collection('jobs')
		const jobList = await Promise.all(
			listResult.data.map(async company => {
				const jobCount = await db_jobs.where({
					companyId: company._id
				}).count()
				
				return {
					...company,
					jobCount: jobCount.total
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

// 获取当前用户信息
async function getCurrentUser(data) {
	try {
		console.log("data",data)
		const userInfo = await db_userInformations.doc(data.userInfo.userId).get()
		
		if (!userInfo.data || !userInfo.data.length) {
			return {
				code: 1,
				msg: '用户不存在'
			}
		}
		
		// 过滤敏感信息
		const userData = userInfo.data[0]
		delete userData.password
		
		return {
			code: 0,
			msg: '获取成功',
			data: userData
		}
	} catch (e) {
		console.log("e",e)
		return {
			code: 1,
			msg: '获取失败'
		}
	}
}

// 获取求职者列表
async function getUserList(data) {
	const { keyword = '', page = 1, pageSize = 10 } = data
	
	const query = {
		userType: 1 // 只查询求职者
	}
	
	if (keyword) {
		query.name = new RegExp(keyword, 'i')
	}
	
	try {
		const countResult = await db_userInformations.where(query).count()
		const { total } = countResult
		
		const listResult = await db_userInformations
			.where(query)
			.field({
				password: false // 排除密码字段
			})
			.skip((page - 1) * pageSize)
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