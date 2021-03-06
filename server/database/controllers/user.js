import mongoose from 'mongoose'
import UserMod from '../models/user'
import jwt from 'jsonwebtoken'
import config from '../../../config'
import uuid from 'uuid'

class User {
    constructor() {}

    async login(ctx) {
        const {username, password} = ctx.request.body
        const user = await UserMod.findOne({ username: username })

        let match = false
        if (user) match = await user.comparePassword(password, user.password)
        if (match) {
            ctx.session.user = {
                username: user.username,
                _id: user._id
            }
            
            const token = user.getToken()
            user.token = token
            await user.save()

            return (ctx.body = {
                success: true,
                data: {
                    username: user.username,
                    token: token
                }
            })
        }

        return (ctx.body = {
            success: false,
            message: '密码错误'
        })
    }

    async logout(ctx) {
        ctx.body = {
            success: true,
            message: "登出"
        }
    }

}

export default new User()