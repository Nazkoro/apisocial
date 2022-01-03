const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class UserService {
    async registration(email, password, username) {
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4(); // v34fa-asfasf-142saf-sa-asf

        const user = await UserModel.create({email, username , password: hashPassword, activationLink})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user); // id, email, isActivated
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest('Неккоректная ссылка активации')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({email})
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async getAllUsers() {
        const users = await UserModel.find();
        console.log(users)
        return users;
    }
        //update user
    async updUser(id, bodyOfPost){
    const user = await UserModel.findByIdAndUpdate(id, {
        $set: bodyOfPost,
    });
        return res.status(200).json("Account has been updated");
    };
      
      //delete user
      async removeUser(id) {
        await UserModel.findByIdAndDelete(id);
        return res.status(200).json("Account has been deleted");
      };
      
      //get a user
    async printUser(id, usrname) {
        const userId = id;
        const username = usrname;
       
          const user = userId
            ? await UserModel.findById(userId)
            : await UserModel.findOne({ username: username });
          const { password, updatedAt, ...other } = user._doc;
         return res.status(200).json(other);
        
      };
      

      //get friends
      async printFriends(id) {
          const user = await UserModel.findById(id);
          const friends = await Promise.all(
            user.followings.map((friendId) => {
              return User.findById(friendId);
            })
          );
          let friendList = [];
          friends.map((friend) => {
            const { _id, username, profilePicture } = friend;
            friendList.push({ _id, username, profilePicture });
          });
          return res.status(200).json(friendList)
      };
      
      //follow a user
      
       async followUser(id, userId) {

            const user = await UserModel.findById(id);
            const currentUser = await UserModel.findById(userId);
            if (!user.followers.includes(userId)) {
              await user.updateOne({ $push: { followers: userId } });
              await currentUser.updateOne({ $push: { followings: id } });
              return res.status(200).json("user has been followed");
            } else {
              return res.status(403).json("you allready follow this user");
            }
          
      };
      
      //unfollow a user
      
     async unfollowUser (id, userId){
         
            const user = await UserModel.findById(id);
            const currentUser = await UserModel.findById(userId);
            if (user.followers.includes(userId)) {
              await user.updateOne({ $pull: { followers: userId } });
              await currentUser.updateOne({ $pull: { followings: id } });
              return res.status(200).json("user has been unfollowed");
            } else {
             return  res.status(403).json("you dont follow this user");
            }
          };
    
}

module.exports = new UserService();
