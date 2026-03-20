import User from '../models/user.model.js';

export const findOrCreateUser = async (email, data = {}) => {
    let user = await User.findOne({ email });

    if (!user) {
        // First time registration logic
        user = await User.create({ 
            email, 
            ...data, 
            isVerified: true 
        });
    }

    return user;
};

export const updateRefreshToken = async (userId, token) => {
    return await User.findByIdAndUpdate(userId, { refreshToken: token }, { new: true });
};

