const jwt = require("jsonwebtoken")
const { redisClient } = require("../services/redis")

const generateToken = async (id, res) => {
    const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '60m'
    })
    const refreshToken = jwt.sign({ id }, process.env.REFRESH_SECERET, {
        expiresIn: "7d"
    })

    const refreshTokenKey = `refresh_token:${id}`

    await redisClient.set(refreshTokenKey, refreshToken, { EX: 7 * 24 * 60 * 60 })

    res.cookie("access_token", accessToken, {

        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60 * 1000, // 60 minutes

    })

    res.cookie("refresh_token", refreshToken, {

        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    // const csrfToken = await generateCSRFToken(id, res)

    return { accessToken, refreshToken} // csrfToken}

}

const VerifyRefreshToken = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECERET)
        const storedRefreshToken = await redisClient.get(`refresh_token:${decoded.id}`)

        if(storedRefreshToken === refreshToken) {
            return decoded
        }

        return null
    }catch (error) {
        return null
    }
}

const generateNewAccessToken = async (id, res) => {
        const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '60m' })

        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 60 * 60 * 1000, // 60 minutes
        })
}

const revokeRefreshToken = async (id) => {
    await redisClient.del(`refresh_token:${id}`)
    await revokeCSRFToken()
}

module.exports = {generateToken, VerifyRefreshToken, generateNewAccessToken, revokeRefreshToken}
